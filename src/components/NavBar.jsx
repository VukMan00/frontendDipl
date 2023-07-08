import React from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import { logOut } from '../services/AuthService';

function NavBar() {

  const{setAuth} = useAuth();
  const location = useLocation();
  var pathname = location.pathname;
  const navigate = useNavigate();
  
  const logOutMember = async(e)=>{
    e.preventDefault(e);
    try{
      const response = await logOut();
      console.log(response);
      const memberData = null;
      const accessToken = null;
      const roles = null;
      localStorage.clear();
      setAuth({memberData,roles,accessToken});
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
        {pathname==="/login" || pathname==="/register" || pathname==="/preRegister" ? (
          <></>
        ):(
          <>
          <h3>{window.localStorage.getItem("firstname")!=='' && window.localStorage.getItem('lastname')!=='' ? "Member: " + window.localStorage.getItem('firstname') + " " + window.localStorage.getItem('lastname') : <></>}</h3>
          <h3>{window.localStorage.getItem('username')!=='' ? "Email: " + window.localStorage.getItem('username') : <></>}</h3>
          <h3>{window.localStorage.getItem('index')!=='' && window.localStorage.getItem('index')!=='null' ? "Index: " + window.localStorage.getItem('index') : <></>}</h3>
          </>
        )}
      </div>
      <div className='loginRegister'>
        {pathname === "/login" || pathname ===  "/register" || pathname==="/preRegister" ? (
          <></>
          ) : (
          <>
          {window.localStorage.getItem('accessToken')==='' || window.localStorage.getItem('accessToken') === 'null' ? (
          <>
          <Link to="/login" className='btn-login'>LogIn</Link>
          <Link to="/preRegister" className='btn-register'>Register</Link>
          </> 
          ):(
            <>
            <Link to="/logout" className='btn-logout' onClick={(e)=>logOutMember(e)}>LogOut</Link>
            </>
          )}
          </>
          )}
        </div>
    </div>
  )
}

export default NavBar
