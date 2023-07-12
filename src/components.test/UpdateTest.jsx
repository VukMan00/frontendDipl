import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getQuestionsFromTest, getTest } from '../services/TestService';
import { getQuestions } from '../services/QuestionService';
import {BsArrowLeft,BsArrowRight} from 'react-icons/bs';
import { validationTest } from '../validation/ValidationHandler';

const UpdateTest = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const location = useLocation();
  const testId = location.state?.testId;

  const[updatedTest, setUpdatedTest] = useState({
    'id':0,
    'content':''
  });

  const[questionsTest,setQuestionsTest]=useState([]);
  const[selectedQuestionsTest,setSelectedQuestionsTest]=useState([]);
  const[questions,setQuestions]=useState([]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllQuestions = async()=>{
      try{
        const response = await getQuestions(controller);
        isMounted && setQuestions(response);
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
  },[axiosPrivate,location,navigate]) 

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
      }catch(e){
        console.log(e);
      }
    }
    retrieveQuestionsFromTest();
  },[testId])
  
  const updateTest = async(e)=>{
    e.preventDefault();
    try{
      const response = await axiosPrivate.put('/tests',updatedTest);
      console.log(response.data);
      document.getElementById('textAlert').innerHTML = "Test je uspesno sacuvan!";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  function handleSelectQuestionsTest(e){
    e.preventDefault();
    //DEFINISI
  }

  function handleSelectQuestions(e){
    e.preventDefault();
    //DEFINISI
  }

  function handleInput(e){
    let newTest = updatedTest;
    newTest[e.target.name] = e.target.value;
    setUpdatedTest(newTest);
  }

  function addQuestions(e){
    e.preventDefault();
    //DEFINISI
  }

  function removeQuestions(e){
    e.preventDefault();
    //DEFINISI
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

  function cancel(e){
    e.preventDefault();
    navigate("/tests");
  }

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
                    {questionsTest.map((questionTest,i)=>
                    <option key={i} value={questionTest?.questionTestPK} style={{fontFamily:'cursive'}}>{questionTest?.question?.content}</option>
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
              <select name="testQuestions" id="selectionOption" multiple value={selectedQuestionsTest} onChange={(e)=>handleSelectQuestions(e)}>
                  {questions?.length
                  ?(
                  <>
                    {questions.map((question,i)=>
                    <option key={i} value={question?.id} style={{fontFamily:'cursive'}}>{question?.content}</option>
                    )}
                  </>
                )
                :
                <option style={{color:'red'}}>Sistem ne moze da ucita pitanja</option>
                }
              </select>
            </div>
          </div>
          <Link to={"addQuestionTest"} className='btn-add-question-test'>Unesi broj poena pitanjima</Link>
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
    </div>
  )
}

export default UpdateTest
