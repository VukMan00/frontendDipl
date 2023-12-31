import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getTests } from '../services/TestService';
import { getStudents } from '../services/StudentService';
import { createExam, saveResultExam } from '../services/ExamService';
import { validationExam } from '../validation/ValidationHandler';

const CreateExam = () => {

  const[exam,setExam]=useState({
    "id":0,
    "name":'',
    "amphitheater":'',
    "date":'',
    "test":'',
    'results':''
  });

  const[test,setTest]=useState({
    "id":0,
    "content":'',
    "author":''
  })

  const[tests,setTests]=useState([]);
  const[students,setStudents]=useState([]);
  const[selectedTest,setSelectedTest]=useState();
  const[selectedStudents,setSelectedStudents]=useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    setIsLoading(true);
    const getAllTests = async()=>{
      try{
        const response = await getTests(controller);
        isMounted && setTests(response);
      }catch(err){
        console.error(err);
        localStorage.clear();
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllTests();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[location,navigate])

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllStudents = async()=>{
      try{
        const response = await getStudents(controller);
        isMounted && setStudents(response);
      }catch(err){
        localStorage.clear();
        console.error(err);
        navigate('/login',{state:{from:location},replace:true});
      }finally{
        setIsLoading(false);
      }
    }
    getAllStudents();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[location,navigate])
  

  const handleSelectTest = (event)=>{
    setSelectedTest(event.target.value);
    const filteredTest = tests.filter(test=>test.id.toString()===event.target.value);
    if(filteredTest.length!==0){
      setTest(filteredTest[0]);
    }
  }

  const handleSelectStudents = (event)=>{
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedStudents(selectedOptions);
  }

  function unSelectAll(e){
    e.preventDefault();
    setSelectedStudents([]);
  }

  function handleInput(e){
    let newExam = exam;
    newExam[e.target.name] = e.target.value;
    setExam(newExam);
  }

  const saveExam = async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    try{
      if(test.id===0){
        exam.test = null;
      }
      else{
        exam.test = test;
      }
      exam.results = setResultsOfExam();
      const response = await createExam(exam);
      console.log(response);
      document.getElementById('textAlert').innerHTML = "Sistem je zapamtio polaganje";
    }catch(error){
      console.log(error);
      validation(error);
    }
    finally{
      setIsLoading(false);
      document.getElementById('alert').style.visibility = 'visible';
    }
  }

  function setResultsOfExam(){
    const results = [];
    for(let i=0;i<selectedStudents.length;i++){
      const resultExam = {
        "resultExamPK":{
          "studentId":selectedStudents[i],
          "examId":''
        },
        "points":0,
        "grade":5
      }
      results.push(resultExam);
    }
    return results;
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alert').style.visibility = 'hidden';
    if(document.getElementById('textAlert').innerHTML === "Sistem je zapamtio polaganje"){
      navigate("/exams");
    }
  }

  function cancel(e){
    e.preventDefault();
    navigate("/exams");
  }

  function validation(error){
    document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti polaganje";

    validationExam(error,document.getElementById("nameErr"),
                      document.getElementById("amphitheaterErr"),document.getElementById("dateExamErr"),
                      document.getElementById("testErr"));
  }

  return (
    <div className='create'>
      <div className="create-div">
        <form className="create-form" onSubmit={saveExam}>
          <label htmlFor="name">Naziv polaganja</label>
          <input type="text" name="name" placeholder='Unesite naziv polaganja' onInput={(e)=>handleInput(e)}/>
          <input type="text" name="nameErr" id="nameErr" readOnly/>
          <label htmlFor="amphitheater">Amfiteatar</label>
          <input type="text" name="amphitheater" placeholder='Unesite naziv amfiteatra' onInput={(e)=>handleInput(e)}/>
          <input type="text" name="amphitheaterErr" id="amphitheaterErr" readOnly/>
          <label htmlFor='date'>Datum polaganja</label>
          <input type='date' name="date" placeholder='Unesite datum polaganja' onInput={(e)=>handleInput(e)} />
          <input type="text" name="dateExamErr" id="dateExamErr" readOnly/>
          <label htmlFor='tests'>Dostupni testovi</label>
          <select name="tests" id="selectionOption" value={selectedTest} onChange={(e)=>handleSelectTest(e)}>
          <option value={-1} style={{fontFamily:'cursive'}}>Izaberite test</option>
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
          <label htmlFor="students">Dostupni studenti</label>
          <select name="students" id="selectionOption" multiple value={selectedStudents} onChange={(e)=>handleSelectStudents(e)}>
          {students?.length
          ? (
            <>
              {students.map((student,i)=>
              <option key={i} value={student.id} style={{fontFamily:'cursive'}}>{student.name + " " + student.lastname + " " + student.index}</option>
              )}
            </>
          )
          :
          <option style={{color:'red'}}>Nije moguce ucitati listu studenata</option>
        }
        </select>
        <button id="btn-unselectAll" onClick={(e) => unSelectAll(e)}>Ponisti izbor studenata</button>
          <input type="text" name="testErr" id="testErr" readOnly /> 
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

export default CreateExam
