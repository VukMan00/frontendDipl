import React, { useState } from 'react'
import { Link, useNavigate,useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

import axios from '../api/axios';
const LOGIN_URL = "/auth/authenticate"

const Login = ({addMember}) => {

    const{setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const[memberData,setMemberData] = useState({
        'username':'',
        'firstname':'',
        'lastname':'',
        'index':'',
        'role':'',
    });


    function handleInput(e){
        let newMemberData = memberData;
        newMemberData[e.target.name] = e.target.value;
        setMemberData(newMemberData);
    }

    const login = async(e)=>{
        e.preventDefault();
        try{
            const response = await axios.post(LOGIN_URL,memberData);
            if(response.data!=null){
                console.log(response.data);
                memberData.firstname = response.data.firstname;
                memberData.lastname = response.data.lastname;
                memberData.username = response.data.email;
                memberData.role = response.data.role;
                memberData.index = response.data.index !=null ? response.data.index : null;
                memberData.token = response.data.token;
                setMemberData(memberData);
                addMember(memberData);

                const accessToken = response?.data?.accessToken;
                const roles = response?.data?.role;
                
                setAuth({ memberData, roles, accessToken});
                navigate(from,{replace:true});
            }
        }
        catch(e){
            console.log(e);
            document.getElementById("alert").style.visibility = 'visible';
        }
    }

    function potvrdi(){
        document.getElementById("alert").style.visibility = 'hidden';
    }

  return (
    <div className='login'>
        <div className='login-div'>
            <form className='login-form' onSubmit={login}>
                <label htmlFor='username'>Username</label>
                <input type="text" name="username" id="username" placeholder='Unesite korisnicko ime' onInput={(e)=>handleInput(e)} />
                <label htmlFor='password'>Password</label>
                <input type="password" name="password" id="password" placeholder='Unesite sifru' onInput={(e)=>handleInput(e)}/>
                <div className='button'>
                    <input type="submit" name="login" id="btn-login" value="LogIn" />
                </div>
                <div className='link'>
                    <Link to= "/register" className='registerLink'>Nemate nalog? Registrujte se!</Link>
                </div>
            </form>
        </div>
        <div id="alert">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlert">Neuspesno, pokusajte ponovo!</p>
                    <button id="confirm" onClick={()=>potvrdi()}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login

