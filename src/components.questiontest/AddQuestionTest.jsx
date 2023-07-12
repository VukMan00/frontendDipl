import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { saveQuestionTest } from '../services/TestService';

const AddQuestionTest = ({getQuestionsTest}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const questionsForPoints = location.state?.questionsForPoints;
    const testId = location.state?.testId;
    const updatedTest = location.state?.updatedTest;
    
    const[arrayQuestionTest,setArrayQuestionTest] = useState([]);

    function handleInput(e,question,i){
        if(e.target.value>0 && e.target.value<100){
            const questionPoints={
                "questionTestPK":{
                    "questionId":question?.questionTestPK?.questionId===undefined ? question?.id : question?.questionTestPK?.questionId,
                    "testId":testId
                },
                "question": question.question===undefined ? question : question?.question,
                "test":updatedTest!==undefined ? updatedTest : undefined,
                "points":e.target.value!==undefined ? e.target.value : 0
            }
            arrayQuestionTest[i] = questionPoints;
            questionsForPoints[i].points = questionPoints?.points;
            setArrayQuestionTest(arrayQuestionTest);
        }
        else{
            arrayQuestionTest[i] = null;
        }
        const filterQuestion = arrayQuestionTest.filter(question=>question==null);
        if(filterQuestion.length>0){
            document.getElementById('pointsErr').value = "Broj poena mora biti u intervalu od 0 do 100";
            document.getElementById('pointsErr').style.visibility = 'visible';
        }
        else{
            document.getElementById('pointsErr').style.visibility = 'hidden';
        }
    }
    
    const addQuestionTest = async(e)=>{
        e.preventDefault();
        if(document.getElementById('pointsErr').style.visibility === 'hidden'){
            if(updatedTest===undefined){
                const response = await saveQuestionTest(arrayQuestionTest);
                console.log(response);
                navigate("/tests");
            }
            else{
                console.log(questionsForPoints);
                getQuestionsTest(questionsForPoints);
                navigate(-1);
            }
        }
    }

    function cancel(e){
        e.preventDefault();
        if(updatedTest===undefined){
            navigate("/tests");
        }
        else{
            navigate(-1);
        }
    }

    return (
    <div className='create-div'>
        <form className='create-form' onSubmit={addQuestionTest}>
            {questionsForPoints?.length
            ? (
            <>
              {questionsForPoints.map((question,i)=>
              <div>
                {question?.content || question?.question?.content}
                <input key={question?.id || question?.questionTestPK?.questionId} name='points' defaultValue={question?.points} placeholder='Unesite broj poena pitanja' style={{marginLeft:'10px'}} onChange={(e)=>handleInput(e,question,i)}/>
              </div>
              )}
            </>
            )
            :
            <h1>Niste izabrali pitanja</h1>
            }
            <input type="text" id="pointsErr" name="pointsErr" readOnly />
            <div className='button'>
                <input type="submit" name="saveTest" id="btn-save" value="Sacuvaj"/>
                <button id="cancel" onClick={(e)=>cancel(e)}>Otkazi</button>
            </div>
        </form>
    </div>
     )
}

export default AddQuestionTest