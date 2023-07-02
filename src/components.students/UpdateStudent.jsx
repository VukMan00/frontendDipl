import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateStudent = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const location = useLocation();
  const studentId = location.state?.studentId;
  
  const[updatedStudent, setUpdatedStudent] = useState({
    'id':0,
    'name':'',
    'lastname':'',
    'email':'',
    'index':'',
    'birth':''
  })

  useEffect(()=>{
    const getStudent = async()=>{
      try{
        console.log(studentId);
        const response = await axiosPrivate.get(`/students/${studentId}`);
        setUpdatedStudent(response.data);
      }catch(e){
        console.log(e);
      }
    }
    getStudent();
  },[axiosPrivate,studentId])
  

  const updateStudent = async(e)=>{
    e.preventDefault();
    try{
      const response = await axiosPrivate.put('/students',updatedStudent);
      console.log(response.data);
      document.getElementById('textAlert').innerHTML = "Student je uspesno sacuvan!";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  function handleInput(e){
    let newStudent = updatedStudent;
    newStudent[e.target.name] = e.target.value;
    setUpdatedStudent(newStudent);
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
    <div className='updateStudent'>
      <div className="updateStudent-div" id='updateStudent-div'>
        <form className="updateStudent-form" onSubmit={updateStudent}>
          <label htmlFor="name">Ime</label>
          <input type="text" name="name" placeholder='Unesite ime' defaultValue={updatedStudent.name} onInput={(e)=>handleInput(e)}/>
          <input type="text" name="firstnameErr" id="firstnameErr" readOnly/>
          <label htmlFor="lastname">Prezime</label>
          <input type="text" name="lastname" placeholder='Unesite prezime' defaultValue={updatedStudent.lastname} onInput={(e)=>handleInput(e)}/>
          <input type="text" name="lastnameErr" id="lastnameErr" readOnly/>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" placeholder='Unesite email' defaultValue={updatedStudent.email} onInput={(e)=>handleInput(e)}/>
          <input type="text" name="emailErr" id="emailErr" readOnly />
          <label htmlFor='index'>Indeks</label>
          <input type="text" name="index" placeholder='Unesite indeks' defaultValue={updatedStudent.index} onInput={(e)=>handleInput(e)}/>
          <input type="text" name="indexErr" id="indexErr" readOnly/>
          <label htmlFor='birth'>Datum rodjenja</label>
          <input type='date' name="birth" placeholder='Unesite datum rodjenja' defaultValue={updatedStudent.birth} onInput={(e)=>handleInput(e)} />
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

export default UpdateStudent
