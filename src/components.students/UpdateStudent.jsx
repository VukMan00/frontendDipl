import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {deleteStudentFromExams, getStudent, updateStudent } from '../services/StudentService';
import { validationStudent } from '../validation/ValidationHandler';
import { getExams } from '../services/ExamService';
import {BsArrowLeft,BsArrowRight} from 'react-icons/bs';
import moment from 'moment';

const UpdateStudent = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const studentId = location.state?.studentId;
  
  const[updatedStudent, setUpdatedStudent] = useState({
    'id':0,
    'name':'',
    'lastname':'',
    'email':'',
    'index':'',
    'birth':'',
    'results':''
  })

  const[dbExamsOfStudent,setDbExamsOfStudent]=useState([]);
  const[examsOfStudent,setExamsOfStudent] = useState([]);
  const[exams,setExams]=useState([]);
  
  const[selectedExamsForRemove, setSelectedExamsForRemove] = useState([]);
  const[selectedExamsForAdd,setSelectedExamsForAdd] = useState([]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    setIsLoading(true);
    const getAllExams = async()=>{
      try{
        const response = await getExams(controller);
        const availableExams = retrieveFutureExams(response);
        isMounted && setExams(availableExams);

      }catch(err){
        console.error(err);
        localStorage.clear();
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllExams();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[location,navigate])

  useEffect(()=>{
    const retrieveStudent = async()=>{
      try{
        const response = await getStudent(studentId);
        setUpdatedStudent(response);
        let convertedExams = [];
        for(let i=0;i<response?.results?.length;i++){
          convertedExams.push(response.results[i]?.exam);
        }
        setExamsOfStudent(convertedExams);
        setDbExamsOfStudent(convertedExams);
        setIsLoading(false);
      }catch(e){
        console.log(e);
      }
    }
    retrieveStudent();
  },[studentId])

  function retrieveFutureExams(listOfExams){
    const availableExams = [];
    for(let i=0;i<listOfExams.length;i++){
      const currentDate = moment().format('YYYY-MM-DD');
      const isLater = moment(listOfExams[i]?.date).isAfter(currentDate);
      if(isLater){
        availableExams.push(listOfExams[i]);
      }
    }
    return availableExams;
  }

  const saveUpdatedStudent = async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    try{
      const filteredRemoveExams = dbExamsOfStudent.filter(dbExam=>!examsOfStudent.includes(dbExam));
      if(filteredRemoveExams.length!==0){
        await deleteStudentFromExams(filteredRemoveExams,studentId);
      }
      updatedStudent.results = setResultsOfStudent();
      const response = await updateStudent(updatedStudent);
      console.log(response);
      setIsLoading(false);

      document.getElementById('textAlert').innerHTML = "Sistem je zapamtio studenta";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(err){
      console.log(err);
      setIsLoading(false);
      validation(err);
    }
  }

  function setResultsOfStudent(){
    const results = [];
    for(let i=0;i<examsOfStudent.length;i++){
      const resultExam = {
        "resultExamPK":{
          "studentId":studentId,
          "examId":examsOfStudent[i].id
        },
        "points":0,
        "grade":5
      }
      results.push(resultExam);
    }
    return results;
  }

  const removeExams = async(e)=>{
    e.preventDefault();
    const filteredExamsOfStudent = examsOfStudent.filter(examOfStudent=>!selectedExamsForRemove.includes(examOfStudent.id.toString()));
    setExamsOfStudent(filteredExamsOfStudent);
  }

  const addExams = async(e)=>{
    e.preventDefault();
    const filteredExams = exams.filter(exam=>selectedExamsForAdd.includes(exam.id.toString()));
    const mergedExams = examsOfStudent.concat(filteredExams);
    const uniqueExams = Array.from(
      new Map(mergedExams.map(obj => [obj.id, obj])).values()
    );
    setExamsOfStudent(uniqueExams);
  }

  const handleSelectExamsForRemove = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    if(selectedOptions[0]!==-1){
      setSelectedExamsForRemove(selectedOptions);
    }
    else{
      setSelectedExamsForRemove([]);
    }
  };

  const handleSelectExamsForAdd = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    if(selectedOptions[0]!==-1){
      setSelectedExamsForAdd(selectedOptions);
    }
    else{
      setSelectedExamsForAdd([]);
    }
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
      clearCheckBoxes();
      navigate("/students");
    }
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate('/students');
  }

  function cancel(e){
    e.preventDefault();
    clearCheckBoxes();
    navigate("/students");
  }

  function clearCheckBoxes(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
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
          <form className="update-form" onSubmit={saveUpdatedStudent}>
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
            <div className='listOfExams'>
              <div className='div-list-exams'>
                <label htmlFor="studentExams">Polaganja studenta: </label>
                <select name="studentExams" id="selectionOption" multiple value={selectedExamsForRemove} onChange={(e)=>handleSelectExamsForRemove(e)}>
                  {examsOfStudent?.length
                  ? (
                    <>
                      {examsOfStudent.map((examOfStudent,i)=>
                      <option key={i} value={examOfStudent?.id} style={{fontFamily:'cursive'}}>{examOfStudent?.name}</option>
                      )}
                    </>
                  )
                  :
                  <option value={-1} style={{color:'red'}}>Ne postoje prijavljena polaganje</option>
                  }
                </select>
              </div>
              <div className='div-list-exams'>
                <button className='btn-add-student-exam' onClick={(e)=>addExams(e)}><BsArrowLeft /></button>
                <button className='btn-remove-student-exam'onClick={(e)=>removeExams(e)}><BsArrowRight /></button>
              </div>
              <div className='div-list-exams'>
                <label htmlFor='exams'>Dostupna polaganja: </label>
                <select name="exams" id="selectionOption" multiple value={selectedExamsForAdd} onChange={(e)=>handleSelectExamsForAdd(e)}>
                  {exams?.length
                  ? (
                    <>
                      {exams.map((exam,i)=>
                      <option key={i} value={exam?.id} style={{fontFamily:'cursive'}}>{exam?.name}</option>
                      )}
                    </>
                  )
                  :
                  <option value={-1} style={{color:'red'}}>Nje moguce ucitati listu polaganja</option>
                  }
                </select>
              </div> 
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
            <p id="textAlert">Sistem ne moze da ucita studenta</p>
            <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
          </div>
      </div>
    </div>
    )
  }
}

export default UpdateStudent
