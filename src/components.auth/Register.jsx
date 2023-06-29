import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import axios from '../api/axios';
const REGISTER_URL = "/auth/register"

const Register = () => {
    const[registerMember, setRegisterMember] = useState({
        "firstname":'',
        "lastname":'',
        "email":'',
        "password":'',
        "index":'',
        "birth":''
    });

    let navigate = useNavigate();

    const register = async(e)=>{
        e.preventDefault();
        try{
            const response = await axios.post(REGISTER_URL,registerMember);
            if(response.data.message==null){
                document.getElementById('emailErr').style.visibility = 'hidden';
                navigate("/login");
            }
            else{
                console.log(response.data.message);
                document.getElementById('emailErr').style.visibility = 'visible';
                document.getElementById('emailErr').value = response.data.message.body;
            }
        }catch(e){
            document.getElementById("alert").style.visibility = 'visible';
            validation(e);
        }
    }

    function validation(e){
        if(e.response.data.message.firstname !== undefined){
            document.getElementById('firstnameErr').style.visibility = 'visible';
            document.getElementById('firstnameErr').value = e.response.data.message.firstname;
        }
        else{
            document.getElementById('firstnameErr').style.visibility = 'hidden';
        }
        if(e.response.data.message.lastname !== undefined){
            document.getElementById('lastnameErr').style.visibility = 'visible';
            document.getElementById('lastnameErr').value = e.response.data.message.lastname;
        }
        else{
            document.getElementById('lastnameErr').style.visibility = 'hidden';
        }
        if(e.response.data.message.email !== undefined){
            document.getElementById('emailErr').style.visibility = 'visible';
            document.getElementById('emailErr').value = e.response.data.message.email;
        }
        else{
            document.getElementById('emailErr').style.visibility = 'hidden';
        }
        if(e.response.data.message.password !== undefined){
            document.getElementById('passwordErr').style.visibility = 'visible';
            document.getElementById('passwordErr').value = e.response.data.message.password;
        }
        else{
            document.getElementById('passwordErr').style.visibility = 'hidden';
        }
        if(e.response.data.message.index !== undefined){
            document.getElementById('indexErr').style.visibility = 'visible';
            document.getElementById('indexErr').value = e.response.data.message.index;
        }
        else{
            document.getElementById('indexErr').style.visibility = 'hidden';
        }
        if(e.response.data.message.birth!==undefined){
            document.getElementById('birthErr').style.visibility = 'visible';
            document.getElementById('birthErr').value = e.response.data.message.birth;
        }
        else{
            document.getElementById('birthErr').style.visibility = 'hidden';
        }
    }

    function handleInput(e){
        let newRegisterMember = registerMember;
        newRegisterMember[e.target.name] = e.target.value;
        setRegisterMember(newRegisterMember);
    }

    function potvrdi(){
        document.getElementById("alert").style.visibility = 'hidden';
    }

  return (
    <div className='register'>
        <div className="register-div">
            <form className='register-form' onSubmit={register}>
                <label htmlFor="firstname">Ime</label>
                <input type="text" name="firstname" placeholder='Unesite ime' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="firstnameErr" id="firstnameErr" readOnly/>
                <label htmlFor="lastname">Prezime</label>
                <input type="text" name="lastname" placeholder='Unesite prezime' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="lastnameErr" id="lastnameErr" readOnly/>
                <label htmlFor="email">Email</label>
                <input type="text" name="email" placeholder='Unesite email' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="emailErr" id="emailErr" readOnly/>
                <label htmlFor='password'>Sifra</label>
                <input type="password" name="password" placeholder='Unesite sifru' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="passwordErr" id="passwordErr" readOnly/>
                <label htmlFor='index'>Indeks</label>
                <input type="text" name="index" placeholder='Unesite indeks' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="indexErr" id="indexErr" readOnly/>
                <label htmlFor='birth'>Datum rodjenja</label>
                <input type='date' name="birth" placeholder='Unesite datum rodjenja' onInput={(e)=>handleInput(e)} />
                <input type="text" name="birthErr" id="birthErr" readOnly/>
                <div className='button'>
                    <input type="submit" name="register" id="btn-register" value="Register" onInput={(e)=>handleInput(e)}/>
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

export default Register
