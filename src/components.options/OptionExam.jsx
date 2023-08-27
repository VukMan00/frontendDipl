import React, { useState } from 'react'
import GetExams from '../components.exams/GetExams';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { saveResultExam } from '../services/StudentService';

  const OptionExam = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = location?.pathname;

    const[examId,setExamId] = useState(0);
    const[examIds,setExamIds]=useState([]);

    function getCheckedId(checkedIds){
      setExamIds(checkedIds);
      setExamId(checkedIds[0]);
    }

    const insertStudentToExams = async(e)=>{
      e.preventDefault();
      try{
        if(examIds.length!==0){
          await saveResultExam(examIds,localStorage.getItem('id'));
          clearCheckBoxes();
          navigate("/exams");
        }
      }catch(err){
        console.log(err);
      }
    }

    function clearCheckBoxes(){
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(function(checkbox) {
          checkbox.checked = false;
      });
    }

  return (
    <div className='option'>
      {!pathName.includes("exams/getResults") && !pathName.includes("exams/viewExams") ? (
      <>
      {localStorage.getItem("role")==="ROLE_ADMIN" ? (
      <div className="options-entity">
        <Link className="linkOption" to={"createExam"}>Kreiraj polaganje</Link>
        <Link className='linkOption' to={"updateExam"} state={{examId:examId}}>Azuriraj polaganje</Link>
        <Link className='linkOption' to={"deleteExam"} state={{examId:examId}}>Obrisi polaganje</Link>
        <Link className='linkOption' to={"getResults"} state={{examId:examId}}>Unesi ocene i poene polaganja</Link> 
      </div>
      ):(
      <div className="options-entity">
        <Link className='linkOption' onClick={insertStudentToExams}>Prijavljivanje na polaganja</Link>
        <Link className='linkOption' to={"viewExams"}>Pregled Vasih polaganja</Link>
      </div>
      )}
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
