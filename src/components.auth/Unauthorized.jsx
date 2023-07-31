import React from 'react'
import {useNavigate} from "react-router-dom"

const Unauthorized = () => {

    let navigate = useNavigate();

  return (
    <div className="unauthorized">
      <div className='unauthorized-div'>
          <h1>Neovlascen pristup</h1>
          <br />
          <p>Nemate pristup trazenoj stranici!</p>
          <div className="flexGrow">
              <button id='btn-goBack' onClick={() => navigate("/")}>Vrati se na pocetnu stranicu</button>
          </div>
      </div>
    </div>
  )
}

export default Unauthorized
