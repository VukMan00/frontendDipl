import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import GetAnswers from '../components.answers/GetAnswers'
import { getQuestion } from '../services/QuestionService';

const OptionAnswer = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const questionId = location.state?.questionId;

  const[answerId,setAnswerId] = useState(0);

  const[question,setQuestion]=useState({
    'id':0,
    'content':''
  })

  useEffect(()=>{
    const retrieveQuestion = async()=>{
      try{
        const response = await getQuestion(questionId);
        setQuestion(response);
      }catch(e){
        console.log(e);
      }
    }
    retrieveQuestion();
  },[questionId])

  function getCheckedId(checkedIds){
    setAnswerId(checkedIds[0]);
  }

  function potvrdiNotFound(e){
    e.preventDefault();
    document.getElementById('alertWrong').style.visibility = 'hidden';
    navigate('/questions');
  }

  if(questionId!==undefined && questionId!==0){
    return (
        <div className='option'>
            <div className="options-entity">
                <Link className="linkOption" to={"createAnswer"}>Kreiraj odgovor</Link>
                <Link className='linkOption' to={"updateAnswer"} state={{answerId:answerId}}>Azuriraj odgovor</Link>
                <Link className='linkOption' to={"deleteAnswer"} state={{answerId:answerId}}>Obrisi odgovor</Link>
            </div>
            <div className="tableAnswers">
                <h3>Pitanje: {question.content}</h3>
                <GetAnswers questionId={questionId} getCheckedId={getCheckedId}/>
            </div>
            <Outlet />
        </div>
    )
  }
  else{
    return(
        <div id="alertWrong">
          <div id="box">
            <div className="obavestenje">
                Obaveštenje!
            </div>
            <div className="sadrzaj">
              <p id="textAlert">Sistem ne moze da ucita odgovore.</p>
              <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
            </div>
          </div>
      </div>
    )
  }
}

export default OptionAnswer
