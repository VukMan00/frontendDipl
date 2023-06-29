import React from 'react'
import { Link} from 'react-router-dom';

function MainPage() {
  return (
    <div className='mainPage'>
      <h1>Baza testova i polaganja za studente</h1>
      <Link to="/getTests">Pogledaj testove</Link>
      <Link to="/saveTest">Sacuvaj testove</Link>
      <Link to="/getStudents">Pregledaj studente</Link>
    </div>
  )
}

export default MainPage

