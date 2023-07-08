import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

const GetExams = (getCheckedId) => {

  const[exams,setExams] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const[checked,setChecked] = useState([]);

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllExams = async()=>{
      try{
        const response = await axiosPrivate.get('/exams',{
          signal : controller.signal
        });
        isMounted && setExams(response.data);

      }catch(err){
        console.error(err);
        navigate('/login',{state:{from:location},replace:true});
      }
    }
    getAllExams();

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
