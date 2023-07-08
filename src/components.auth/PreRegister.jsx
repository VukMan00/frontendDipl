import React, { useState } from 'react'
import { emailPreRegister } from '../services/AuthService';

const PreRegister = () => {

    const[email,setEmail] = useState({
        'recipient':'',
        'msgBody':'',
        'subject':'',
        'attachment':''
    });

    function handleInput(e){
        let newEmail = email;
        newEmail[e.target.name] = e.target.value;
        console.log(newEmail);
        setEmail(newEmail);
    }

    const preRegister = async(e)=>{
        e.preventDefault();
        try{
            const response = await emailPreRegister(email);
            if(response.data!=null){
                document.getElementById('emailErr').style.visibility = 'hidden';
                document.getElementById("alert").style.visibility = 'visible';
                window.localStorage.setItem("emailRegister",email.recipient);
            }
        }catch(e){
            document.getElementById('emailErr').style.visibility = 'visible';
            document.getElementById('emailErr').value = e.response.data.message.recipient;
        }
    }

    function potvrdi(){
        document.getElementById("alert").style.visibility = 'hidden';
    }

  return (
    <div className='register'>
        <div className="register-div">
            <form className="register-for" onSubmit={preRegister}>
                <label htmlFor="recipient">Email</label>
                <input type="text" name="recipient" placeholder='Unesite email' onInput={(e)=>handleInput(e)} style={{marginLeft: 10}}/>
                <input type="text" name="emailErr" id="emailErr" readOnly/>
                <div className='button'>
                    <input type="submit" name="preRegister" id="btn-register" value="Register"/>
                </div>
            </form>
        </div>
        <div id="alert">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlert">Email je poslat na vas nalog!</p>
                    <p id="textAlert">Proverite inbox i nastavite postupak registracije.</p>
                    <button id="confirm" onClick={()=>potvrdi()}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PreRegister
