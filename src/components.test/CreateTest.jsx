import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { createTest, saveQuestionTest} from '../services/TestService';
import { getQuestions } from '../services/QuestionService';
import { validationTest } from '../validation/ValidationHandler';

const CreateTest = ({questionsTest}) => {

  const[professor] = useState({
    "id":window.localStorage.getItem("id"),
    "name":window.localStorage.getItem("firstname"),
    "lastname":window.localStorage.getItem("lastname"),
    "email":window.localStorage.getItem("username")
  })

  const[test,setTest] = useState({
    'content':'',
    'author':professor
  })

  const[questions,setQuestions] = useState([]);
  const[questionsForPoints,setQuestionsForPoints] = useState([]);
  const[selectedQuestions,setSelectedQuestions]=useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllQuestions = async()=>{
      try{
        const response = await getQuestions(controller);
        isMounted && setQuestions(response);
      }catch(err){
        console.error(err);
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllQuestions();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[location,navigate])

  const saveTest = async(e)=>{
    e.preventDefault();
    try{
      const response = await createTest(test);
      addQuestionsTest(response.id);  
    }catch(error){
      console.log(error);
      validation(error);
    }
  }

  const addQuestionsTest = async(id)=>{
    try{
      if(questionsTest.length!==0){
        await saveQuestionTest(questionsTest,id);
      }
      document.getElementById('textAlert').innerHTML = 'Sistem je zapamtio test';
      document.getElementById("alert").style.visibility = 'visible';
    }catch(error){
      console.log(error);
      document.getElementById('textAlert').innerHTML = 'Sistem ne moze da zapamti pitanja u test';
      document.getElementById("alert").style.visibility = 'visible';
    }
  }

  function handleInput(e){
    let newTest = test;
    newTest[e.target.name] = e.target.value;
    setTest(newTest);
  }

  const handleSelectQuestions = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedQuestions(selectedOptions);
    const filteredQuestionForPoints = questions.filter(question=>selectedOptions.includes(question.id.toString()));
    setQuestionsForPoints(filteredQuestionForPoints);
  };

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Sistem je zapamtio test" || document.getElementById('textAlert').innerHTML === "Sistem ne moze da zapamti pitanja u test"){
      navigate("/tests");
    }
  }

  function cancel(e){
    e.preventDefault();
    navigate("/tests");
  }

  function validation(error){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti test";
    document.getElementById('alert').style.visibility = 'visible';
    validationTest(error,document.getElementById('contentErr'));
  }

  return (
    <div className='create'>
      <div className="create-div">
        <form className="create-form" onSubmit={saveTest}>
          <label htmlFor="content">Ime</label>
          <input type="text" name="content" placeholder='Unesite ime' onInput={(e)=>handleInput(e)}/>
          <input type="text" name="contentErr" id="contentErr" readOnly/>
          <label htmlFor="questions">Ubacite pitanja u test:</label>
          <select name="questions" id="selectionOption" multiple value={selectedQuestions} onChange={(e)=>handleSelectQuestions(e)}>
          {questions?.length
          ? (
            <>
              {questions.map((question,i)=>
              <option key={i} value={question.id}>{question.content}</option>
              )}
            </>
          )
          :
          <option>Sistem ne moze da ucita pitanja</option>
        }
        </select>
        <Link to={"addQuestionTest"} className='btn-add-question-test' state={{questionsForPoints:questionsForPoints}}>Unesi broj poena pitanjima</Link>
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
      <Outlet />
    </div>
  )
}

export default CreateTest
