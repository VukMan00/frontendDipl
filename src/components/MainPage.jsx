import React from 'react'
import { Link} from 'react-router-dom';

function MainPage() {
  return (
    <div className='mainPage'>
      <div className="title">
        <h1>Dobrodosli na sajt baze testova i polaganja</h1>
        <h1>Fakulteta organizacionih nauka</h1>
      </div>
      <div className="options-entity">
        <Link className='linkOption' to="/students">Studenti</Link>
        <Link className="linkOption" to="/tests">Testovi</Link>
        <Link className="linkOption" to="/exams">Polaganja</Link>
        <Link className="linkOption" to="/questions">Pitanja</Link>
      </div>
    </div>
  )
}

export default MainPage

