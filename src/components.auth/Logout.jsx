import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useLocation, useNavigate } from 'react-router-dom';
import {useState,useEffect} from "react";

const Logout = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
    
        const logOut = async()=>{
          try{
            const response = await axiosPrivate.post('/auth/logout',{
              signal : controller.signal
            });
            console.log(response.data);
            navigate('/login');
          }catch(err){
            console.error(err);
          }
        }
    
        logOut();
    
        return ()=>{
          isMounted = false;
          isMounted && controller.abort();
        }
      },[])
  return (
    <div>
      
    </div>
  )
}

export default Logout
