import React, { useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

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

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const saveTest = async(e)=>{
    e.preventDefault();
    try{
      console.log(test);
      const response = await axiosPrivate.post('/tests',test);
      console.log(response.data);
      document.getElementById('alert').style.visibility = 'visible';
      document.getElementById('textAlert').innerHTML = "Test je uspesno sacuvan!";
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  function handleInput(e){
    let newTest = test;
    newTest[e.target.name] = e.target.value;
    setTest(newTest);
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

  return (
    <div className='create'>
      <div className="create-div">
        <form className="create-form" onSubmit={saveTest}>
          <label htmlFor="content">Ime</label>
          <input type="text" name="content" placeholder='Unesite ime' onInput={(e)=>handleInput(e)}/>
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

export default CreateTest
