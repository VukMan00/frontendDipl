import React, { useState } from 'react'
import { emailPreRegister } from '../services/AuthService';

const PreRegister = () => {

    const [isLoading, setIsLoading] = useState(false);

    const[email,setEmail] = useState({
        'recipient':'',
        'msgBody':'',
        'subject':'',
        'attachment':''
    });

    function handleInput(e){
        let newEmail = email;
        newEmail[e.target.name] = e.target.value;
        setEmail(newEmail);
    }

    const preRegister = async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        try{
            const response = await emailPreRegister(email);
            console.log(response.data);
            
            if(response.data!=="Email vec postoji"){
                setIsLoading(false);
                document.getElementById('emailErr').style.visibility = 'hidden';
                document.getElementById("alert").style.visibility = 'visible';
                window.localStorage.setItem("emailRegister",email.recipient);
            }
            else{
                setIsLoading(false);
                document.getElementById('emailErr').style.visibility = 'visible';
                document.getElementById('emailErr').value = response.data;
            }
        }catch(e){
            setIsLoading(false);
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
            <form className="register-form" onSubmit={preRegister}>
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
        <div id="alertLoading" style={isLoading ? {visibility:'visible'} : {visibility:'hidden'}}>
            <div id="boxLoading">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlert">Ucitavanje...</p>
                    <p id='textAlert'>Molimo Vas sacekajte!</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PreRegister
