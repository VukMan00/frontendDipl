import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { deleteStudentFromExam, getExam, getResults, saveResults } from '../services/ExamService';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { getQuestionsFromTest } from '../services/TestService';
import moment from 'moment';
import { validationResultExam } from '../validation/ValidationHandler';

const GetAllResultExam = () => {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const navigate = useNavigate();
    const examId = location.state?.examId;

    const[exam,setExam]=useState({
        "id":0,
        "name":'',
        "amphitheater":'',
        "date":'',
        "test":'',
    });

    const[maxPoints,setMaxPoints]=useState(0);
    const[isReadOnly,setIsReadOnly] = useState(false);

    const[resultExams,setResultExams]=useState([]);
    const[dbResultExams,setDbResultExams]=useState([]);

    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        const getAllResultsOfExam = async()=>{
          try{
            const response = await getResults(examId,controller);
            setDbResultExams(response);
            isMounted && setResultExams(response);
          }catch(err){
            console.error(err);
            localStorage.clear();
            navigate('/login',{state:{from:location},replace:true});
          }
        }
        getAllResultsOfExam();
    
        return ()=>{
          isMounted = false;
          isMounted && controller.abort();
        }
    },[examId,axiosPrivate,location,navigate])

    useEffect(()=>{
        const retrieveExam = async()=>{
          try{
            const response = await getExam(examId);
            setExam(response);

            const currentDate = moment().format('YYYY-MM-DD');
            const isLater = moment(response?.date).isAfter(currentDate);
            setIsReadOnly(isLater);
          }catch(e){
            console.log(e);
          }
        }
        retrieveExam();
    },[examId,])

    useEffect(()=>{
        const retrieveQuestionsFromTest = async()=>{
          try{
            const testId = exam.test.id;
            const response = await getQuestionsFromTest(testId);
            let points = 0;
            for(let i=0;i<response.length;i++){
                points = points + response[i].points;
            }
            setMaxPoints(points);
          }catch(e){
            console.log(e);
          }
        }
        retrieveQuestionsFromTest();
    },[exam.test.id])

    const saveResultsExam = async(e)=>{
        e.preventDefault();
        try{
            console.log(resultExams);
            const response = await saveResults(resultExams);
            console.log(response);
        
            document.getElementById('textAlertGet').innerHTML = "Sistem je zapamtio rezultate polaganja";
            document.getElementById('alertGet').style.visibility = 'visible';
        }catch(err){
            console.log(err);
            validation(err);
        }
    }

    const removeStudent = async(e,i)=>{
      e.preventDefault();
      try{
        const response = await deleteStudentFromExam(resultExams[i]);
        console.log(response);
        const filteredResultExams = resultExams.filter(resultExam=>resultExam.resultExamPK!==resultExams[i].resultExamPK);
        setResultExams(filteredResultExams);
      }catch(err){
        console.log(err);
      }
    }

    function handleInput(e,i){
      if(e.target.name==='points'){
        if(e.target.value>=0 && e.target.value<=maxPoints){
          resultExams[i].points = e.target.value;
        }
        else{
          resultExams[i].points = -1;
        }
      }
      if(e.target.name==='grade'){
        if(e.target.value>=5 && e.target.value<=10){
          resultExams[i].grade = e.target.value;
        }
        else{
          resultExams[i].grade = -1;
        }
      }
    }

    function filterResultExams(e){
        if(e.key === "Enter"){
          e.preventDefault();
          const filteredResultExams = resultExams.filter(resultExam => resultExam.student.index.includes(e.target.value));
          if(filteredResultExams.length === 0){
            document.getElementById('textAlertGet').innerHTML = 'Sistem ne moze da pronadje studente po zadatoj vrednosti';
            document.getElementById("alertGet").style.visibility = 'visible';
          }
          else{
            document.getElementById('textAlertGet').innerHTML = 'Sistem je nasao studente po zadatoj vrednosti';
            document.getElementById("alertGet").style.visibility = 'visible';
            setResultExams(filteredResultExams);
          }
        }
        else{
          setResultExams(dbResultExams);
        }
    }

    function potvrdiNotFound(e){
        e.preventDefault();
        document.getElementById('alertWrong').style.visibility = 'hidden';
        navigate('/exams');
    }

    function potvrdiGet(e){
        e.preventDefault();
        document.getElementById('alertGet').style.visibility = 'hidden';
        if(document.getElementById('textAlertGet').innerHTML === "Sistem je zapamtio rezultate polaganja"){
          navigate("/exams");
        }
    }


    function validation(error){
        document.getElementById('textAlertGet').innerHTML = "Sistem ne moze da zapamti rezultate polaganja";
        document.getElementById('alertGet').style.visibility = 'visible';

        validationResultExam(error,document.getElementById("pointsErr"),document.getElementById("gradeErr"))
    }

  if(examId!==undefined && examId!==0){
    return (
        <div style={{display:'flex', flexDirection:'column',justifyContent:'space-evenly'}}>
            <h1 style={{color:'white',textAlign:'start',marginTop:'5px',fontWeight:'bolder',fontStyle:'italic'}}>Polaganje: {exam?.name}</h1>
            <h1 style={{color:'white',textAlign:'start',marginTop:'15px',fontWeight:'bolder',fontStyle:'italic'}}>Test: {exam?.test?.content}</h1>
            <h1 style={{color:'white',textAlign:'start',marginTop:'30px',fontWeight:'bolder',fontStyle:'italic'}}>Datum polaganja: {exam?.date}</h1>
            <div className='tableResults'>
                <form className="searchCriteria" onSubmit={saveResultsExam}>
                <label htmlFor="criteria">Unesite broj indeksa:</label>
                <input type="text" name="criteria" className='criteria' placeholder='Unesite kriterijum pretrage' onKeyDown={(e)=>filterResultExams(e)}/>
                    <table>
                        <thead>
                            <tr>
                                <th>Ime</th>
                                <th>Prezime</th>
                                <th>Broj indeksa</th>
                                <th>Broj poena</th>
                                <th>Ocena</th>
                                <th>Maksimalan broj poena</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultExams?.length
                            ? (
                            <>
                            {resultExams.map((resultExam,i)=>
                            <tr key={i}>
                                <td>{resultExam.student.name}</td>
                                <td>{resultExam.student.lastname}</td>
                                <td>{resultExam.student.index}</td>
                                <td><input className='points' name="points" type="text" placeholder='Unesite broj poena' defaultValue={resultExam.points} readOnly={isReadOnly} onInput={(e)=>handleInput(e,i)}/></td>
                                <td><input className='grades' name="grade" type="text" placeholder='Unesite ocenu' defaultValue={resultExam.grade} readOnly={isReadOnly} onInput={(e)=>handleInput(e,i)}/></td>
                                <td>{maxPoints}</td>
                                <td><button className='btn-remove-student-exam' onClick={(e)=>removeStudent(e,i)}>Izbaci studenta iz polaganja</button></td>
                            </tr>
                            )}
                            </>
                            )
                            :
                            <></>
                            }
                        </tbody>
                    </table>
                  <div className='button' style={{display:'flex',flexDirection:'column',justifyContent:'space-evenly'}}>
                    <input style={{border:'2px solid black',width:'50%',backgroundColor:'white'}} type="text" name="pointsErr" id="pointsErr" readOnly/>
                    <input style={{border:'2px solid black',width:'50%',backgroundColor:'white'}} type="text" name="gradeErr" id="gradeErr" readOnly/>
                  </div>
                  <input style={{ width:'10%'}} type="submit" name="saveResultExam" id="btn-save" value="Sacuvaj"/>
                  <Link className='btn-add-student-exam' to={"addStudent"} state={{examId:examId}}>Ubaci studente</Link>  
                </form>
            </div>
            <div id="alertGet">
                <div id="box">
                    <div className="obavestenje">
                        Obaveštenje!
                    </div>
                    <div className="sadrzaj">
                        <p id="textAlertGet">Sistem je nasao polaganja po zadatoj vrednosti</p>
                        <button id="confirm" onClick={(e)=>potvrdiGet(e)}>OK</button>
                    </div>
                </div>
            </div>

            <Outlet />
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
                  <p id="textAlert">Sistem ne moze da ucita rezultate polaganja.</p>
                  <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
                </div>
              </div>
              <Outlet />
          </div>
        )
    }
}

export default GetAllResultExam
