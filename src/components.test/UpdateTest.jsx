import React, { useCallback, useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { deleteQuestionsFromTest, getQuestionsFromTest, getTest } from '../services/TestService';
import { getQuestions } from '../services/QuestionService';
import {BsArrowLeft,BsArrowRight} from 'react-icons/bs';
import { validationTest } from '../validation/ValidationHandler';

const UpdateTest = ({newQuestionsTest}) => {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const testId = location.state?.testId;

  const[updatedTest, setUpdatedTest] = useState({
    'id':0,
    'content':'',
    'author':'',
    'questions':''
  });

  const[dbQuestionsTest,setDbQuestionsTest]=useState([]);
  const[questionsTest,setQuestionsTest]=useState([]);
  const[selectedQuestionsTest,setSelectedQuestionsTest]=useState([]);
  const[selectedQuestions,setSelectedQuestions] = useState([]);
  const[questions,setQuestions]=useState([]);

  const mapIntoQuestionsTest = useCallback((dbQuestions)=>{
    const mapArray = [];
    for(let i=0;i<dbQuestions.length;i++){
      const questionTest={
        "questionTestPK":{
          "questionId":dbQuestions[i].id,
          "testId":updatedTest.id
        },
        "question":dbQuestions[i],
        "test":updatedTest,
        "points":0
      }
      const filteredQuestionTest = questionsTest.filter(qt=>qt.questionTestPK.questionId===dbQuestions[i].id && qt.questionTestPK.testId === updatedTest.id);
      if(filteredQuestionTest.length!==0){
        questionTest.points = filteredQuestionTest[0].points;
      }
      mapArray.push(questionTest);
    }

    return mapArray;
  },[updatedTest]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllQuestions = async()=>{
      try{
        const response = await getQuestions(controller);
        const mappedQuestionsTest = mapIntoQuestionsTest(response);
        isMounted && setQuestions(mappedQuestionsTest);
      }catch(err){
        console.error(err);
        localStorage.clear();
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllQuestions();
    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[mapIntoQuestionsTest,axiosPrivate,location,navigate]) 

  useEffect(()=>{
    const retrieveTest = async()=>{
      try{
        const response = await getTest(testId);
        setUpdatedTest(response);
      }catch(e){
        console.log(e);
      }
    }
    retrieveTest();
  },[testId])

  useEffect(()=>{
    const retrieveQuestionsFromTest = async()=>{
      try{
        const response = await getQuestionsFromTest(testId);
        setQuestionsTest(response);
        setDbQuestionsTest(response);
      }catch(e){
        console.log(e);
        setQuestionsTest([]);
      }
    }
    retrieveQuestionsFromTest();
  },[testId])

  useEffect(()=>{
    setQuestionsTest(newQuestionsTest);
  },[newQuestionsTest]);
  
  const updateTest = async(e)=>{
    e.preventDefault();
    try{
      const filteredRemoveQuestionsTest = dbQuestionsTest.filter(dbQuestionTest=>!questionsTest.includes(dbQuestionTest));
      if(filteredRemoveQuestionsTest.length!==0){
        await deleteQuestionsFromTest(filteredRemoveQuestionsTest,testId);
      }
      updatedTest.questions = questionsTest;
      const response = await axiosPrivate.put('/tests',updatedTest);
      console.log(response.data);
      document.getElementById('textAlert').innerHTML = "Test je uspesno sacuvan!";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  const handleSelectQuestionsTest = (event) =>{
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedQuestionsTest(selectedOptions);
  }

  const handleSelectQuestions = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedQuestions(selectedOptions);
  }

  function handleInput(e){
    let newTest = updatedTest;
    newTest[e.target.name] = e.target.value;
    setUpdatedTest(newTest);
  }

  const addQuestions = async(e)=>{
    e.preventDefault();
    const filteredQuestions = questions.filter(question=>selectedQuestions.includes(question.questionTestPK.questionId.toString()));
    const mergedQuestions = questionsTest.concat(filteredQuestions);
    const uniqueQuestions = Array.from(
      new Map(mergedQuestions.map(obj => [obj.questionTestPK.questionId, obj])).values()
    );
    setQuestionsTest(uniqueQuestions);
  }

  const removeQuestions = (e)=>{
    e.preventDefault();
    const filteredQuestionsOfTest = questionsTest.filter(questionTest=>!selectedQuestionsTest.includes(questionTest.questionTestPK.questionId.toString()));
    setQuestionsTest(filteredQuestionsOfTest);
  }

  function validation(error){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti test";
    document.getElementById('alert').style.visibility = 'visible';
    validationTest(error,document.getElementById('contentErr'));
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Test je uspesno sacuvan!"){
      navigate("/tests");
    }
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    navigate('/tests');
  }

  function cancel(e){
    e.preventDefault();
    navigate("/tests");
  }

  if(testId!==undefined && testId!==0){
    return (
      <div className='update'>
        <div className="update-div" id='update-div'>
          <form className="update-form" onSubmit={updateTest}>
            <label htmlFor="content">Naziv testa</label>
            <input type="text" name="content" placeholder='Unesite naziv testa' defaultValue={updatedTest.content} onInput={(e)=>handleInput(e)}/>
            <input type="text" name="contentErr" id="contentErr" readOnly/>
            <div className='listOfQuestions'>
              <div className='div-list-questions'>
                <label htmlFor="testQuestions">Pitanja testa: </label>
                <select name="testQuestions" id="selectionOption" multiple value={selectedQuestionsTest} onChange={(e)=>handleSelectQuestionsTest(e)}>
                    {questionsTest?.length
                    ?(
                    <>
                      {questionsTest.map((qt,i)=>
                      <option key={i} value={qt?.questionTestPK?.questionId} style={{fontFamily:'cursive'}}>{qt?.question?.content + " " + qt?.points}</option>
                      )}
                    </>
                  )
                  :
                  <option style={{color:'red'}}>Sistem ne moze da ucita pitanja testa</option>
                  }
                </select>
              </div>
              <div className='div-list-questions'>
                  <button id='btn-add-question-test' onClick={(e)=>addQuestions(e)}><BsArrowLeft /></button>
                  <button id='btn-remove-question-test'onClick={(e)=>removeQuestions(e)}><BsArrowRight /></button>
                </div>
              <div className='div-list-questions'>
                <label htmlFor="testQuestions">Dostupna pitanja: </label>
                <select name="testQuestions" id="selectionOption" multiple value={selectedQuestions} onChange={(e)=>handleSelectQuestions(e)}>
                    {questions?.length
                    ?(
                    <>
                      {questions.map((question,i)=>
                      <option key={i} value={question?.questionTestPK.questionId} style={{fontFamily:'cursive'}}>{question?.question.content + " " + question?.points} </option>
                      )}
                    </>
                  )
                  :
                  <option style={{color:'red'}}>Sistem ne moze da ucita pitanja</option>
                  }
                </select>
              </div>
            </div>
            <Link to={questionsTest.length!==0 ? "addQuestionTest" : ""} state={{questionsForPoints:questionsTest,updatedTest:updatedTest,testId:testId}}  className='btn-add-question-test'>Unesi broj poena pitanjima</Link>
            <div className='button'>
                <input type="submit" name="saveTest" id="btn-save" value="Sacuvaj"/>
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
                <p id="textAlert">Test je uspesno sacuvan!</p>
                <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    )
    }
    else{
      return (
        <div id="alertWrong">
          <div id="box">
              <div className="obavestenje">
                Obaveštenje!
              </div>
              <div className="sadrzaj">
                <p id="textAlert">Sistem ne moze da ucita test</p>
                <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
              </div>
          </div>
          <Outlet />
        </div>
      )
    }
}

export default UpdateTest
