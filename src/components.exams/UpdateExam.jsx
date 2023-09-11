import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getTests } from '../services/TestService';
import { deleteExamsFromStudent, getExam, getStudentsOfExam, updateExam } from '../services/ExamService';
import {BsArrowLeft,BsArrowRight} from 'react-icons/bs';
import { getStudents } from '../services/StudentService';
import { validationExam } from '../validation/ValidationHandler';

const UpdateExam = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId;
  const [isLoading, setIsLoading] = useState(false);

  const[updatedExam,setUpdatedExam]=useState({
    "id":0,
    "name":'',
    "amphitheater":'',
    "date":'',
    "test":'',
    "results":''
  })

  const[test,setTest]=useState({
    "id":0,
    "content":'',
    "author":''
  })

  const[tests,setTests]=useState([]);
  const[selectedTest,setSelectedTest]=useState();
  const[studentsOfExam,setStudentsOfExam]=useState([]);
  const[dbStudentsOfExam,setDbStudentsOfExam]=useState([]);
  const[students,setStudents]=useState([]);

  const[selectedStudentsToRemove,setSelectedStudentsToRemove]=useState([]);
  const[selectedStudentsToAdd,setSelectedStudentsToAdd]=useState([]);

  useEffect(()=>{
    const retrieveExam = async()=>{
      setIsLoading(true);
      try{
        const response = await getExam(examId);
        setUpdatedExam(response);
        console.log(response);
        setTest(response.test);
        let convertedStudents = [];
        for(let i=0;i<response?.results?.length;i++){
          convertedStudents.push(response.results[i]?.student);
        }
        setStudentsOfExam(convertedStudents);
        setDbStudentsOfExam(convertedStudents);
      }catch(e){
        console.log(e);
        setIsLoading(false);
      }
    }
    retrieveExam();
  },[examId])

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllTests = async()=>{
      try{
        const response = await getTests(controller);
        const filteredTest = response.filter(test=>updatedExam.test.id!==test.id);
        isMounted && setTests(filteredTest);
      }catch(err){
        console.error(err);
        setIsLoading(false);
        localStorage.clear();
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllTests();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[updatedExam,location,navigate])

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllStudents = async()=>{
      try{
        const response = await getStudents(controller);
        isMounted && setStudents(response);
        setIsLoading(false);
      }catch(err){
        console.error(err);
        setIsLoading(false);
        localStorage.clear();
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllStudents();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[location,navigate])

  const saveUpdatedExam = async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    try{
      const filteredRemoveStudents = dbStudentsOfExam.filter(dbStudent=>!studentsOfExam.includes(dbStudent));
      if(filteredRemoveStudents.length!==0){
        await deleteExamsFromStudent(filteredRemoveStudents,examId);
      }
      
      updatedExam.test = test;
      updatedExam.results = setResultsOfExam();
      const response = await updateExam(updatedExam);
      console.log(response);
      setIsLoading(false);
      document.getElementById('textAlert').innerHTML = "Sistem je zapamtio polaganje";
      document.getElementById('alert').style.visibility = 'visible';
    }catch(err){
      console.log(err);
      setIsLoading(false);
      validation(err);
    }
  }

  function setResultsOfExam(){
    const results = [];
    for(let i=0;i<studentsOfExam.length;i++){
      const resultExam = {
        "resultExamPK":{
          "studentId":studentsOfExam[i].id,
          "examId":examId
        },
        "points":0,
        "grade":5
      }
      results.push(resultExam);
    }
    return results;
  }

  const removeStudents = async(e)=>{
    e.preventDefault();
    const filteredStudentsOfExam = studentsOfExam.filter(studentOfExam=>!selectedStudentsToRemove.includes(studentOfExam.id.toString()));
    setStudentsOfExam(filteredStudentsOfExam);
  }

  const addStudents = async(e)=>{
    e.preventDefault();
    const filteredStudents = students.filter(student=>selectedStudentsToAdd.includes(student.id.toString()));
    const mergedStudents = studentsOfExam.concat(filteredStudents);
    const uniqueStudents = Array.from(
      new Map(mergedStudents.map(obj => [obj.id, obj])).values()
    );
    setStudentsOfExam(uniqueStudents);
  }

  function handleInput(e){
    let newExam = updatedExam;
    newExam[e.target.name] = e.target.value;
    setUpdatedExam(newExam);
  }

  const handleSelectTest = (event)=>{
    setSelectedTest(event.target.value);
    const filteredTest = tests.filter(test=>test.id.toString()===event.target.value);
    if(filteredTest.length!==0){
      setTest(filteredTest[0]);
    }
  }

  const handleSelectStudentsForRemove = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedStudentsToRemove(selectedOptions);
  };

  const handleSelectStudentsForAdd = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedStudentsToAdd(selectedOptions);
  };

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Sistem je zapamtio polaganje"){
      clearCheckBoxes();
      navigate("/exams");
    }
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    clearCheckBoxes();
    navigate('/exams');
  }

  function cancel(e){
    e.preventDefault();
    clearCheckBoxes();
    navigate("/exams");
  }

  function clearCheckBoxes(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
  }

  function validation(error){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti polaganje";
    document.getElementById('alert').style.visibility = 'visible';

    validationExam(error,document.getElementById("nameErr"),
                      document.getElementById("amphitheaterErr"),document.getElementById("dateExamErr"),
                      document.getElementById("testErr"));
  }

  if(examId!==undefined && examId!==0){
    return (
      <div className='update'>
        <div className="update-div" id="update-div">
          <form className="create-form" onSubmit={saveUpdatedExam}>
            <label htmlFor="name">Naziv polaganja</label>
            <input type="text" name="name" placeholder='Unesite naziv polaganja' defaultValue={updatedExam.name} onInput={(e)=>handleInput(e)}/>
            <input type="text" name="nameErr" id="nameErr" readOnly/>
            <label htmlFor="amphitheater">Amfiteatar</label>
            <input type="text" name="amphitheater" placeholder='Unesite naziv amfiteatra' defaultValue={updatedExam.amphitheater} onInput={(e)=>handleInput(e)}/>
            <input type="text" name="amphitheaterErr" id="amphitheaterErr" readOnly/>
            <label htmlFor='date'>Datum polaganja</label>
            <input type='date' name="date" placeholder='Unesite datum polaganja' defaultValue={updatedExam.date} onInput={(e)=>handleInput(e)} />
            <input type="text" name="dateExamErr" id="dateExamErr" readOnly/>
            <label htmlFor='tests'>Testovi</label>
            <select name="tests" id="selectionOption" value={selectedTest} onChange={(e)=>handleSelectTest(e)}>
            <option value={updatedExam.test.id} style={{fontFamily:'cursive'}}>{updatedExam.test.content}</option>
            {tests?.length
            ? (
            <>
              {tests.map((test,i)=>
              <option key={i} value={test.id} style={{fontFamily:'cursive'}}>{test.content}</option>
              )}
            </>
            )
            :
            <option style={{color:'red'}}>Nije moguce ucitati listu testova</option>
            }
            </select>
            <input type="text" id="testErr" name="testErr" readOnly />
            <div className='listOfStudents'>
              <div className='div-list-students'>
                <label htmlFor="examStudents">Studenti polaganja: </label>
                <select name="examStudents" id="selectionOption" multiple value={selectedStudentsToRemove} onChange={(e)=>handleSelectStudentsForRemove(e)}>
                  {studentsOfExam?.length
                  ? (
                    <>
                      {studentsOfExam.map((studentOfExam,i)=>
                      <option key={i} value={studentOfExam?.id} style={{fontFamily:'cursive'}}>{studentOfExam?.name + " " + studentOfExam?.lastname}</option>
                      )}
                    </>
                  )
                  :
                  <option style={{color:'red'}}>Ne postoje prijavljeni studenti</option>
                  }
                </select>
              </div>
              <div className='div-list-students'>
                <button className='btn-add-student-exam' onClick={(e)=>addStudents(e)}><BsArrowLeft /></button>
                <button className='btn-remove-student-exam'onClick={(e)=>removeStudents(e)}><BsArrowRight /></button>
              </div>
              <div className='div-list-students'>
                <label htmlFor='students'>Dostupni studenti: </label>
                <select name="students" id="selectionOption" multiple value={selectedStudentsToAdd} onChange={(e)=>handleSelectStudentsForAdd(e)}>
                  {students?.length
                  ? (
                    <>
                      {students.map((student,i)=>
                      <option key={i} value={student?.id} style={{fontFamily:'cursive'}}>{student?.name + " " + student?.lastname}</option>
                      )}
                    </>
                  )
                  :
                  <option style={{color:'red'}}>Nije moguce ucitati listu studenata</option>
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
              <p id="textAlert">Sistem je zapamtio polaganje</p>
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
            <p id="textAlert">Sistem ne moze da ucita polaganje</p>
            <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
          </div>
        </div>
      </div>
    )
  }
}

export default UpdateExam
