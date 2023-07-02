import React,{ useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

const DeleteStudent = () => {
  const axiosPrivate = useAxiosPrivate();
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
    const getStudent = async()=>{
      try{
        const response = await axiosPrivate.get(`/students/${studentId}`);
        console.log(response.data);
        setDeletedStudent(response.data);
      }catch(e){
        console.log(e);
      }
    }
    getStudent();
  },[axiosPrivate,studentId])

  const deleteStudent = async()=>{
    try{
      const response = await axiosPrivate.delete(`/students/${studentId}`);
      console.log(response.data);
      document.getElementById('textAlert').innerHTML = "Student je uspesno obrisan!";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
    }
  }

  function prepareDelete(e){
    e.preventDefault();
    document.getElementById('alert-delete').style.visibility = 'visible';
  }

  function confirmDelete(e){
    e.preventDefault();
    document.getElementById('alert-delete').style.visibility = 'hidden';
    deleteStudent();
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    navigate("/students");
  }

  function cancel(e){
    e.preventDefault();
    navigate("/students");
  }

  return (
    <div className='deleteStudent'>
      <div className="deleteStudent-div" id='deleteStudent-div'>
        <form className="deleteStudent-form">
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
                  <p id="textAlert">Student je uspesno obrisan!</p>
                  <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
      </div>
    </div>
  )
}

export default DeleteStudent
