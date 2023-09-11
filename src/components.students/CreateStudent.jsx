import React, { useEffect } from 'react'
import {useState} from "react";
import { useLocation, useNavigate} from 'react-router-dom';
import { getExams } from '../services/ExamService';
import moment from 'moment';
import { createStudent} from '../services/StudentService';
import { validationStudent } from '../validation/ValidationHandler';

const CreateStudent = () => {

  const[student,setStudent] = useState({
    'name':'',
    'lastname':'',
    'email':'',
    'index':'',
    'birth':'',
    'results':''
  });

  const [isLoading, setIsLoading] = useState(false);

  const[exams,setExams] = useState();

  const[selectedExams, setSelectedExams] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

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
        navigate('/login',{state:{from:location},replace:true});
      }finally{
        setIsLoading(false);
      }
    }
    getAllExams();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[location,navigate])

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

  const saveStudent = async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    try{
      student.results = setResultsOfStudent();
      const response = await createStudent(student);
      console.log(response);
      document.getElementById('textAlert').innerHTML = "Sistem je zapamtio studenta";
    }catch(error){
      console.log(error);
      validation(error);
    }
    finally{
      setIsLoading(false);
      document.getElementById('alert').style.visibility = 'visible';
    }
  }

  function setResultsOfStudent(){
    const results = [];
    for(let i=0;i<selectedExams.length;i++){
      const resultExam = {
        "resultExamPK":{
          "studentId":'',
          "examId":selectedExams[i]
        },
        "points":0,
        "grade":5
      }
      results.push(resultExam);
    }
    return results;
  }

  function handleInput(e){
    let newStudent = student;
    newStudent[e.target.name] = e.target.value;
    setStudent(newStudent);
  }

  const handleSelectExams = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    if(selectedOptions[0]!==-1){
      setSelectedExams(selectedOptions);
    }
    else{
      setSelectedExams([]);
    }

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

  function unSelectAll(e){
    e.preventDefault();
    setSelectedExams([]);
  }

  function validation(error){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti studenta";

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
          <option style={{color:'red'}} value={-1}>Nije moguce ucitati listu polaganja</option>
        }
        </select>
        <button id="btn-unselectAll" onClick={(e) => unSelectAll(e)}>Ponisti izbor polaganja</button>
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

export default CreateStudent
