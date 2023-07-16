import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const AddAnswer = ({getAnswers}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const answers = location.state?.answers;

    const[answer,setAnswer]=useState({
        'answerPK':{
            "questionId":0,
            "answerId":0
        },
        'content':'',
        'solution':false
    })

    const[trueSolution,setTrueSolution]=useState(undefined);
    const[falseSolution,setFalseSolution]=useState(undefined);

    const saveAnswer = async(e)=>{
        e.preventDefault();
        if(answer.content!==undefined && answer.content!=='' && answer.content.length>2){
            document.getElementById('answerContentErr').style.visibility = 'hidden';
            if(trueSolution){
                 answer.solution = true;
            }
            else if(falseSolution){
                answer.solution = false;
            }
            console.log(answers.length);
            answer.answerPK.answerId = answers.length===0 ? answers?.length+1 : answers[answers.length-1].answerPK.answerId + 1;
            console.log(answer);
            answers.push(answer);
            getAnswers(answers);
            navigate(-1);
        }
        else{
            console.log("USAO OVDE")
            document.getElementById('answerContentErr').style.visibility = 'visible';
            document.getElementById('answerContentErr').value = "Neispravno uneti podaci za naziv pitanja";
        }
    }

    function handleInput(e){
        let newAnswer = answer;
        newAnswer[e.target.name] = e.target.value;
        setAnswer(newAnswer);
    }

    const handleCheckTrue = (event)=>{
        if(event.target.checked){
            setTrueSolution(true);
        }
    }

    const handleCheckFalse = (event)=>{
        if(event.target.checked){
            setFalseSolution(true);
        }
    }

    function cancel(e){
        e.preventDefault();
        navigate(-1);
    }

    return (
        <div className='create'>
            <div className="create-div">
                <form className="create-form" onSubmit={saveAnswer}>
                    <label htmlFor="content">Naziv odgovora</label>
                    <input type="text" name="content" placeholder='Unesite naziv odgovora' onInput={(e)=>handleInput(e)}/>
                    <input type="text" name="answerContentErr" id="answerContentErr" readOnly/>
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
        </div>
    )
}

export default AddAnswer
