import React, { useState } from 'react'
import { checkEmail } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const PreForgottenPassword = () => {
    const navigate = useNavigate();

    const[email,setEmail] = useState({
        'recipient':'',
        'msgBody':'',
        'subject':'',
        'attachment':''
    });


    const forgottenEmail = async(e)=>{
        e.preventDefault();
        try{
            const response = await checkEmail(email);
            if(response.data!=="Email ne postoji"){
                document.getElementById('emailErr').style.visibility = 'hidden';
                document.getElementById("alert").style.visibility = 'visible';
                localStorage.setItem("email",email.recipient);
            }
            else{
                document.getElementById('emailErr').style.visibility = 'hidden';
                document.getElementById('alertWrong').style.visibility = 'visible';
            }
        }catch(err){
            console.log(err);
            document.getElementById('emailErr').style.visibility = 'visible';
            document.getElementById('emailErr').value = err.response.data.message.recipient;
        }
    }

    function handleInput(e){
        let newEmail = email;
        newEmail[e.target.name] = e.target.value;
        setEmail(newEmail);
    }

    function potvrdi(e){
        e.preventDefault();
        document.getElementById("alert").style.visibility = 'hidden';
    }

    function cancel(e){
        e.preventDefault();
        document.getElementById("alertWrong").style.visibility = 'hidden';
    }

    function toRegister(e){
        e.preventDefault();
        document.getElementById("alertWrong").style.visibility = 'hidden';
        navigate('/preRegister');
    }

    function toLogin(e){
        e.preventDefault();
        document.getElementById("alertWrong").style.visibility = 'hidden';
        navigate('/login')
    }


  return (
    <div className='preForgottenPassword'>
        <div className="preForgottenPassword-div">
            <form className="preForgottenPassword-form" onSubmit={forgottenEmail}>
                <label htmlFor="recipient">Email</label>
                <input type="text" name="recipient" placeholder='Unesite email' onInput={(e)=>handleInput(e)} style={{marginLeft: 10}}/>
                <input type="text" name="emailErr" id="emailErr" readOnly/>
                <div className='button'>
                    <input type="submit" name="preForgottenPassword" id="btn-check-account" value="Provera naloga"/>
                </div>
            </form>
        </div>
        <div id="alert">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlert">Nalog postoji u sistemu.</p>
                    <p id="textAlert">Poverite email za dalje korake!</p>
                    <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
        </div>
        <div id="alertWrong" style={{visibility:'hidden'}}>
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlert">Nalog ne postoji u sistemu.</p>
                    <button id='btn-to-register' onClick={(e)=>toRegister(e)}>Registrujte se</button>
                    <button id="btn-to-login" onClick={(e)=>toLogin(e)}>Povratak na login</button>
                    <button id="btn-confirm" onClick={(e)=>cancel(e)}>Otkazi</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PreForgottenPassword
