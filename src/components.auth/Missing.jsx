import React from 'react'
import { Link } from 'react-router-dom'

const Missing = () => {
  return (
    <div className='missing' style={{ padding: "100px" }}>
        <div className="missing-div">
            <h1>Oops!</h1>
            <p>Trazena stranica nije pronadjena!</p>
            <div className="flexGrow">
                <Link to="/" className='missingLink'>Posetite glavnu stranicu</Link>
            </div>
        </div>
    </div>
  )
}

export default Missing
