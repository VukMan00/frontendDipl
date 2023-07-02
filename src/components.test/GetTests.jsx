import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

const GetTests = ({getCheckedId}) => {

  const[tests,setTests] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const[checked,setChecked] = useState([]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllTests = async()=>{
      try{
        const response = await axiosPrivate.get('/tests',{
          signal : controller.signal
        });
        isMounted && setTests(response.data);
      }catch(err){
        console.error(err);
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllTests();

    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[axiosPrivate,location,navigate]) 

  const handleCheck = (event)=>{
    var updatedList = [...checked];
    if(event.target.checked){
      updatedList=[...checked,event.target.value];
    }
    setChecked(updatedList);
    getCheckedId(updatedList);
    setChecked([]);
  }

  return (
    <div className='tests'>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Naziv testa</th>
            <th>Ime autora</th>
            <th>Prezime autora</th>
            <th>Email autora</th>
          </tr>
        </thead>
        <tbody>
      {tests?.length
        ? (
          <>
            {tests.map((test,i)=>
            <tr key={i}>
              <td><input type='checkbox' className="testId" value={test?.id} onChange={handleCheck}/></td>
              <td>{test?.content}</td>
              <td>{test?.author?.name}</td>
              <td>{test?.author?.lastname}</td>
              <td>{test?.author?.email}</td>
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
  )
}

export default GetTests
