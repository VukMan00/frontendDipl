import React, { useState } from 'react'
import { Link, useNavigate,useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

import axios, { axiosPrivate } from '../api/axios';
const LOGIN_URL = "/auth/authenticate"

const Login = () => {

    const{setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const[memberData,setMemberData] = useState({
        'username':'',
        'password':'',
        'firstname':'',
        'lastname':'',
        'index':'',
        'role':'',
    });

    const[email,setEmail] = useState({
        'recipient':'',
        'msgBody':'',
        'subject':'',
        'attachment':''
    })

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
                memberData.firstname = response.data.firstname;
                memberData.lastname = response.data.lastname;
                memberData.username = response.data.email;
                memberData.role = response.data.role;
                memberData.index = response.data.index !=null ? response.data.index : null;

                setMemberData(memberData);

                window.localStorage.setItem("id",response.data?.id);
                window.localStorage.setItem("firstname",memberData.firstname);
                window.localStorage.setItem("lastname",memberData.lastname);
                window.localStorage.setItem("username",memberData.username);
                window.localStorage.setItem("role",memberData.role);
                window.localStorage.setItem("index",memberData.index!=null ? memberData.index : null);
                window.localStorage.setItem('accessToken',response?.data?.accessToken);
                const accessToken = response?.data?.accessToken;
                const roles = response?.data?.role;
                
                setAuth({roles, accessToken});

                if(memberData?.password === memberData?.index){
                    email.recipient = memberData.username;
                    setEmail(email);
                    sendEmailForPassword();
                }
                else{
                    navigate(from,{replace:true});
                }
            }
        }
        catch(e){
            console.log(e);
            document.getElementById("alert").style.visibility = 'visible';
        }
    }

    const sendEmailForPassword=async()=>{
        document.getElementById("alertPassword").style.visibility = 'visible';
        try{
            const response = await axiosPrivate.post("/auth/emailChangePassword",email);
            if(response.data!=null){
                console.log(response.data);
            }
        }catch(e){
            console.log(e);
        }
    }

    function potvrdi(){
        document.getElementById("alert").style.visibility = 'hidden';
    }

    function potvrdiPassword(){
        document.getElementById('alertPassword').style.visibility = 'hidden';
        navigate(from,{replace:true});
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
                    <Link to= "/preRegister" className='registerLink'>Nemate nalog? Registrujte se!</Link>
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
        <div id="alertPassword">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlert">Lozinka pod kojom ste se ulogovali je slaba.</p>
                    <p id="textAlert">Radi Vaše sigurnosti molimo Vas da je promenite</p>
                    <p id="textAlert">Proverite inbox na Vašem email-u za dalje korake!</p>
                    <button id="confirm" onClick={()=>potvrdiPassword()}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login

