import React, { useCallback, useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { deleteAnswersFromQuestion, deleteTestsFromQuestion, getQuestion, getTestsFromQuestion, updateQuestion } from '../services/QuestionService';
import {BsArrowLeft,BsArrowRight} from 'react-icons/bs';
import { getTests } from '../services/TestService';
import { validationQuestion } from '../validation/ValidationHandler';

const UpdateQuestion = ({newAnswers,newQuestionsTest}) => {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const questionId = location.state?.questionId;

  const[dbQuestionsTest,setDbQuestionsTest]=useState([]);
  const[questionsTest,setQuestionsTest]=useState([]);
  const[tests,setTests]=useState([]);
  const[dbAnswers,setDbAnswers]=useState([]);
  const[answers,setAnswers]=useState([]);

  const[selectedQuestionsTest,setSelectedQuestionsTest]=useState([]);
  const[selectedTests,setSelectedTests]=useState([]);
  const[selectedAnswers,setSelectedAnswers]=useState([]);

  const[updatedQuestion,setUpdatedQuestion]=useState({
    "id":0,
    "content":'',
    "tests":'',
    "answers":''
  })

  useEffect(()=>{
    const retrieveQuestion = async()=>{
      try{
        const response = await getQuestion(questionId);
        setAnswers(response.answers);
        setDbAnswers(response.answers);
        setUpdatedQuestion(response);
      }catch(e){
        setAnswers([]);
        console.log(e);
      }
    }
    retrieveQuestion();
  },[questionId])

  useEffect(()=>{
    setAnswers(newAnswers);
  },[newAnswers]);

  const mapIntoQuestionsTest = useCallback((dbTests)=>{
    const mapArray = [];
    for(let i=0;i<dbTests.length;i++){
      const questionTest={
        "questionTestPK":{
          "questionId":updatedQuestion.id,
          "testId":dbTests[i].id
        },
        "question":updatedQuestion,
        "test":dbTests[i],
        "points":0
      }
      const filteredQuestionTest = questionsTest.filter(qt=>qt.questionTestPK.testId===dbTests[i].id && qt.questionTestPK.questionId === updatedQuestion.id);
      if(filteredQuestionTest.length!==0){
        questionTest.points = filteredQuestionTest[0].points;
      }
      mapArray.push(questionTest);
    }
    return mapArray;
  },[updatedQuestion]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllTests = async()=>{
      try{
        const response = await getTests(controller);
        const mappedQuestionsTest = mapIntoQuestionsTest(response);
        console.log(mappedQuestionsTest);
        isMounted && setTests(mappedQuestionsTest);
      }catch(err){
        console.error(err);
        localStorage.clear();
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllTests();
    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[mapIntoQuestionsTest,axiosPrivate,location,navigate]) 

  useEffect(()=>{
    const retrieveTestsFromQuestion = async()=>{
      try{
        const response = await getTestsFromQuestion(questionId);
        setQuestionsTest(response);
        setDbQuestionsTest(response);
      }catch(e){
        console.log(e);
        setQuestionsTest([]);
      }
    }
    retrieveTestsFromQuestion();
  },[questionId])

  useEffect(()=>{
    setQuestionsTest(newQuestionsTest);
  },[newQuestionsTest]);

  const saveUpdatedQuestion = async(e)=>{
    e.preventDefault();
    try{
        const arrayAnswers = setAnswersForQuestion();
        console.log(arrayAnswers);
        const filteredRemoveQuestionsTest = dbQuestionsTest.filter(dbQuestionTest=>!questionsTest.includes(dbQuestionTest));
        const filteredRemoveAnswers = dbAnswers.filter(dbAnswer=>!arrayAnswers.includes(dbAnswer));
        if(filteredRemoveQuestionsTest.length!==0){
            await deleteTestsFromQuestion(filteredRemoveQuestionsTest,questionId);
        }
        if(filteredRemoveAnswers.length!==0){
            await deleteAnswersFromQuestion(filteredRemoveAnswers,questionId);
        }
        updatedQuestion.tests = questionsTest;
        updatedQuestion.answers = arrayAnswers;
        console.log(updatedQuestion);
        const response = await updateQuestion(updatedQuestion);
        console.log(response.data);
        document.getElementById('textAlert').innerHTML = "Sistem je zapamtio pitanje";
        document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
        console.log(e);
        validation(e);
    }
  }

  function setAnswersForQuestion(){
    const arrayAnswers = [];
    for(let i=0;i<answers.length;i++){
        const filterAnswer = answers.filter(a=>dbAnswers.includes(a.answerPK.answerId.toString()));
        console.log(filterAnswer.length);
        const answer={
            "answerPK":{
                "answerId":filterAnswer.length===0 ? 0 : filterAnswer?.answerPK?.answerId,
                "questionId":questionId
            },
            "content":answers[i].content,
            "solution":answers[i].solution,
        }
        arrayAnswers.push(answer);
    }
    return arrayAnswers;
  }

  function handleInput(e){
    let newQuestion = updatedQuestion;
    newQuestion[e.target.name] = e.target.value;
    setUpdatedQuestion(newQuestion);
  }

  const handleSelectQuestionsTest = (event) =>{
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedQuestionsTest(selectedOptions);
  }

  const handleSelectTests = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedTests(selectedOptions);
  }

  const handleSelectAnswers = (event)=>{
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedAnswers(selectedOptions);
  }   

  const addTests = async(e)=>{
    e.preventDefault();
    const filteredTests = tests.filter(test=>selectedTests.includes(test.questionTestPK.testId.toString()));
    const mergedTests = questionsTest.concat(filteredTests);
    const uniqueTests = Array.from(
      new Map(mergedTests.map(obj => [obj.questionTestPK.testId, obj])).values()
    );
    setQuestionsTest(uniqueTests);
  }

  const removeTests = (e)=>{
    e.preventDefault();
    const filteredTestsOfQuestion = questionsTest.filter(questionTest=>!selectedQuestionsTest.includes(questionTest.questionTestPK.testId.toString()));
    setQuestionsTest(filteredTestsOfQuestion);
  }

  const removeAnswers = (e)=>{
    e.preventDefault();
    const filteredAnswers = answers.filter(answer=>!selectedAnswers.includes(answer.answerPK.answerId.toString()));
    setAnswers(filteredAnswers);
   }
   
   function potvrdi(e){
     e.preventDefault();
     document.getElementById('alert').style.visibility = 'hidden';
     if(document.getElementById('textAlert').innerHTML === "Sistem je zapamtio pitanje"){
       navigate("/questions");
     }
   }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    navigate('/questions');
  }

  function cancel(e){
    e.preventDefault();
    navigate("/questions");
  }

  function validation(error){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti pitanje";
    document.getElementById('alert').style.visibility = 'visible';
    validationQuestion(error,document.getElementById('contentErr'));
  }
  
  if(questionId!==undefined && questionId!==0){
    return (
        <div className='update'>
            <div className="update-div">
                <form className="update-form" onSubmit={saveUpdatedQuestion}>
                    <label htmlFor="content">Naziv pitanja</label>
                    <input type="text" name="content" placeholder='Unesite naziv pitanja' defaultValue={updatedQuestion.content} onInput={(e)=>handleInput(e)}/>
                    <input type="text" name="contentErr" id="contentErr" readOnly/>
                    <label htmlFor='answers'>Odgovori</label>
                    <select name="answers" id="selectionOption" multiple value={selectedAnswers} onChange={(e)=>handleSelectAnswers(e)}>
                    {answers?.length
                    ? (
                        <>
                        {answers.map((a,i)=>
                        <option key={i} value={a?.answerPK?.answerId}>{a?.content}</option>
                        )}
                        </>
                    )
                    :
                    <option style={{color:'red'}}>Sistem ne moze da ucita odgovore</option>
                    }
                    </select>
                    <div className='button'>
                        <Link id='btn-add-answer' to={"addAnswer"} state={{answers:answers,questionId:questionId}}>Ubaci odgovor</Link>
                        <button id="btn-remove-answer" onClick={(e)=>removeAnswers(e)}>Izbaci odgovor</button>
                    </div>
                    <div className='listOfTests'>
                        <div className='div-list-tests'>
                            <label htmlFor="questionTests">Testovi pitanja: </label>
                            <select name="questionTests" id="selectionOption" multiple value={selectedQuestionsTest} onChange={(e)=>handleSelectQuestionsTest(e)}>
                                {questionsTest?.length
                                ?(
                                <>
                                {questionsTest.map((qt,i)=>
                                <option key={i} value={qt?.questionTestPK?.testId} style={{fontFamily:'cursive'}}>{qt?.test?.content + " " + qt?.points}</option>
                                )}
                                </>
                            )
                            :
                            <option style={{color:'red'}}>Sistem ne moze da ucita testove pitanja</option>
                            }
                            </select>
                        </div>
                        <div className='div-list-tests'>
                            <button id='btn-add-question-test' onClick={(e)=>addTests(e)}><BsArrowLeft /></button>
                            <button id='btn-remove-question-test'onClick={(e)=>removeTests(e)}><BsArrowRight /></button>
                        </div>
                        <div className='div-list-tests'>
                            <label htmlFor="testsQuestion">Dostupni testovi: </label>
                            <select name="testsQuestion" id="selectionOption" multiple value={selectedTests} onChange={(e)=>handleSelectTests(e)}>
                                {tests?.length
                                ?(
                                <>
                                {tests.map((test,i)=>
                                <option key={i} value={test?.questionTestPK.testId} style={{fontFamily:'cursive'}}>{test?.test.content + " " + test?.points} </option>
                                )}
                                </>
                            )
                            :
                            <option style={{color:'red'}}>Sistem ne moze da ucita testove</option>
                            }
                            </select>
                        </div>
                    </div>
                    <Link to={questionsTest.length!==0 ? "addQuestionTest" : ""} state={{questionsForPoints:questionsTest,updatedQuestion:updatedQuestion,questionId:questionId}}  className='btn-add-question-test'>Unesi broj poena pitanja</Link>
                    <div className='button'>
                        <input type="submit" name="saveQuestion" id="btn-save" value="Sacuvaj"/>
                        <button id="cancel" onClick={(e)=>cancel(e)}>Otkazi</button>
                    </div>
                </form>
            </div>
            <div id="alert">
                <div id="box">
                    <div className="obavestenje">
                        Obaveštenje!
                    </div>
                    <div className="sadrzaj">
                        <p id="textAlert">Sistem je zapamtio pitanje</p>
                        <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
  }
  else{
    return(
        <div id="alertWrong">
          <div id="box">
              <div className="obavestenje">
                Obaveštenje!
              </div>
              <div className="sadrzaj">
                <p id="textAlert">Sistem ne moze da ucita pitanje</p>
                <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
              </div>
          </div>
          <Outlet />
        </div>
    )
  }
}

export default UpdateQuestion
