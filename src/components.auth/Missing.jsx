import React from 'react'
import { Link } from 'react-router-dom'

const Missing = () => {
  return (
    <div className='missing' style={{ padding: "100px" }}>
        <div className="missing-div">
            <h1>Oops!</h1>
            <p>Page Not Found</p>
            <div className="flexGrow">
                <Link to="/" className='missingLink'>Visit Our Homepage</Link>
            </div>
        </div>
    </div>
  )
}

export default Missing
