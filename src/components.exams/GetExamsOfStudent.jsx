import React, { useEffect, useState } from 'react'
import { getResults } from '../services/StudentService';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

const GetExamsOfStudent = () => {
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();
  const studentId = localStorage.getItem('id');
  
  const[resultExams,setResultExams]=useState([]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllResultsOfExam = async()=>{
      try{
        const response = await getResults(studentId,controller);
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
  },[studentId,axiosPrivate,location,navigate])

  return (
    <div className='examsOfStudent'>
      <div className='futureExams'>
        OVDE SU BUDUCA POLAGANJA
      </div>
      <div className='pastExams'>
        OVDE SU PROSLA POLAGANJA
      </div>
    </div>
  )
}

export default GetExamsOfStudent
