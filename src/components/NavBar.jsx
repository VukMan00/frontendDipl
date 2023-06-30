import React from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

function NavBar({member}) {

  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  var pathname = location.pathname;
  const navigate = useNavigate();

  console.log(member);
  
  const logOut = async(e)=>{
    e.preventDefault(e);
    try{
      const response = await axiosPrivate.post('/auth/logout');
      console.log(response);
      navigate("/login");
    }catch(err){
      console.error(err);
    }
  }

  return (
    <div className="navigationBar">
      <div className='home-page'>
      </div>
      <div className='credentials'>
        {pathname==="/login" || pathname==="/register" ? (
          <></>
        ):(
          <>
          <h3>{member.firstname!=='' && member.lastname!=='' ? "Member: " + member.firstname + " " + member.lastname : <></>}</h3>
          <h3>{member.username!=='' ? "Email: " + member.username : <></>}</h3>
          <h3>{member.index!=='' && member.index!==null ? "Index: " + member.index : <></>}</h3>
          </>
        )}
      </div>
      <div className='loginRegister'>
        {pathname === "/login" || pathname ===  "/register" ? (
          <></>
          ) : (
          <>
          {member === null || member.token==='' || member.token === null ? (
          <>
          <Link to="/login" className='btn-login'>LogIn</Link>
          <Link to="/preRegister" className='btn-register'>Register</Link>
          </> 
          ):(
            <>
            <Link to="/logout" className='btn-logout' onClick={(e)=>logOut(e)}>LogOut</Link>
            </>
          )}
          </>
          )}
        </div>
    </div>
  )
}

export default NavBar
