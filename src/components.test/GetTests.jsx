import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTests } from '../services/TestService';

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

  function filterTests(e){
    if(e.key === "Enter"){
      e.preventDefault();
      const filteredTests = tests.filter(test => test.content.toLowerCase().includes(e.target.value.toLowerCase()));
      if(filteredTests.length === 0){
        document.getElementById('textAlertGet').innerHTML = 'Sistem ne moze da pronadje testove po zadatoj vrednosti';
        document.getElementById("alertGet").style.visibility = 'visible';
      }
      else{
        document.getElementById('textAlertGet').innerHTML = 'Sistem je nasao testove po zadatoj vrednosti';
        document.getElementById("alertGet").style.visibility = 'visible';
        setTests(filteredTests);
      }
    }
    else{
      navigate("/tests");
    }
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alertGet').style.visibility = 'hidden';
  }

  return (
    <div className='tests'>
      <form action="" className="searchCriteria">
          <label htmlFor="criteria">Unesite naziv</label>
          <input type="text" name="criteria" className='criteria' placeholder='Unesite kriterijum pretrage' onKeyDown={(e)=>filterTests(e)}/>
        </form>
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
      <div id="alertGet">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlertGet">Sistem je nasao studente po zadatoj vrednosti</p>
                    <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GetTests
