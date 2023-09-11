import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAnswer, updateAnswer } from '../services/AnswerService';
import { validationAnswer } from '../validation/ValidationHandler';

const UpdateAnswer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const answerId = location.state?.answerId;
    const questionId = location.state?.questionId;

    const[trueSolution,setTrueSolution]=useState();
    const[falseSolution,setFalseSolution]=useState();

    const[updatedAnswer,setUpdatedAnswer]=useState({
        "answerPK":{
            "answerId":answerId,
            "questionId":questionId
        },
        "content":'',
        "solution":false
    })

    useEffect(()=>{
        const retrieveAnswer = async()=>{
            setIsLoading(true);
            try{
                const response = await getAnswer(answerId,questionId);
                setUpdatedAnswer(response);
                if(response.solution){
                    setTrueSolution(true);
                    setFalseSolution(false);
                }
                else{
                    setTrueSolution(false);
                    setFalseSolution(true);
                }
            }catch(err){
                console.log(err);
            }finally{
                setIsLoading(false);
            }
        }
        retrieveAnswer();
    },[answerId,questionId])

    const saveUpdatedAnswer = async(e)=>{
        setIsLoading(true);
        e.preventDefault();
        try{
            if(trueSolution){
                updatedAnswer.solution = true;
            }
            else if(falseSolution){
                updatedAnswer.solution = false;
            }
            const response = await updateAnswer(updatedAnswer);
            console.log(response);
            document.getElementById('textAlert').innerHTML = "Sistem je zapamtio odgovor";
        }catch(err){
            console.log(err);
            validation(err);
        }finally{
            setIsLoading(false);
            document.getElementById('alert').style.visibility = 'visible';
        }
    }

    function handleInput(e){
        let newAnswer = updatedAnswer;
        newAnswer[e.target.name] = e.target.value;
        setUpdatedAnswer(newAnswer);
    }

    const handleSelectTrue = (event)=>{
        if(event.target.checked){
            setTrueSolution(true);
            setFalseSolution(false);
        }
    }

    const handleSelectFalse = (event)=>{
        if(event.target.checked){
            setFalseSolution(true);
            setTrueSolution(false);
        }
    }

    function potvrdi(e){
        e.preventDefault()
        document.getElementById('alert').style.visibility = 'hidden';
        if(document.getElementById("textAlert").innerHTML === "Sistem je zapamtio odgovor"){
            clearCheckBoxes();
            navigate(-1);
        }
    }

    function cancel(e){
        e.preventDefault();
        clearCheckBoxes();
        navigate(-1);
    }

    function potvrdiNotFound(e){
        e.preventDefault();
        document.getElementById('alertWrong').style.visibility = 'hidden';
        clearCheckBoxes();
        navigate(-1);
    }

    function validation(error){
        document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti odgovor";
    
        validationAnswer(error,document.getElementById("contentErr"));
    }

    function clearCheckBoxes(){
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
      }

  if(answerId!==undefined && answerId!==0){
    return (
        <div className='update'>
            <div className="update-div">
                <form className="update-form" onSubmit={saveUpdatedAnswer}>
                    <label htmlFor="content">Naziv odgovora</label>
                    <input type="text" name="content" placeholder='Unesite naziv odgovora' defaultValue={updatedAnswer.content} onInput={(e)=>handleInput(e)}/>
                    <input type="text" name="contentErr" id="contentErr" readOnly/>
                    <label htmlFor="solution">Resenje</label>
                    <label>
                        <input type='checkbox' id="trueSolution" className="answerId" value="Tacno" defaultChecked={trueSolution} onChange={(e)=>handleSelectTrue(e)}/> Tacno
                    </label>
                    <label>
                        <input type='checkbox' id="falseSolution" className="answerId" value="Netacno" defaultChecked={falseSolution} onChange={(e)=>handleSelectFalse(e)}/> Netacno
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
  else{
    return(
        <div id="alertWrong">
            <div id="box">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                <p id="textAlert">Sistem ne moze da ucita odgovor</p>
                <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
                </div>
            </div>
        </div>
    )
  }
}

export default UpdateAnswer
