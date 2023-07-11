import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteTest, getTest } from '../services/TestService';

const DeleteTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testId = location.state?.testId;

  const[deletedTest,setDeletedTest] = useState({
    'id':0,
    'content':''
  });

  useEffect(()=>{
    const retrieveTest = async()=>{
      try{
        const response = await getTest(testId);
        setDeletedTest(response);
      }catch(e){
        console.log(e);
      }
    }
    retrieveTest();
  },[testId])

  const removeTest = async()=>{
    try{
      const response = await deleteTest(testId);
      console.log(response);
      document.getElementById('textAlert').innerHTML = "Sistem je izbrisao test";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      document.getElementById('textAlert').innerHTML = "Sistem ne moze da izbrise test";
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
    removeTest();
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    navigate("/tests");
  }

  function cancel(e){
    e.preventDefault();
    navigate("/tests");
  }

  return (
    <div className='delete'>
      <div className="delete-div" id='delete-div'>
        <form className="delete-form">
          <label htmlFor="content">Naziv testa</label>
          <input type="text" name="content" placeholder='Unesite naziv testa' defaultValue={deletedTest?.content} readOnly/>
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
                <p id="textAlert-delete">Da li ste sigurni da zelite da obrisete test?</p>
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
                  <p id="textAlert">Sistem je izbrisao test</p>
                  <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
      </div>
    </div>
  )
}

export default DeleteTest
