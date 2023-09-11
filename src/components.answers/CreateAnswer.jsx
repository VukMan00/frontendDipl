import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createAnswer } from '../services/AnswerService';
import { validationAnswer } from '../validation/ValidationHandler';

const CreateAnswer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const questionId = location.state?.questionId;
    const [isLoading, setIsLoading] = useState(false);

    const[trueSolution,setTrueSolution]=useState(undefined);
    const[falseSolution,setFalseSolution]=useState(undefined);

    const[answer,setAnswer]=useState({
        "answerPK":{
            "answerId":0,
            "questionId":questionId
        },
        "content":'',
        "solution":false
    })

    const saveAnswer = async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        try{
            if(trueSolution){
                answer.solution = true;
            }
            else if(falseSolution){
               answer.solution = false;
            }
            const response = await createAnswer(answer);
            console.log(response);
            setIsLoading(false);
            document.getElementById('textAlert').innerHTML = "Sistem je zapamtio odgovor";
            document.getElementById('alert').style.visibility = 'visible';
        }catch(err){
            console.log(err);
            setIsLoading(false);
            validation(err);
        }
    }

    function handleInput(e){
        let newAnswer = answer;
        newAnswer[e.target.name] = e.target.value;
        setAnswer(newAnswer)
    }

    const handleCheckTrue = (event)=>{
        if(event.target.checked){
            setTrueSolution(true);
            setFalseSolution(false);
        }
    }

    const handleCheckFalse = (event)=>{
        if(event.target.checked){
            setFalseSolution(true);
            setTrueSolution(false);
        }
    }

    function potvrdi(e){
        e.preventDefault()
        document.getElementById('alert').style.visibility = 'hidden';
        if(document.getElementById("textAlert").innerHTML === "Sistem je zapamtio odgovor"){
            navigate(-1);
        }
    }

    function cancel(e){
        e.preventDefault();
        navigate(-1);
    }

    function validation(error){
        document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti odgovor";
        document.getElementById('alert').style.visibility = 'visible';
    
        validationAnswer(error,document.getElementById("contentErr"));
    }

  return (
    <div className='create'>
        <div className="create-div">
            <form className="create-form" onSubmit={saveAnswer}>
                <label htmlFor="content">Naziv odgovora</label>
                <input type="text" name="content" placeholder='Unesite naziv odgovora' onInput={(e)=>handleInput(e)}/>
                <input type="text" name="contentErr" id="contentErr" readOnly/>
                <label htmlFor="solution">Resenje</label>
                <label>
                    <input type='checkbox' className="answerId" value="Tacno" onChange={handleCheckTrue}/> Tacno
                </label>
                <label>
                    <input type='checkbox' className="answerId" value="Netacno" onChange={handleCheckFalse}/> Netacno
                </label>
                <div className='button'>
                    <input type="submit" name="saveAnswer" id="btn-save" value="Sacuvaj"/>
                    <button id="cancel" onClick={(e)=>cancel(e)}>Otkazi</button>
                </div>
            </form>
        </div>
        <div id="alert">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlert">Sistem je zapamtio odgovor</p>
                    <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
                </div>
            </div>
        </div>
        <div id="alertLoading" style={isLoading ? {visibility:'visible'} : {visibility:'hidden'}}>
            <div id="boxLoading">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlertLoading">Ucitavanje...</p>
                    <p id='textAlertLoading'>Molimo Vas sacekajte!</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateAnswer
