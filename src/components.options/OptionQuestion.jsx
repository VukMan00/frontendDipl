import React, {useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import GetQuestions from '../components.questions/GetQuestions'

const OptionQuestion = ({refresh}) => {
  const location = useLocation();
  const pathName = location?.pathname;

  const[questionId,setQuestionId] = useState(0);

  function getCheckedId(checkedIds){
    setQuestionId(checkedIds[0]);
  }

  
  return (
    <div className='option'>
      {!pathName.includes("questions/answers") ? (
      <>
      <div className="options-entity">
        <Link className="linkOption" to={"createQuestion"} onClick={refresh}>Kreiraj pitanje</Link>
        <Link className='linkOption' to={"updateQuestion"} state={{questionId:questionId}} onClick={refresh}>Azuriraj pitanje</Link>
        <Link className='linkOption' to={"deleteQuestion"} state={{questionId:questionId}}>Obrisi pitanje</Link>
        <Link className='linkOption' to={"answers"} state={{questionId:questionId}}>Pregled odgovora</Link>
      </div>
      <div className="tableQuestions">
        <GetQuestions getCheckedId={getCheckedId} />
      </div>
      </>
      ):(
      <>
      </>
      )}
      <Outlet />
    </div>
  )
}

export default OptionQuestion
