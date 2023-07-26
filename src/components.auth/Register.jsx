import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { register } from '../services/AuthService';
import { validationRegistration } from '../validation/ValidationHandler';

const Register = () => {
    const[registerMember, setRegisterMember] = useState({
        "firstname":'',
        "lastname":'',
        "email":window.localStorage?.getItem("emailRegister"),
        "password":'',
        "index":'',
        "birth":'',
        'registrationToken':''
    });

    let navigate = useNavigate();

    const registration = async(e)=>{
        e.preventDefault();
        try{
            const response = await register(registerMember);
            console.log(response);
            if(response.message==="Student je uspesno registrovan"){
                document.getElementById('registrationTokenErr').style.visibility = 'hidden';
                localStorage.clear();
                document.getElementById("textAlert").innerHTML = "Student je uspesno registrovan";
                document.getElementById("alert").style.visibility = 'visible';
            }
            else{
                document.getElementById("textAlert").innerHTML = "Greska pri registraciji";
                document.getElementById("alert").style.visibility = 'visible';
                document.getElementById('registrationTokenErr').style.visibility = 'visible';
                document.getElementById('registrationTokenErr').value = response.data.message;
            }
        }catch(e){
            document.getElementById('textAlert').innerHTML = "Greska pri registraciji";
            document.getElementById("alert").style.visibility = 'visible';
            validationRegistration(e,document.getElementById('firstnameErr'),
                                    document.getElementById("lastnameErr"),document.getElementById("passwordErr"),
                                    document.getElementById("indexErr"),document.getElementById("birthErr"),
                                    document.getElementById("registrationTokenErr"));
        }
    }

    function handleInput(e){
        let newRegisterMember = registerMember;
        newRegisterMember[e.target.name] = e.target.value;
        setRegisterMember(newRegisterMember);
    }

    function potvrdi(){
        if(document.getElementById("textAlert").innerHTML === "Student je uspesno registrovan"){
            document.getElementById("alert").style.visibility = 'hidden';
            navigate("/login");
        }
        document.getElementById("alert").style.visibility = 'hidden';
    }

  return (
    <div className='register'>
        <div className="register-div">
            <form className='register-form' onSubmit={registration}>
                <label htmlFor="firstname">Ime</label>
                <input type="text" name="firstname" placeholder='Unesite ime' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="firstnameErr" id="firstnameErr" readOnly/>
                <label htmlFor="lastname">Prezime</label>
                <input type="text" name="lastname" placeholder='Unesite prezime' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="lastnameErr" id="lastnameErr" readOnly/>
                <label htmlFor="email">Email</label>
                <input type="text" name="email" placeholder='Unesite email' value={window.localStorage?.getItem("emailRegister")} readOnly/>
                <label htmlFor='password'>Sifra</label>
                <input type="password" name="password" placeholder='Unesite sifru' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="passwordErr" id="passwordErr" readOnly/>
                <label htmlFor='index'>Indeks</label>
                <input type="text" name="index" placeholder='Unesite indeks' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="indexErr" id="indexErr" readOnly/>
                <label htmlFor='birth'>Datum rodjenja</label>
                <input type='date' name="birth" placeholder='Unesite datum rodjenja' onInput={(e)=>handleInput(e)} />
                <input type="text" name="birthErr" id="birthErr" readOnly/>
                <label htmlFor='registrationToken'>Token za registraciju</label>
                <input type="text" name='registrationToken' placeholder='Unesite registracioni token' onInput={(e)=>handleInput(e)} />
                <input type="text" name="registrationTokenErr" id="registrationTokenErr" readOnly/>
                <div className='button'>
                    <input type="submit" name="register" id="btn-register" value="Register"/>
                </div>
            </form>
        </div>
        <div id="alert">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlert">Student je uspesno registrovan</p>
                    <button id="confirm" onClick={()=>potvrdi()}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register
