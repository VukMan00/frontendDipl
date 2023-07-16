import React, {useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import GetQuestions from '../components.questions/GetQuestions'

const OptionQuestion = ({refresh}) => {

  const[questionId,setQuestionId] = useState(0);

  function getCheckedId(checkedIds){
    setQuestionId(checkedIds[0]);
  }

  return (
    <div className='option'>
      <div className="options-entity">
        <Link className="linkOption" to={"createQuestion"} onClick={refresh}>Kreiraj pitanje</Link>
        <Link className='linkOption' to={"updateQuestion"} state={{questionId:questionId}} onClick={refresh}>Azuriraj pitanje</Link>
        <Link className='linkOption' to={"deleteQuestion"} state={{questionId:questionId}}>Obrisi pitanje</Link>
      </div>
      <div className="tableQuestions">
        <GetQuestions getCheckedId={getCheckedId} />
      </div>

      <Outlet />
    </div>
  )
}

export default OptionQuestion
