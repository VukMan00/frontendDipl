import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteAnswer, getAnswer } from '../services/AnswerService';

const DeleteAnswer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const questionId = location.state?.questionId;
  const answerId = location.state?.answerId;

  const[trueSolution,setTrueSolution]=useState();
  const[falseSolution,setFalseSolution]=useState();

  const[deletedAnswer,setDeletedAnswer]=useState({
    "answerPK":{
        "answerId":answerId,
        "questionId":questionId
    },
    "content":'',
    "solution":false
  })

  useEffect(()=>{
    const retrieveAnswer = async()=>{
        try{
            const response = await getAnswer(answerId,questionId);
            setDeletedAnswer(response);
            if(response.solution){
                setTrueSolution(true);
                setFalseSolution(false);
            }
            else{
                setTrueSolution(false);
                setFalseSolution(true);
            }
        }catch(err){
            console.log(err);
        }
    }
    retrieveAnswer();
  },[answerId,questionId])

  const removeAnswer = async()=>{
    try{
      const response = await deleteAnswer(answerId,questionId);
      console.log(response.data);

      document.getElementById('textAlert').innerHTML = "Sistem je izbrisao odgovor";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      document.getElementById('textAlert').innerHTML = "Sistem ne moze da izbrise odgovor";
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
    removeAnswer();
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate(-1);
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate(-1);
  }
  
  function cancel(e){
    e.preventDefault();
    clearCheckBoxes();
    navigate(-1);
  }

  function clearCheckBoxes(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
  }

  if(answerId!==undefined && answerId!==0){
    return (
        <div className='delete'>
            <div className="delete-div">
                <form className="delete-form">
                    <label htmlFor="content">Naziv odgovora</label>
                    <input type="text" name="content" placeholder='Unesite naziv odgovora' defaultValue={deletedAnswer.content} readOnly/>
                    <label htmlFor="solution">Resenje</label>
                    <label>
                        <input type='checkbox' id="trueSolution" className="answerId" value="Tacno" checked={trueSolution} readOnly/> Tacno
                    </label>
                    <label>
                        <input type='checkbox' id="falseSolution" className="answerId" value="Netacno" checked={falseSolution} readOnly/> Netacno
                    </label>
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
                        <p id="textAlert-delete">Da li ste sigurni da zelite da obrisete odgovor?</p>
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
                        <p id="textAlert">Sistem je izbrisao odgovor</p>
                        <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
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
                <p id="textAlert">Sistem ne moze da ucita odgovor</p>
                <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
                </div>
            </div>
        </div>
    )
  }
}

export default DeleteAnswer
