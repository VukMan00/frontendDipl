import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

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

  const[questions,setQuestions] = useState();
  const[selectedQuestions, setSelectedQuestions] = useState([]);
  const[arrayQuestionTest, setArrayQuestionTest] = useState([]);
  const[testId,setTestId]=useState(0);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllQuestions = async()=>{
      try{
        const response = await axiosPrivate.get('/questions',{
          signal : controller.signal
        });
        isMounted && setQuestions(response.data);

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
  },[axiosPrivate,location,navigate])

  const saveTest = async(e)=>{
    e.preventDefault();
    try{
      const response = await axiosPrivate.post('/tests',test);
      if(selectedQuestions.length!==0){
        setTestId(response.data.id);
        document.getElementById('alertPoints').style.visibility = 'visible';
      }
      else{
        document.getElementById('alert').style.visibility = 'visible';
        document.getElementById('textAlert').innerHTML = "Sistem je zapamtio test";
      }
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  const saveQuestionsTest = async(e)=>{
    e.preventDefault();
    for(let i=0;i<arrayQuestionTest.length;i++){
      const questionTest = {
        "questionTestPK":{
          "questionId":arrayQuestionTest[i].questionId,
          "testId":testId
        },
        "points":arrayQuestionTest[i].points
      }
      try{
        await axiosPrivate.post("/tests/questions",questionTest);
        document.getElementById('alert').style.visibility = 'visible';
        document.getElementById('textAlert').innerHTML = "Sistem je zapamtio test";
      }catch(e){
        console.log(e);
      }
    }
  }

  function handleInput(e){
    let newTest = test;
    newTest[e.target.name] = e.target.value;
    setTest(newTest);
  }

  function handlePoints(e,idSelectedQuestion){
    const questionTest = {
      "questionId":idSelectedQuestion,
      "points" : e.target.value
    }
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti test";
    setArrayQuestionTest([...arrayQuestionTest,questionTest]);
  }

  function confirmPoints(e){
    e.preventDefault();
    document.getElementById('alertPoints').style.visibility = 'hidden';
    saveQuestionsTest(e);
  }

  const handleSelectQuestions = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedQuestions(selectedOptions);
  };

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Sistem je zapamtio test"){
      navigate("/tests");
    }
  }

  function cancel(e){
    e.preventDefault();
    navigate("/tests");
  }

  function validation(e){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti test";
    document.getElementById('alert').style.visibility = 'visible';

    if(e.response.data.message.content!==undefined){
      document.getElementById('contentErr').style.visibility = 'visible';
      document.getElementById('contentErr').value = e.response.data.message.content;
    }
    else{
      document.getElementById("contentErr").style.visibility='hidden';
    }
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
      <div id="alertPoints">
            <div id="box">
                <div className="obavestenje">
                    Unesite poene pitanjima!
                </div>
                <div className="sadrzaj">
                  {selectedQuestions?.length
                  ? (
                    <>
                      {selectedQuestions.map((selectedQuestion,i)=>
                      <div className='setPoints'>
                        <label htmlFor="points" style={{color:'black'}}>Pitanje sa id-em: {selectedQuestion}</label>
                        <input name="points" key={selectedQuestion} type="text" placeholder='Unesite poene' onInput={(e)=>handlePoints(e,selectedQuestion)}/>
                      </div>
                      )}
                    </>
                    )
                    :
                    <option>Sistem ne moze da ucita pitanja</option>
                  }
                  <button id="confirm" onClick={(e)=>confirmPoints(e)}>OK</button>
                </div>
            </div>
      </div>
    </div>
  )
}

export default CreateTest
