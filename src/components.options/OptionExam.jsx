import React, { useState } from 'react'
import GetExams from '../components.exams/GetExams';
import { Link, Outlet, useLocation } from 'react-router-dom';

  const OptionExam = () => {
    const location = useLocation();
    const pathName = location?.pathname;

    const[examId,setExamId] = useState(0);

    function getCheckedId(checkedIds){
      setExamId(checkedIds[0]);
    }

  return (
    <div className='option'>
      {!pathName.includes("exams/getResults") ? (
      <>
      <div className="options-entity">
        <Link className="linkOption" to="createExam">Kreiraj polaganje</Link>
        <Link className='linkOption' to={"updateExam"} state={{examId:examId}}>Azuriraj polaganje</Link>
        <Link className='linkOption' to={"deleteExam"} state={{examId:examId}}>Obrisi polaganje</Link>
        <Link className='linkOption' to={"getResults"} state={{examId:examId}}>Unesi ocene i poene polaganja</Link> 
      </div>
      <div className="tableExams">
        <GetExams getCheckedId={getCheckedId}/>
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

export default OptionExam
