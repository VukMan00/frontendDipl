import React,{ useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteStudent, getStudent } from '../services/StudentService';

const DeleteStudent = () => {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const studentId = location.state?.studentId;

  const[deletedStudent,setDeletedStudent] = useState({
    'id':0,
    'name':'',
    'lastname':'',
    'email':'',
    'index':'',
    'birth':''
  });

  useEffect(()=>{
    const retrieveStudent = async()=>{
      setIsLoading(true);
      try{
        const response = await getStudent(studentId);
        setDeletedStudent(response);
      }catch(e){
        console.log(e);
      }finally{
        setIsLoading(false);
      }
    }
    retrieveStudent();
  },[studentId])

  const removeStudent = async()=>{
    setIsLoading(true);
    try{
      const response = await deleteStudent(studentId);
      console.log(response.data);
      document.getElementById('textAlert').innerHTML = "Sistem je izbrisao studenta";
    }catch(e){
      console.log(e);
      document.getElementById('textAlert').innerHTML = "Sistem ne moze da izbrise studenta";
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
    removeStudent();
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate("/students");
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate('/students');
  }

  function cancel(e){
    e.preventDefault();
    clearCheckBoxes();
    navigate("/students");
  }

  function clearCheckBoxes(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
  }

  if(studentId!==undefined && studentId!==0){
  return (
    <div className='delete'>
      <div className="delete-div" id='delete-div'>
        <form className="delete-form">
          <label htmlFor="name">Ime</label>
          <input type="text" name="name" placeholder='Unesite ime' defaultValue={deletedStudent.name} readOnly/>
          <label htmlFor="lastname">Prezime</label>
          <input type="text" name="lastname" placeholder='Unesite prezime' defaultValue={deletedStudent.lastname} readOnly/>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" placeholder='Unesite email' defaultValue={deletedStudent.email} readOnly/>
          <label htmlFor='index'>Indeks</label>
          <input type="text" name="index" placeholder='Unesite indeks' defaultValue={deletedStudent.index} readOnly/>
          <label htmlFor='birth'>Datum rodjenja</label>
          <input type='date' name="birth" placeholder='Unesite datum rodjenja' defaultValue={deletedStudent.birth} readOnly/>
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
            <p id="textAlert">Sistem ne moze da ucita studenta</p>
            <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
          </div>
      </div>
    </div>
    )
  }
}

export default DeleteStudent
