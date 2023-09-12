import React, { useCallback, useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { deleteQuestionsFromTest, getQuestionsFromTest, getTest, saveQuestionTest, updateTest } from '../services/TestService';
import { getQuestions } from '../services/QuestionService';
import {BsArrowLeft,BsArrowRight} from 'react-icons/bs';
import { validationTest } from '../validation/ValidationHandler';

const UpdateTest = ({newQuestionsTest}) => {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      try{
        const response = await getTest(testId);
        setUpdatedTest(response);
        setQuestionsTest(response?.questions);
        setDbQuestionsTest(response?.questions);
      }catch(e){
        console.log(e);
      }finally{
        setIsLoading(false);
      }
    }
    retrieveTest();
  },[testId])

  useEffect(()=>{
    setQuestionsTest(newQuestionsTest);
  },[newQuestionsTest]);
  
  const saveUpdatedTest = async(e)=>{
    setIsLoading(true);
    e.preventDefault();
    try{
      console.log(questionsTest);
      const filteredRemoveQuestionsTest = dbQuestionsTest.filter(dbQuestionTest=>!questionsTest.includes(dbQuestionTest));
      console.log(filteredRemoveQuestionsTest);
      if(filteredRemoveQuestionsTest.length!==0){
        await deleteQuestionsFromTest(filteredRemoveQuestionsTest,testId);
      }
      updatedTest.questions = questionsTest;
      const response = await updateTest(updatedTest);
      console.log(response);
      await saveQuestionTest(questionsTest);
      document.getElementById('textAlert').innerHTML = "Sistem je zapamtio test";
    }catch(e){
      console.log(e);
      validation(e);
    }finally{
      setIsLoading(false);
      document.getElementById('alert').style.visibility = 'visible';
    }
  }

  const handleSelectQuestionsTest = (event) =>{
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    if(selectedOptions[0]!==-1){
      setSelectedQuestionsTest(selectedOptions);
    }
    else{
      setSelectedQuestionsTest([]);
    }
  }

  const handleSelectQuestions = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    if(selectedOptions[0]!==-1){
      setSelectedQuestions(selectedOptions);
    }
    else{
      setSelectedQuestions([]);
    }
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
    validationTest(error,document.getElementById('contentErr'));
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Sistem je zapamtio test"){
      clearCheckBoxes();
      navigate("/tests");
    }
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate('/tests');
  }

  function cancel(e){
    e.preventDefault();
    clearCheckBoxes();
    navigate("/tests");
  }

  function clearCheckBoxes(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
  }

  if(testId!==undefined && testId!==0){
    return (
      <div className='update'>
        <div className="update-div" id='update-div'>
          <form className="update-form" onSubmit={saveUpdatedTest}>
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
                      <option key={i} value={qt?.questionTestPK?.questionId} style={{fontFamily:'cursive'}}>{qt?.question?.content + " - " + qt?.points}</option>
                      )}
                    </>
                  )
                  :
                  <option value={-1} style={{color:'red'}}>Ne postoje pitanja testa</option>
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
                      <option key={i} value={question?.questionTestPK.questionId} style={{fontFamily:'cursive'}}>{question?.question.content + " - " + question?.points} </option>
                      )}
                    </>
                  )
                  :
                  <option value={-1} style={{color:'red'}}>Nije moguce ucitati listu pitanja</option>
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
                <p id="textAlert">Sistem je zapamtio test</p>
                <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
            </div>
          </div>
        </div>
        <div id="alertLoading" style={isLoading ? {visibility:'visible'} : {visibility:'hidden'}}>
            <div id="boxLoading">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlertLoading">Ucitavanje...</p>
                    <p id='textAlertLoading'>Molimo Vas sacekajte!</p>
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
