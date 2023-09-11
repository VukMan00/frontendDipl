import React, { useState } from 'react'
import { Link, useNavigate,useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { authenticate, emailForPassowrd } from '../services/AuthService';

const Login = () => {

    const{setAuth} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        try{
            const memberResponse = await authenticate(memberData);
            setMemberData(memberResponse);

            const roles = memberResponse?.roles;
            const accessToken = memberResponse?.accessToken;
            setAuth({roles, accessToken});

            if(memberData?.password === memberData?.index){
                setIsLoading(false);
                email.recipient = memberData.username;
                setEmail(email);
                sendEmailForPassword(email);
            }
            else{
                setIsLoading(false);
                document.getElementById('textAlert').innerHTML = "Uspesno ste se ulogovali";
            }     
        }
        catch(e){
            console.log(e);
            document.getElementById('textAlert').innerHTML = "Neispravno uneti podaci";
        }finally{
            setIsLoading(false);
            document.getElementById("alert").style.visibility = 'visible';
        }
    }

    const sendEmailForPassword=async(email)=>{
        document.getElementById("alertPassword").style.visibility = 'visible';
        try{
            const response = await emailForPassowrd(email);
            if(response.data!=null){
                console.log(response.data);
            }
        }catch(e){
            console.log(e);
        }
    }

    function potvrdi(){
        document.getElementById("alert").style.visibility = 'hidden';
        if(document.getElementById('textAlert').innerHTML === 'Uspesno ste se ulogovali'){
            navigate(from,{replace:true});
        }
    }

    function potvrdiPassword(){
        document.getElementById('alertPassword').style.visibility = 'hidden';
        navigate(from,{replace:true});
    }

  return (
    <div className='login'>
        <div className='login-div'>
            <form className='login-form' onSubmit={login}>
                <label htmlFor='username'>Korisnicko ime</label>
                <input type="text" name="username" id="username" placeholder='Unesite korisnicko ime' onInput={(e)=>handleInput(e)} />
                <label htmlFor='password'>Lozinka</label>
                <input type="password" name="password" id="password" placeholder='Unesite sifru' onInput={(e)=>handleInput(e)}/>
                <Link style={{marginTop:'10px'}} to="/preForgottenPassword" className='forgottenPasswordLink'>Zaboravili ste lozinku?</Link>
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
                    <p id="textAlert">Neispravno uneti podaci</p>
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

export default Login

