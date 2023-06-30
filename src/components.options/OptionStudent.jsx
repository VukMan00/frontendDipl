import React from 'react'
import { Link } from 'react-router-dom'
import Students from '../components.students/GetStudents'
import GetStudents from '../components.students/GetStudents'

const OptionStudent = () => {
  return (
    <div className='optionStudent'>
      <div className="options-entity">
        <Link className="linkOption" to="/createStudent">Kreiraj studenta</Link>
        <Link className='linkOption' to="/updateStudent">Azuriraj studenta</Link>
        <Link className='linkOption' to="/deleteStudent">Obrisi studenta</Link>
      </div>
      <div className="tableStudents">
        <GetStudents />
      </div>
    </div>
  )
}

export default OptionStudent
