import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import GetTests from '../components.test/GetTests';

const OptionTest = () => {

  const[testId,setTestId] = useState(0);

  function getCheckedId(checkedIds){
    setTestId(checkedIds[0]);
  }

  return (
    <div className='option'>
      <div className="options-entity">
        <Link className="linkOption" to="createTest">Kreiraj test</Link>
        <Link className='linkOption' to={testId!==undefined && testId!==0 ? "updateTest" : ""} state={{testId:testId}}>Azuriraj test</Link>
        <Link className='linkOption' to={testId!==undefined && testId!==0 ? "deleteTest" : ""} state={{testId:testId}}>Obrisi test</Link>
      </div>
      <div className="tableTests">
        <GetTests getCheckedId={getCheckedId}/>
      </div>

      <Outlet />
    </div>
  )
}

export default OptionTest
