import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuestions } from '../services/QuestionService';

const GetQuestions = ({getCheckedId}) => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const[questions,setQuestions]=useState([]);

    const[checked,setChecked]=useState([]);

    useEffect(()=>{
      let isMounted = true;
      const controller = new AbortController();
      const getAllQuestions = async()=>{
        try{
          const response = await getQuestions(controller);
          isMounted && setQuestions(response);
        }catch(err){
          localStorage.clear();
          console.error(err);
          navigate('/login',{state:{from:location},replace:true});
        }
      }
      getAllQuestions();
    
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

    function filterQuestions(e){
        if(e.key === "Enter"){
          e.preventDefault();
          const filteredQuestions = questions.filter(question => question.content.toLowerCase().includes(e.target.value.toLowerCase()));
          if(filteredQuestions.length === 0){
            document.getElementById('textAlertGet').innerHTML = 'Sistem ne moze da pronadje pitanja po zadatoj vrednosti';
            document.getElementById("alertGet").style.visibility = 'visible';
          }
          else{
            document.getElementById('textAlertGet').innerHTML = 'Sistem je nasao pitanja po zadatoj vrednosti';
            document.getElementById("alertGet").style.visibility = 'visible';
            setQuestions(filteredQuestions);
          }
        }
        else{
          navigate("/questions");
        }
    }

    function potvrdi(e){
        e.preventDefault();
        document.getElementById('alertGet').style.visibility = 'hidden';
    }

  return (
    <div className='questions'>
        <form action="" className="searchCriteria">
          <label htmlFor="criteria">Unesite naziv:</label>
          <input type="text" name="criteria" className='criteria' placeholder='Unesite kriterijum pretrage' onKeyDown={(e)=>filterQuestions(e)}/>
        </form>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Naziv</th>
            </tr>
          </thead>
          <tbody>
          {questions?.length
            ? (
            <>
              {questions.map((question,i)=>
              <tr key={i}>
                <td><input type='checkbox' className="questionId" value={question?.id} onChange={handleCheck}/></td>
                <td>{question?.content}</td>
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
                    <p id="textAlertGet">Sistem je nasao pitanja po zadatoj vrednosti</p>
                    <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GetQuestions
