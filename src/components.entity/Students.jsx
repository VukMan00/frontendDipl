import React from 'react'
import {useState,useEffect} from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';


const Students = () => {

  const[students,setStudents] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();

    const getStudents = async()=>{
      try{
        const response = await axiosPrivate.get('/students',{
          signal : controller.signal
        });
        console.log(response.data);
        isMounted && setStudents(response.data);
      }catch(err){
        console.error(err);
        navigate('/login',{state:{from:location},replace:true});
      }
    }

    getStudents();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[])
    
  return (
    <article>
      <h2>Students list</h2>
      {students?.length
        ? (
          <ul>
            {students.map((student,i)=><li key={i}>{student?.name + " " + student?.lastname}</li>)}
          </ul>
        )
        :
        <p>Trenutno nema korisnika</p>
      }
    </article>
  )
}

export default Students
