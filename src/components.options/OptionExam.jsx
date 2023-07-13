import React, { useState } from 'react'
import GetExams from '../components.exams/GetExams';
import { Link, Outlet } from 'react-router-dom';

  const OptionExam = () => {

    const[examId,setExamId] = useState(0);

    function getCheckedId(checkedIds){
      setExamId(checkedIds[0]);
    }

  return (
    <div className='option'>
      <div className="options-entity">
        <Link className="linkOption" to="createExam">Kreiraj polaganje</Link>
        <Link className='linkOption' to={"updateExam"} state={{examId:examId}}>Azuriraj polaganje</Link>
        <Link className='linkOption' to={"deleteExam"} state={{examId:examId}}>Obrisi polaganje</Link>
      </div>
      <div className="tableExams">
        <GetExams getCheckedId={getCheckedId}/>
      </div>

      <Outlet />
    </div>
  )
}

export default OptionExam
