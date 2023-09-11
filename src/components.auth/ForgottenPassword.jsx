import React, { useState } from 'react'
import { changePassword } from '../services/AuthService';
import { validationChangingPassword } from '../validation/ValidationHandler';
import { useNavigate } from 'react-router-dom';

const ForgottenPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const[reqPassword,setReqPassword]=useState({
    'username':window.localStorage.getItem('email'),
    'newPassword':'',
    'confirmNewPassword':'',
    'token':''
  });

  function handleInput(e){
    let newReqPassword = reqPassword;
    newReqPassword[e.target.name] = e.target.value;
    setReqPassword(newReqPassword);

    if(newReqPassword.confirmNewPassword === newReqPassword.newPassword && newReqPassword.confirmNewPassword!==''){
      document.getElementById('confirmNewPasswordErr').style.visibility = 'visible';
      document.getElementById('confirmNewPasswordErr').style.color = 'green';
      document.getElementById('confirmNewPasswordErr').value = 'Nova lozinka se poklapa!';
    }
    else{
      document.getElementById('confirmNewPasswordErr').style.visibility = 'visible';
      document.getElementById('confirmNewPasswordErr').style.color = 'red';
      document.getElementById('confirmNewPasswordErr').value = 'Nova lozinka se ne poklapa!';
    }
  }

  const savePassword = async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    if(document.getElementById('confirmNewPasswordErr').value === 'Nova lozinka se poklapa!'){
      try{
        const response = await changePassword(reqPassword);
        console.log(response);
        setIsLoading(false);
        document.getElementById('textAlert').innerHTML = 'Sistem je promenio lozinku';
        document.getElementById('alert').style.visibility = 'visible';
      }catch(e){
        setIsLoading(false);
        document.getElementById("textAlert").innerHTML = "Sistem ne moze da promeni lozinku";
        document.getElementById("alert").style.visibility = 'visible';
        validationChangingPassword(e,null,document.getElementById("newPasswordErr"));
      }
    }
    else{
      setIsLoading(false);
      document.getElementById('textAlert').innerHTML = 'Sistem ne moze da promeni lozinku"';
      document.getElementById('alert').style.visibility = 'visible';
    }
  }

  function potvrdi(e){
    if(document.getElementById('textAlert').innerHTML === 'Sistem je promenio lozinku'){
      localStorage.clear();
      document.getElementById("alert").style.visibility = 'hidden';
      navigate("/login");
    }
    else{
      document.getElementById("alert").style.visibility = 'hidden';
    }
  }

  return (
    <div className='changePassword'>
        <div className="changePassword-div">
            <form className="changePassword-form" onSubmit={savePassword}>
                <label htmlFor="email">Email korisnika</label>
                <input type='text' name="email" id="email" defaultValue={window.localStorage.getItem('email')} readOnly/>
                <label htmlFor="newPassword">Nova lozinka</label>
                <input type="password" name="newPassword" id="newPassword" placeholder='Unesite novu lozinku' onInput={(e)=>handleInput(e)} />
                <input type="text" name="newPasswordErr" id="newPasswordErr" readOnly />
                <label htmlFor='confirmNewPassword'>Potvrda nove lozinke</label>
                <input type="password" name="confirmNewPassword" id="confirmNewPassword" placeholder='Potvrdite novu lozinku' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="confirmNewPasswordErr" id="confirmNewPasswordErr" defaultValue="Nova lozinka se ne poklapa sa potvrdjenom!" readOnly />
                <label htmlFor="token">Token</label>
                <input type="text" name='token' placeholder='Unesite token' onInput={(e)=>handleInput(e)} />
                <input type="text" name="token" id="tokenErr" readOnly/>
                <div className='button'>
                    <input type="submit" name="changePassword" id="btn-changePassword" value="Promeni lozinku" />
                </div>
            </form>
        </div>
        <div id="alert">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlert">Sistem je promenio lozinku</p>
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

export default ForgottenPassword
