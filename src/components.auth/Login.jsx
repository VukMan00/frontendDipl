import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({addMember}) => {

    const[memberData,setMemberData] = useState({
        'username':'',
        'firstname':'',
        'lastname':'',
        'index':'',
        'role':''
    });

    let navigate = useNavigate();

    function handleInput(e){
        let newMemberData = memberData;
        newMemberData[e.target.name] = e.target.value;
        setMemberData(newMemberData);
    }

    function login(e){
        e.preventDefault();
        axios.post("http://127.0.0.1:8080/auth/authenticate",memberData)
        .then((res)=>{
            if(res.data!=null){
                console.log(res.data);
                memberData.firstname = res.data.firstname;
                memberData.lastname = res.data.lastname;
                memberData.username = res.data.email;
                memberData.role = res.data.role;
                memberData.index = res.data.index !=null ? res.data.index : null;

                window.sessionStorage.setItem('auth_token',res.data.token);
                window.sessionStorage.setItem('firstname',res.data.firstname);
                window.sessionStorage.setItem('lastname',res.data.lastname);
                window.sessionStorage.setItem('index',res.data.index);
                window.sessionStorage.setItem('email',res.data.email);
                window.sessionStorage.setItem('role',res.data.role);
                setMemberData(memberData);
                addMember(memberData);
                navigate("/");
            }
        }).catch((e)=>{
            console.log(e);
            document.getElementById("alert").style.visibility = 'visible';
        });
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

