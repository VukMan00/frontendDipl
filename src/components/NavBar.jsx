import React from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth';

function NavBar({member}) {

  const axiosPrivate = useAxiosPrivate();
  const{setAuth} = useAuth();
  const location = useLocation();
  var pathname = location.pathname;
  const navigate = useNavigate();
  
  const logOut = async(e)=>{
    e.preventDefault(e);
    try{
      const response = await axiosPrivate.post('/auth/logout');

      const memberData = null;
      const accessToken = null;
      const roles = null;
      setAuth({memberData,roles,accessToken});
      member = null;
      navigate("/login");
    }catch(err){
      console.error(err);
    }
  }

  return (
    <div className="navigationBar">
      <div className='home-page'>
        <Link to="/" className='homePage'>Pocetna stranica</Link>
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
