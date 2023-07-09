import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteStudentFromExams, getExamsOfStudent, getStudent, updateStudent } from '../services/StudentService';
import { validationStudent } from '../validation/ValidationHandler';

const UpdateStudent = () => {
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

  const[examsOfStudent,setExamsOfStudent] = useState([]);
  const[selectedExams, setSelectedExams] = useState([]);

  useEffect(()=>{
    const retrieveStudent = async()=>{
      try{
        const response = await getStudent(studentId);
        setUpdatedStudent(response);
      }catch(e){
        console.log(e);
      }
    }
    retrieveStudent();
  },[studentId])
  
  useEffect(()=>{
    const retrieveExamsOfStudent = async()=>{
      try{
        const response = await getExamsOfStudent(studentId);
        setExamsOfStudent(response);
      }catch(e){
        console.log(e);
      }
    }
    retrieveExamsOfStudent();
  },[studentId])

  const saveUpdatedStudent = async(e)=>{
    e.preventDefault();
    try{
      await deleteStudentFromExams(selectedExams,studentId);
      const response = await updateStudent(updatedStudent);
      console.log(response);

      document.getElementById('textAlert').innerHTML = "Sistem je zapamtio studenta";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(e){
      console.log(e);
      validation(e);
    }
  }

  const removeExams = async(e)=>{
    e.preventDefault();
    const filteredExamsOfStudent = examsOfStudent.filter(examOfStudent=>!selectedExams.includes(examOfStudent.exam.id.toString()));
    setExamsOfStudent(filteredExamsOfStudent);
  }

  const handleSelectExams = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedExams(selectedOptions);
  };

  function handleInput(e){
    let newStudent = updatedStudent;
    newStudent[e.target.name] = e.target.value;
    setUpdatedStudent(newStudent);
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Sistem je zapamtio studenta"){
      navigate("/students");
    }
    else if(document.getElementById('textAlert').innerHTML === "Sistem je izbacio studenta iz polaganja"){
      const filteredExamsOfStudent = examsOfStudent.filter(examOfStudent=>selectedExams.includes(examOfStudent.exam.id));
      setExamsOfStudent(filteredExamsOfStudent);
    }
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    navigate('/students');
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

  if(studentId!==undefined && studentId!==0){
    return (
      <div className='update'>
        <div className="update-div" id='update-div'>
          <form className="update-form" onSubmit={ saveUpdatedStudent}>
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
            <label htmlFor="exams">Polaganja studenta: </label>
            <select name="exams" id="selectionOption" multiple value={selectedExams} onChange={(e)=>handleSelectExams(e)}>
            {examsOfStudent?.length
            ? (
              <>
                {examsOfStudent.map((examOfStudent,i)=>
                <option key={i} value={examOfStudent.exam.id} style={{fontFamily:'cursive'}}>{examOfStudent.exam.name}</option>
                )}
              </>
            )
            :
            <option>Sistem ne moze da ucita polaganja</option>
            }
            </select>
            <div className='buttonExamsOfStudent'>
              <button className='btn-student-exam'>Ubaci studenta u novo polaganje</button>
              <button className='btn-student-exam'onClick={(e)=>removeExams(e)}>Izbaci studenta iz polaganja</button>
            </div>
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
                      <p id="textAlert">Student je uspesno sacuvan!</p>
                      <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
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

export default UpdateStudent
