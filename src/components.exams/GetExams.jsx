import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getExams } from '../services/ExamService';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { deleteStudentFromExam, getExamsOfStudent } from '../services/StudentService';

const GetExams = ({getCheckedId}) => {

  const axiosPrivate = useAxiosPrivate();
  const[exams,setExams] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const[checked,setChecked] = useState([]);
  const[idExamsOfStudent,setIdExamsOfStudent]=useState([]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllExams = async()=>{
      try{
        const response = await getExams(controller);
        isMounted && setExams(response);
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
  },[axiosPrivate,location,navigate])

  useEffect(()=>{
    if(localStorage.getItem("role")==="ROLE_USER"){
      const retrieveExamsOfStudent = async()=>{
        try{
          const response = await getExamsOfStudent(localStorage.getItem('id'));
          for(let i=0;i<response.length;i++){
            idExamsOfStudent[idExamsOfStudent.length+1] = response[i].id; 
          }
          setIdExamsOfStudent(idExamsOfStudent);
        }catch(err){
          console.log(err);
        }
      }
      retrieveExamsOfStudent();
    }
  })

  const removeStudentFromExam = async(e,examId)=>{
    e.preventDefault();
    try{
      await deleteStudentFromExam(examId,localStorage.getItem('id'));
      const filteredIdsExamsOfStudent = idExamsOfStudent.filter(id=>id!==examId);
      setIdExamsOfStudent(filteredIdsExamsOfStudent);
    }catch(err){
      console.log(err);
    }
  }

  const handleCheck = (event)=>{
    var updatedList = [...checked];
    if(event.target.checked){
      if(!updatedList.includes(event.target.value)){
        updatedList=[...checked,event.target.value];
      }
    }
    setChecked(updatedList);
    getCheckedId(updatedList);
    if(localStorage.getItem('role')==="ROLE_ADMIN"){
      setChecked([]);
    }
  }

  function filterExams(e){
    if(e.key === "Enter"){
      e.preventDefault();
      const filteredExams = exams.filter(exam => exam.amphitheater.toLowerCase().includes(e.target.value.toLowerCase()));
      if(filteredExams.length === 0){
        document.getElementById('textAlertGet').innerHTML = 'Sistem ne moze da pronadje polaganja po zadatoj vrednosti';
        document.getElementById("alertGet").style.visibility = 'visible';
      }
      else{
        document.getElementById('textAlertGet').innerHTML = 'Sistem je nasao polaganja po zadatoj vrednosti';
        document.getElementById("alertGet").style.visibility = 'visible';
        setExams(filteredExams);
      }
    }
    else{
      navigate("/exams");
    }
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alertGet').style.visibility = 'hidden';
  }

  return (
    <div className='exams'>
        <form action="" className="searchCriteria">
          <label htmlFor="criteria">Unesite naziv sale:</label>
          <input type="text" name="criteria" className='criteria' placeholder='Unesite kriterijum pretrage' onKeyDown={(e)=>filterExams(e)}/>
        </form>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Naziv</th>
              <th>Datum polaganja</th>
              <th>Amfiteatar</th>
              {
                localStorage.getItem("role")==="ROLE_USER" ?
                (
                  <th></th>
                )
                :
                (
                  <></>
                )
              }
              {
                localStorage.getItem("role")==="ROLE_USER" ?
                (
                  <th></th>
                )
                :
                (
                  <></>
                )
              }
            </tr>
          </thead>
          <tbody>
          {exams?.length
            ? (
            <>
              {exams.map((exam,i)=>
              <tr key={i}>
                <td><input type='checkbox' className="examId" value={exam?.id} onChange={handleCheck}/></td>
                <td>{exam?.name}</td>
                <td>{exam?.date}</td>
                <td>{exam?.amphitheater}</td>
                {localStorage.getItem("role")==="ROLE_USER" ?
                (
                  <td>{idExamsOfStudent.includes(exam?.id) ? "Prijavljeni ste" : "Niste prijavljeni"}</td>
                ):
                (
                  <></>
                )}
                {localStorage.getItem("role")==="ROLE_USER" ?
                (
                  <td>{idExamsOfStudent.includes(exam?.id) ? <button className='btn-remove-student-exam' onClick={(e)=>removeStudentFromExam(e,exam.id)}>Odjavite se</button> : <></>}</td>
                ):
                (
                  <></>
                )}
              </tr>
              )}
            </>
          )
          :
          <></>
          }
          </tbody>
        </table>
        <div id="alertGet">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlertGet">Sistem je nasao polaganja po zadatoj vrednosti</p>
                    <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
        </div>
      </div>
  )
}

export default GetExams
