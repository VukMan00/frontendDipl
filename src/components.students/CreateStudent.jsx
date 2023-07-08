import React, { useEffect } from 'react'
import {useState} from "react";
import { useLocation, useNavigate} from 'react-router-dom';
import { getExams } from '../services/ExamService';
import { createStudent, saveResultExam } from '../services/StudentService';
import { validationStudent } from '../validation/ValidationHandler';

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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllExams = async()=>{
      try{
        const response = await getExams(controller);
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
  },[location,navigate])

  const saveStudent = async(e)=>{
    e.preventDefault();
    try{
      const response = await createStudent(student);
      insertStudentToExam(response.data.id);
      document.getElementById('textAlert').innerHTML = "Sistem je zapamtio studenta";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  const insertStudentToExam= async(studentId) =>{
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
          const response = await saveResultExam(resultExam);
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

  function validation(error){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti studenta";
    document.getElementById('alert').style.visibility = 'visible';

    validationStudent(error,document.getElementById("firstnameErr"),
                      document.getElementById("lastnameErr"),document.getElementById("indexErr"),
                      document.getElementById("emailErr"),document.getElementById("birthErr"));
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
          <label htmlFor="exams">Ubacite studenta u dostupna polaganja:</label>
          <select name="exams" id="selectionOption" multiple value={selectedExams} onChange={(e)=>handleSelectExams(e)}>
          {exams?.length
          ? (
            <>
              {exams.map((exam,i)=>
              <option key={i} value={exam.id} style={{fontFamily:'cursive'}}>{exam.name}</option>
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
