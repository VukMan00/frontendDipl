import React from 'react'
import {useState,useEffect} from "react";
import axios from '../api/axios';

const Members = () => {

  const[members,setMembers] = useState();

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();

    const getMembers = async()=>{
      try{
        const response = await axios.get('/users',{
          signal : controller.signal
        });
        console.log(response.data);
        isMounted && setMembers(response.data);
      }catch(err){
        console.error(err);
      }
    }

    getMembers();

    return ()=>{
      isMounted = false;
      controller.abort();
    }
  },[])
    
  return (
    <article>
      <h2>Members list</h2>
      {members?.length
        ? (
          <ul>
            {members.map((member,i)=><li key={i}>{member?.username}</li>)}
          </ul>
        )
        :
        <p>Trenutno nema korisnika</p>
      }
    </article>
  )
}

export default Members
