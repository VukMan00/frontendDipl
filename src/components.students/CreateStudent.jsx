import React from 'react'
import {useState} from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate} from 'react-router-dom';

const CreateStudent = () => {

  const[student,setStudent] = useState({
    'name':'',
    'lastname':'',
    'email':'',
    'index':'',
    'birth':''
  });

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const saveStudent = async(e)=>{
    e.preventDefault();
    try{
      const response = await axiosPrivate.post('/students',student);
      console.log(response.data);
      document.getElementById('alert').style.visibility = 'visible';
      document.getElementById('textAlert').innerHTML = "Student je uspesno sacuvan!";
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  function handleInput(e){
    let newStudent = student;
    newStudent[e.target.name] = e.target.value;
    setStudent(newStudent);
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Student je uspesno sacuvan!"){
      navigate("/students");
    }
  }

  function cancel(e){
    e.preventDefault();
    navigate("/students");
  }

  function validation(e){
    if(e.response.data.message.name !== undefined){
        document.getElementById('firstnameErr').style.visibility = 'visible';
        document.getElementById('firstnameErr').value = e.response.data.message.name;
    }
    else{
        document.getElementById('firstnameErr').style.visibility = 'hidden';
    }
    if(e.response.data.message.lastname !== undefined){
        document.getElementById('lastnameErr').style.visibility = 'visible';
        document.getElementById('lastnameErr').value = e.response.data.message.lastname;
    }
    else{
        document.getElementById('lastnameErr').style.visibility = 'hidden';
    }
    if(e.response.data.message.index !== undefined){
        document.getElementById('indexErr').style.visibility = 'visible';
        document.getElementById('indexErr').value = e.response.data.message.index;
    }
    else{
        document.getElementById('indexErr').style.visibility = 'hidden';
    }
    if(e.response.data.message.email!==undefined){
        document.getElementById("emailErr").style.visibility = 'visible';
        document.getElementById('emailErr').value = e.response.data.message.email;
    }
    else{
        document.getElementById("emailErr").style.visibility='hidden';
    }
    if(e.response.data.message.birth!==undefined){
        document.getElementById('birthErr').style.visibility = 'visible';
        document.getElementById('birthErr').value = e.response.data.message.birth;
    }
    else{
        document.getElementById('birthErr').style.visibility = 'hidden';
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
    <div className='createStudent'>
      <div className="createStudent-div">
        <form className="createStudent-form" onSubmit={saveStudent}>
          <label htmlFor="firstname">Ime</label>
          <input type="text" name="name" placeholder='Unesite ime' onInput={(e)=>handleInput(e)}/>
          <input type="text" name="firstnameErr" id="firstnameErr" readOnly/>
          <label htmlFor="lastname">Prezime</label>
          <input type="text" name="lastname" placeholder='Unesite prezime' onInput={(e)=>handleInput(e)}/>
          <input type="text" name="lastnameErr" id="lastnameErr" readOnly/>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" placeholder='Unesite email' onInput={(e)=>handleInput(e)}/>
          <input type="text" name="emailErr" id="emailErr" readOnly />
          <label htmlFor='index'>Indeks</label>
          <input type="text" name="index" placeholder='Unesite indeks' onInput={(e)=>handleInput(e)}/>
          <input type="text" name="indexErr" id="indexErr" readOnly/>
          <label htmlFor='birth'>Datum rodjenja</label>
          <input type='date' name="birth" placeholder='Unesite datum rodjenja' onInput={(e)=>handleInput(e)} />
          <input type="text" name="birthErr" id="birthErr" readOnly/>
          <div className='button'>
              <input type="submit" name="saveStudent" id="btn-saveStudent" value="Sacuvaj"/>
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
                    <p id="textAlert">Student je uspesno sacuvan!</p>
                    <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateStudent
