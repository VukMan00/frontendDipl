import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAnswersFromQuestion } from '../services/AnswerService';

const GetAnswers = ({questionId,getCheckedId}) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const[dbAnswers,setDbAnswers]=useState([]);
  const[answers,setAnswers]=useState([]);

  const[checked,setChecked]=useState([]);
  
  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();
    const getAllAnswersFromQuestion = async()=>{
      try{
        console.log(questionId);
        const response = await getAnswersFromQuestion(questionId,controller);
        setDbAnswers(response);
        isMounted && setAnswers(response);
      }catch(err){
        console.error(err);
        setAnswers([]);
      }
    }
    getAllAnswersFromQuestion();
  
    return ()=>{
      isMounted = false;
      isMounted && controller.abort();
    }
  },[axiosPrivate,location,navigate,questionId])

  const handleCheck = (event)=>{
    var updatedList = [...checked];
    if(event.target.checked){
      updatedList=[...checked,event.target.value];
    }
    setChecked(updatedList);
    getCheckedId(updatedList);
    setChecked([]);
  }

  function filterAnswers(e){
    const filteredAnswers = answers.filter(answer => answer.content.toLowerCase().includes(e.target.value.toLowerCase()));
    if(e.key === "Enter"){
      e.preventDefault();
      if(filteredAnswers.length === 0){
        document.getElementById('textAlertGet').innerHTML = 'Sistem ne moze da pronadje odgovore po zadatoj vrednosti';
        document.getElementById("alertGet").style.visibility = 'visible';
      }
      else{
        document.getElementById('textAlertGet').innerHTML = 'Sistem je nasao odgovore po zadatoj vrednosti';
        document.getElementById("alertGet").style.visibility = 'visible';
        setAnswers(filteredAnswers);
      }
    }
    else{
      setAnswers(dbAnswers);
    }
  }

  function potvrdi(e){
    e.preventDefault();
    document.getElementById('alertGet').style.visibility = 'hidden';
  }  

  return (
    <div className='answers'>
        <form action="" className="searchCriteria">
          <label htmlFor="criteria">Unesite naziv:</label>
          <input type="text" name="criteria" className='criteria' placeholder='Unesite kriterijum pretrage' onKeyDown={(e)=>filterAnswers(e)}/>
        </form>
        <table style={{width:'100%'}}>
          <thead>
            <tr>
              <th></th>
              <th>Naziv odgovora</th>
              <th>Resenje</th>
            </tr>
          </thead>
          <tbody>
          {answers?.length
            ? (
            <>
              {answers.map((answer,i)=>
              <tr key={i}>
                <td><input type='checkbox' className="answerId" value={answer?.answerPK?.answerId} onChange={handleCheck}/></td>
                <td>{answer?.content}</td>
                <td>{answer?.solution===true ? "Tacno" : "Netacno"}</td>
              </tr>
              )}
            </>
          )
          :
          <>
          </>
          }
          </tbody>
        </table>
        <div id="alertGet">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlertGet">Sistem je nasao odgovore po zadatoj vrednosti</p>
                    <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GetAnswers
