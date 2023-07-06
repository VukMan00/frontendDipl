import React from 'react'
import {useState,useEffect} from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';


const GetStudents = ({getCheckedId}) => {

  const[students,setStudents] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const[checked,setChecked] = useState([]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllStudents = async()=>{
      try{
        const response = await axiosPrivate.get('/students',{
          signal : controller.signal
        });
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

  function filterStudents(e){
    if(e.key === "Enter"){
      e.preventDefault();
      const filteredStudents = students.filter(student => student.index.includes(e.target.value));
      if(filteredStudents.length === 0){
        document.getElementById('textAlertGet').innerHTML = 'Sistem ne moze da pronadje studente po zadatoj vrednosti';
        document.getElementById("alertGet").style.visibility = 'visible';
      }
      else{
        document.getElementById('textAlertGet').innerHTML = 'Sistem je nasao studente po zadatoj vrednosti';
        document.getElementById("alertGet").style.visibility = 'visible';
        setStudents(filteredStudents);
      }
    }
    else{
      navigate("/students");
    }
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alertGet').style.visibility = 'hidden';
  }

  return (
      <div className='students'>
        <form action="" className="searchCriteria">
          <label htmlFor="criteria">Unesite broj indeksa:</label>
          <input type="text" name="criteria" className='criteria' placeholder='Unesite kriterijum pretrage' onKeyDown={(e)=>filterStudents(e)}/>
        </form>
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
                <td><input type='checkbox' className="studentId" value={student?.id} onChange={handleCheck}/></td>
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

export default GetStudents
