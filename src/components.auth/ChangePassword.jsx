import React, { useState } from 'react'
import { axiosPrivate } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const[reqPassword,setReqPassword]=useState({
       'username':window.localStorage.getItem('username'),
       'oldPassword':'',
       'newPassword':'',
       'confirmNewPassword':'' 
    });

    const navigate = useNavigate();

    function handleInput(e){
        let newReqPassword = reqPassword;
        newReqPassword[e.target.name] = e.target.value;
        setReqPassword(newReqPassword);

        if(newReqPassword.confirmNewPassword === newReqPassword.newPassword && newReqPassword.confirmNewPassword!==''){
            document.getElementById('confirmNewPasswordErr').style.visibility = 'visible';
            document.getElementById('confirmNewPasswordErr').style.color = 'green';
            document.getElementById('confirmNewPasswordErr').value = 'Nova lozinka se poklapa sa potvrdjenom!';
        }
        else{
            document.getElementById('confirmNewPasswordErr').style.visibility = 'visible';
            document.getElementById('confirmNewPasswordErr').style.color = 'red';
            document.getElementById('confirmNewPasswordErr').value = 'Nova lozinka se ne poklapa sa potvrdjenom!';
        }
    }

    const changePassword = async(e)=>{
        e.preventDefault();
        if(document.getElementById('confirmNewPasswordErr').value === 'Nova lozinka se poklapa sa potvrdjenom!'){
            try{
                const response = await axiosPrivate.post("/auth/changePassword",reqPassword);
                console.log(response);
                document.getElementById('textAlert').innerHTML = 'Uspesno ste promenili lozinku!';
                document.getElementById('alert').style.visibility = 'visible';
            }catch(e){
                console.log(e);
                validation(e);
            }
        }
        else{
            document.getElementById('textAlert').innerHTML = 'Niste ispravno potvrdili novu lozinku';
            document.getElementById('alert').style.visibility = 'visible';
        }
    }

    function potvrdi(){
        if(document.getElementById('textAlert').innerHTML === 'Uspesno ste promenili lozinku!'){
            localStorage.clear();
            document.getElementById("alert").style.visibility = 'hidden';
            navigate("/login");
        }
        else{
            document.getElementById("alert").style.visibility = 'hidden';
        }
    }

    function validation(e){
        if(e.response.data.message.oldPassword!==undefined){
            document.getElementById('oldPasswordErr').value = e.response.data.message.oldPassword;
            document.getElementById('oldPasswordErr').style.visibility = 'visible';
        }
        else{
            document.getElementById('oldPasswordErr').style.visibility = 'hidden';
        }
        if(e.response.data.message.newPassword!==undefined){
            document.getElementById('newPasswordErr').value = e.response.data.message.newPassword;
            document.getElementById('newPasswordErr').style.visibility = 'visible';
        }
        else{
            document.getElementById('newPasswordErr').style.visibility = 'hidden';
        }
        if(e.response.data.message.error!==undefined){
            document.getElementById('oldPasswordErr').value = "Pogresna stara lozinka"
            document.getElementById('oldPasswordErr').style.visibility = 'visible';
        }
        else{
            document.getElementById('oldPasswordErr').style.visibility = 'hidden';
        }
    }

  return (
    <div className='changePassword'>
        <div className="changePassword-div">
            <form className="changePassword-form" onSubmit={changePassword}>
                <label htmlFor="email">Email korisnika</label>
                <input type='text' name="email" id="email" defaultValue={window.localStorage.getItem('username')} readOnly/>
                <label htmlFor="oldPassword">Stara lozinka</label>
                <input type="password" name="oldPassword" id="oldPassword" placeholder='Unesite staru lozinku' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="oldPasswordErr" id="oldPasswordErr" readOnly />
                <label htmlFor="newPassword">Nova lozinka</label>
                <input type="password" name="newPassword" id="newPassword" placeholder='Unesite novu lozinku' onInput={(e)=>handleInput(e)} />
                <input type="text" name="newPasswordErr" id="newPasswordErr" readOnly />
                <label htmlFor='confirmNewPassword'>Potvrda nove lozinke</label>
                <input type="password" name="confirmNewPassword" id="confirmNewPassword" placeholder='Potvrdite novu lozinku' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="confirmNewPasswordErr" id="confirmNewPasswordErr" defaultValue="Nova lozinka se ne poklapa sa potvrdjenom!" readOnly />
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
                    <p id="textAlert">Uspesno ste promenili lozinku!</p>
                    <button id="confirm" onClick={()=>potvrdi()}>OK</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChangePassword
