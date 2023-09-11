import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteQuestion, getQuestion } from '../services/QuestionService';

const DeleteQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const questionId = location.state?.questionId;
  const [isLoading, setIsLoading] = useState(false);

  const[deletedQuestion,setDeletedQuestion]=useState({
    "id":0,
    "content":''
  });

  useEffect(()=>{
    const retrieveQuestion = async()=>{
      setIsLoading(true);
      try{
        const response = await getQuestion(questionId);
        setDeletedQuestion(response);
      }catch(e){
        console.log(e);
      }finally{
        setIsLoading(false);
      }
    }
    retrieveQuestion();
  },[questionId])

  const removeQuestion = async()=>{
    setIsLoading(true);
    try{
      const response = await deleteQuestion(questionId);
      console.log(response.data);
      document.getElementById('textAlert').innerHTML = "Sistem je izbrisao pitanje";
    }catch(e){
      console.log(e);
      document.getElementById('textAlert').innerHTML = "Sistem ne moze da izbrise pitanje";     
    }finally{
      setIsLoading(false);
      document.getElementById('alert').style.visibility = 'visible';
    }
  }

  function prepareDelete(e){
    e.preventDefault();
    document.getElementById('alert-delete').style.visibility = 'visible';
  }

  function confirmDelete(e){
    e.preventDefault();
    document.getElementById('alert-delete').style.visibility = 'hidden';
    removeQuestion();
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate("/questions");
  }

  function cancel(e){
    e.preventDefault();
    clearCheckBoxes();
    navigate("/questions");
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate('/questions');
  }

  function clearCheckBoxes(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
  }

  if(questionId!==undefined && questionId!==0){
    return (
      <div className='delete'>
        <div className="delete-div">
          <form className="delete-form">
            <label htmlFor="content">Naziv pitanja</label>
            <input type="text" name="content" placeholder='Unesite naziv testa' defaultValue={deletedQuestion?.content} readOnly/>
            <div className='button'>
              <button id='prepareDelete'onClick={(e)=>prepareDelete(e)}>Obrisi</button>
              <button id="cancel" onClick={(e)=>cancel(e)}>Otkazi</button>
            </div>
          </form>
        </div>
        <div id="alert-delete">
          <div id="box-delete">
            <div className="obavestenje-delete">
              Upozorenje
            </div>
            <div className="sadrzaj-delete">
              <p id="textAlert-delete">Da li ste sigurni da zelite da obrisete pitanje?</p>
              <div className="button-delete">
                <button id="delete" onClick={(e)=>confirmDelete(e)}>Da</button>
                <button id="delete" onClick={(e)=>cancel(e)}>Ne</button>
              </div>
            </div>
          </div>
        </div>
        <div id="alert">
          <div id="box">
            <div className="obavestenje">
              Obaveštenje!
            </div>
            <div className="sadrzaj">
              <p id="textAlert">Sistem je izbrisao pitanje</p>
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
    </div>
    )
  }
}

export default DeleteQuestion
