import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import { createTest} from '../services/TestService';
import { getQuestions } from '../services/QuestionService';
import { validationTest } from '../validation/ValidationHandler';

const CreateTest = () => {

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
  const[testId,setTestId]=useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    setIsLoading(true);
    const getAllQuestions = async()=>{
      try{
        const response = await getQuestions(controller);
        isMounted && setQuestions(response);
      }catch(err){
        localStorage.clear();
        console.error(err);
        navigate('/login',{state:{from:location},replace:true});
      }finally{
        setIsLoading(false);
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
    setIsLoading(true);
    try{
      const response = await createTest(test);
      setTestId(response.id);
      document.getElementById('textAlert').innerHTML = "Sistem je zapamtio test";
    }catch(error){
      console.log(error);
      validation(error);
    }finally{
      setIsLoading(false);
      document.getElementById("alert").style.visibility='visible';
    }
  }

  function handleInput(e){
    let newTest = test;
    newTest[e.target.name] = e.target.value;
    setTest(newTest);
  }

  const handleSelectQuestions = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    if(selectedOptions[0]!==-1){
      setSelectedQuestions(selectedOptions);
    }
    else{
      setSelectedQuestions([]);
    }

    const filteredQuestionForPoints = questions.filter(question=>selectedOptions.includes(question.id.toString()));
    setQuestionsForPoints(filteredQuestionForPoints);
  };

  function potvrdi(){
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById("textAlert").innerHTML==="Sistem je zapamtio test"){
      navigate("/tests");
    }
  }

  function cancel(e){
    e.preventDefault();
    navigate("/tests");
  }

  function unSelectAll(e){
    e.preventDefault();
    setSelectedQuestions([]);
  }

  function validation(error){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti test";
    validationTest(error,document.getElementById('contentErr'));
  }

  return (
    <div className='create'>
      <div className="create-div">
        <form className="create-form" onSubmit={saveTest}>
          <label htmlFor="content">Naziv</label>
          <input type="text" name="content" placeholder='Unesite naziv' onInput={(e)=>handleInput(e)}/>
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
          <option value={-1} style={{color:'red'}}>Nije moguce ucitati listu pitanja</option>
        }
        </select>
        <button id="btn-unselectAll" onClick={(e) => unSelectAll(e)}>Ponisti izbor pitanja</button>
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
                    {questionsForPoints.length!==0 ? (
                      <div className="btn-confirm">
                        <Link id="link-add-question-test" to={testId!==0 && testId!==undefined && questionsForPoints.length!==0 ? "addQuestionTest" : "tests"} state={{questionsForPoints:questionsForPoints,testId:testId}} onClick={()=>potvrdi()}>Ubaci pitanja</Link>                        
                        <button id="btn-save-question" onClick={(e)=>potvrdi(e)}>OK</button>
                      </div>
                      ):
                      (
                      <div className="btn-confirm">
                        <button id="btn-save-question" onClick={(e)=>potvrdi(e)}>OK</button>
                      </div> 
                      )
                    }
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

export default CreateTest
