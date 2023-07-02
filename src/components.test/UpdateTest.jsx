import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateTest = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const location = useLocation();
  const testId = location.state?.testId;

  const[updatedTest, setUpdatedTest] = useState({
    'id':0,
    'content':''
  });

  useEffect(()=>{
    const getTest = async()=>{
      try{
        console.log(testId);
        const response = await axiosPrivate.get(`/tests/${testId}`);
        setUpdatedTest(response.data);
      }catch(e){
        console.log(e);
      }
    }
    getTest();
  },[axiosPrivate,testId])
  
  const updateTest = async(e)=>{
    e.preventDefault();
    try{
      const response = await axiosPrivate.put('/tests',updatedTest);
      console.log(response.data);
      document.getElementById('textAlert').innerHTML = "Test je uspesno sacuvan!";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  function handleInput(e){
    let newTest = updatedTest;
    newTest[e.target.name] = e.target.value;
    setUpdatedTest(newTest);
  }

  function validation(e){
    if(e.response.data.message.content!==undefined){
      document.getElementById('contentErr').style.visibility = 'visible';
      document.getElementById('contentErr').value = e.response.data.message.name;
    }
    else{
      document.getElementById("contentErr").style.visibility='hidden';
    }
    if(e.response.data.message.error!==undefined){
      document.getElementById('alert').style.visibility = 'visible';
      document.getElementById('textAlert').innerHTML = e.response.data.message.error;
    }
    else{
      document.getElementById('textAlert').innerHTML = "Student je uspesno sacuvan!";
      document.getElementById('alert').style.visibility = 'hidden';
    }
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Test je uspesno sacuvan!"){
      navigate("/tests");
    }
  }

  function cancel(e){
    e.preventDefault();
    navigate("/tests");
  }

  return (
    <div className='update'>
      <div className="update-div" id='update-div'>
        <form className="update-form" onSubmit={updateTest}>
          <label htmlFor="content">Naziv testa</label>
          <input type="text" name="content" placeholder='Unesite naziv testa' defaultValue={updatedTest.content} onInput={(e)=>handleInput(e)}/>
          <input type="text" name="contentErr" id="contentErr" readOnly/>
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
                    <p id="textAlert">Test je uspesno sacuvan!</p>
                    <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UpdateTest
