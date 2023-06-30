import React from 'react'
import {useState,useEffect} from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';


const GetStudents = () => {

  const[students,setStudents] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();

    const getAllStudents = async()=>{
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

    getAllStudents();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[])
    
  return (
    <div className='students'>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Broj indeksa</th>
            <th>Email</th>
            <th>Datum rodjenja</th>
          </tr>
        </thead>
        <tbody>
      {students?.length
        ? (
          <>
            {students.map((student,i)=>
            <tr key={i}>
              <td><input key={student?.id} type='checkbox' id="student"/></td>
              <td>{student?.name}</td>
              <td>{student?.lastname}</td>
              <td>{student?.index}</td>
              <td>{student?.email}</td>
              <td>{student?.birth}</td>
            </tr>
            )}
          </>
        )
        :
        <>Trenutno nema studenata</>
      }
        </tbody>
      </table>
    </div>
  )
}

export default GetStudents
