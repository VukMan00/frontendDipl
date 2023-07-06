import React, { useEffect } from 'react'
import {useState} from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate} from 'react-router-dom';

const CreateStudent = () => {

  const[student,setStudent] = useState({
    'name':'',
    'lastname':'',
    'email':'',
    'index':'',
    'birth':''
  });

  const[exams,setExams] = useState();

  const[selectedExams, setSelectedExams] = useState([]);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllExams = async()=>{
      try{
        const response = await axiosPrivate.get('/exams',{
          signal : controller.signal
        });
        isMounted && setExams(response.data);

      }catch(err){
        console.error(err);
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllExams();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[axiosPrivate,location,navigate])

  const saveStudent = async(e)=>{
    e.preventDefault();
    try{
      const response = await axiosPrivate.post('/students',student);
      saveResultExam(response.data.id);
      document.getElementById('textAlert').innerHTML = "Sistem je zapamtio studenta";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  const saveResultExam = async(studentId) =>{
      for(let i=0;i<selectedExams.length;i++){
        const resultExam = {
          "resultExamPK":{
            "studentId":studentId,
            "examId":selectedExams[i]
          },
          "points":0,
          "grade":5
        }
        try{
          const response = await axiosPrivate.post("/students/results",resultExam);
          console.log(response.data);
        }catch(e){
          console.log(e);
        }
      }
  }

  function handleInput(e){
    let newStudent = student;
    newStudent[e.target.name] = e.target.value;
    setStudent(newStudent);
  }

  const handleSelectExams = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedExams(selectedOptions);
  };

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Sistem je zapamtio studenta"){
      navigate("/students");
    }
  }

  function cancel(e){
    e.preventDefault();
    navigate("/students");
  }

  function validation(e){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti studenta";
    document.getElementById('alert').style.visibility = 'visible';

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
  }

  return (
    <div className='create'>
      <div className="create-div">
        <form className="create-form" onSubmit={saveStudent}>
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
          <label htmlFor="exams">Ubacite studenta u polaganja:</label>
          <select name="exams" id="selectionOption" multiple value={selectedExams} onChange={(e)=>handleSelectExams(e)}>
          {exams?.length
          ? (
            <>
              {exams.map((exam,i)=>
              <option key={i} value={exam.id}>{exam.name}</option>
              )}
            </>
          )
          :
          <option>Sistem ne moze da ucita polaganja</option>
        }
        </select>
          <div className='button'>
            <input type="submit" name="saveStudent" id="btn-save" value="Sacuvaj"/>
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
                    <p id="textAlert">Sistem je zapamtio studenta</p>
                    <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateStudent
