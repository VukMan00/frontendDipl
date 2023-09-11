import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteTest, getTest } from '../services/TestService';

const DeleteTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const testId = location.state?.testId;

  const[deletedTest,setDeletedTest] = useState({
    'id':0,
    'content':''
  });

  useEffect(()=>{
    const retrieveTest = async()=>{
      setIsLoading(true);
      try{
        const response = await getTest(testId);
        setDeletedTest(response);
        setIsLoading(false);
      }catch(e){
        console.log(e);
        setIsLoading(false);
      }
    }
    retrieveTest();
  },[testId])

  const removeTest = async()=>{
    try{
      setIsLoading(true);
      const response = await deleteTest(testId);
      console.log(response);
      setIsLoading(false);
      document.getElementById('textAlert').innerHTML = "Sistem je izbrisao test";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      setIsLoading(false);
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
    clearCheckBoxes();
    navigate("/tests");
  }

  function cancel(e){
    e.preventDefault();
    clearCheckBoxes();
    navigate("/tests");
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate('/tests');
  }

  function clearCheckBoxes(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
  }

  if(testId!==undefined && testId!==0){
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
            <p id="textAlert">Sistem ne moze da ucita test</p>
            <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
          </div>
        </div>
    </div>
    )
  }
}

export default DeleteTest
