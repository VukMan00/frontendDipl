import React, { useState } from 'react'
import { Link, Outlet} from 'react-router-dom'
import GetStudents from '../components.students/GetStudents'

const OptionStudent = () => {
  const[studentId,setStudentId] = useState(0);

  function getCheckedId(checkedIds){
    setStudentId(checkedIds[0]);
  }

  return (
    <div className='option'>
      <div className="options-entity">
        <Link className="linkOption" to={"createStudent"}>Kreiraj studenta</Link>
        <Link className='linkOption' to={"updateStudent"} state={{studentId:studentId}}>Azuriraj studenta</Link>
        <Link className='linkOption' to={"deleteStudent"} state={{studentId:studentId}}>Obrisi studenta</Link>
      </div>
      <div className="tableStudents">
        <GetStudents getCheckedId={getCheckedId}/>
      </div>

      <Outlet />
    </div>
  )
}

export default OptionStudent
