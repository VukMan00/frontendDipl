import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function NavBar({member}) {

  const location = useLocation();
  var pathname = location.pathname;

  console.log(member);
  
  function logOut(e){
  }

  return (
    <div className="navigationBar">
      <div className='home-page'>
      </div>
      <div className='credentials'>
        <h3>{member.firstname!=='' && member.lastname!=='' ? "Member: " + member.firstname + " " + member.lastname : <></>}</h3>
        <h3>{member.username!=='' ? "Email: " + member.username : <></>}</h3>
        <h3>{member.index!=='' && member.index!==null ? "Index: " + member.index : <></>}</h3>
      </div>
      <div className='loginRegister'>
        {pathname === "/login" || pathname ===  "/register" ? (
          <></>
          ) : (
          <>
          {member === null || member.token==='' || member.token === null ? (
          <>
          <Link to="/login" className='btn-login'>LogIn</Link>
          <Link to="/register" className='btn-register'>Register</Link>
          </> 
          ):(
            <>
            <Link to="" className='btn-logout' onClick={(e)=>logOut(e)}>LogOut</Link>
            </>
          )}
          </>
          )}
        </div>
    </div>
  )
}

export default NavBar
