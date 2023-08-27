import React, { useEffect, useState } from 'react'
import { deleteStudentFromExam, getResults } from '../services/StudentService';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

const GetExamsOfStudent = () => {
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();
  const studentId = localStorage.getItem('id');
  
  const[resultExamsFuture,setResultExamsFuture]=useState([]);
  const[resultExamsPast,setResultExamsPast]=useState([]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllResultsOfExam = async()=>{
      try{
        const response = await getResults(studentId,controller);
        const arrayFuture = [];
        const arrayPast = [];
        for(let i=0;i<response.length;i++){
          const currentDate = moment().format('YYYY-MM-DD');
          const isLater = moment(response[i]?.exam?.date).isAfter(currentDate);
          if(isLater){
            arrayFuture[arrayFuture.length++] = response[i]; 
          }
          else{
            arrayPast[arrayPast.length++] = response[i];
          }
        }
        setResultExamsFuture(arrayFuture);
        isMounted && setResultExamsPast(arrayPast);
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
  },[studentId,axiosPrivate,location,navigate])

  const removeStudent = async(e,i)=>{
    e.preventDefault();
    try{
      const response = await deleteStudentFromExam(resultExamsFuture[i]?.resultExamPK?.examId,resultExamsFuture[i]?.resultExamPK?.studentId);
      console.log(response);
      const filteredResultExams = resultExamsFuture.filter(resultExamFuture=>resultExamFuture.resultExamPK!==resultExamsFuture[i].resultExamPK);
      setResultExamsFuture(filteredResultExams);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className='examsOfStudent'>
      <h1 style={{fontStyle:'italic',color:'white'}}>Predstojeca polaganja</h1>
      <div className='tableFutureExams'>
        <table>
          <thead>
            <tr>
              <th>Naziv polaganja</th>
              <th>Datum polaganja</th>
              <th>Amfiteatar</th>
              <th>Test</th>
              <th>Broj poena</th>
              <th>Ocena</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resultExamsFuture?.length
              ? (
                <>
                {resultExamsFuture.map((resultExamFuture,i)=>
                <tr key={i}>
                  <td>{resultExamFuture?.exam?.name}</td>
                  <td>{resultExamFuture?.exam?.date}</td>
                  <td>{resultExamFuture?.exam?.amphitheater}</td>
                  <td>{resultExamFuture?.exam?.test?.content}</td>
                  <td>{resultExamFuture?.points}</td>
                  <td>{resultExamFuture?.grade}</td>
                  <td><button className='btn-remove-student-exam' onClick={(e)=>removeStudent(e,i)}>Odjava sa polaganja</button></td>
                </tr>
                )}
                </>
                )
                :
                <></>
            }
          </tbody>
        </table>
      </div>
      <h1 style={{fontStyle:'italic',color:'white'}}>Prosla polaganja</h1>
      <div className='tablePastExams'>
        <table>
          <thead>
            <tr>
              <th>Naziv polaganja</th>
              <th>Datum polaganja</th>
              <th>Amfiteatar</th>
              <th>Test</th>
              <th>Broj poena</th>
              <th>Ocena</th>
            </tr>
          </thead>
          <tbody>
            {resultExamsPast?.length
              ? (
                <>
                {resultExamsPast.map((resultExamPast,i)=>
                <tr key={i}>
                  <td>{resultExamPast?.exam?.name}</td>
                  <td>{resultExamPast?.exam?.date}</td>
                  <td>{resultExamPast?.exam?.amphitheater}</td>
                  <td>{resultExamPast?.exam?.test?.content}</td>
                  <td>{resultExamPast?.points}</td>
                  <td>{resultExamPast?.grade}</td>
                </tr>
                )}
                </>
                )
                :
                <></>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GetExamsOfStudent
