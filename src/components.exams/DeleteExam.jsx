import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteExam, getExam } from '../services/ExamService';

const DeleteExam = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId;

  const[deletedExam,setDeletedExam]=useState({
    "id":0,
    "name":'',
    "amphitheater":'',
    "date":'',
    "test":'',
  });

  useEffect(()=>{
    const retrieveExam = async()=>{
      try{
        const response = await getExam(examId);
        setDeletedExam(response);
      }catch(e){
        console.log(e);
      }
    }
    retrieveExam();
  },[examId])

  const removeExam = async()=>{
    try{
      const response = await deleteExam(examId);
      console.log(response.data);

      document.getElementById('textAlert').innerHTML = "Sistem je izbrisao polaganje";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      document.getElementById('textAlert').innerHTML = "Sistem ne moze da izbrise polaganje";
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
    removeExam();
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    navigate("/exams");
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    navigate('/exams');
  }

  function cancel(e){
    e.preventDefault();
    navigate("/exams");
  }

  if(examId!==undefined && examId!==0){
    return (
      <div className='delete'>
        <div className="delete-div">
          <form className="delete-form">
            <label htmlFor="name">Naziv polaganja</label>
            <input type="text" name="name" value={deletedExam.name} readOnly/>
            <label htmlFor="amphitheater">Amfiteatar</label>
            <input type="text" name="amphitheater" value={deletedExam.amphitheater} readOnly/>
            <label htmlFor='date'>Datum polaganja</label>
            <input type='date' name="date" value={deletedExam.date} readOnly/>
            <label htmlFor='test'>Test</label>
            <input type='text' name="test" value={deletedExam.test.content} readOnly/>
          </form>
          <div className='button'>
            <button id='prepareDelete'onClick={(e)=>prepareDelete(e)}>Obrisi</button>
            <button id="cancel" onClick={(e)=>cancel(e)}>Otkazi</button>
          </div>
        </div>
        <div id="alert-delete">
          <div id="box-delete">
            <div className="obavestenje-delete">
              Upozorenje
            </div>
            <div className="sadrzaj-delete">
              <p id="textAlert-delete">Da li ste sigurni da zelite da obrisete studenta?</p>
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
              <p id="textAlert">Sistem je izbrisao studenta</p>
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
              <p id="textAlert">Sistem ne moze da ucita polaganje</p>
              <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
            </div>
        </div>
      </div>
    )
  }
}

export default DeleteExam
