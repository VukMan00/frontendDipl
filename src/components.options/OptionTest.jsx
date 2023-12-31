import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import GetTests from '../components.test/GetTests';

const OptionTest = ({refresh}) => {

  const[testId,setTestId] = useState(0);

  function getCheckedId(checkedIds){
    setTestId(checkedIds[0]);
  }

  return (
    <div className='option'>
      {localStorage.getItem("role")==="ROLE_ADMIN" ? (
      <div className="options-entity">
        <Link className="linkOption" to="createTest">Kreiraj test</Link>
        <Link className='linkOption' to={"updateTest"} state={{testId:testId}} onClick={refresh}>Azuriraj test</Link>
        <Link className='linkOption' to={"deleteTest"} state={{testId:testId}}>Obrisi test</Link>
        <Link className='linkOption' to={"viewTest"} state={{testId:testId}}>Pregledaj test</Link>
      </div>
      ):(
      <></>
      )}
      <div className="tableTests">
        <GetTests getCheckedId={getCheckedId}/>
      </div>

      <Outlet />
    </div>
  )
}

export default OptionTest
