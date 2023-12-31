import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { saveQuestionTest } from '../services/TestService';

const AddQuestionTest = ({getQuestionsTest}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = location?.pathname;
    const [isLoading, setIsLoading] = useState(false);

    const questionsForPoints = location.state?.questionsForPoints;
    const testId = location.state?.testId;
    const updatedTest = location.state?.updatedTest;
    const questionId = location.state?.questionId;
    const updatedQuestion = location.state?.updatedQuestion;
    
    const[arrayQuestionTest,setArrayQuestionTest] = useState([]);

    function handleInput(e,questionTest,i){
        if(e.target.value>0 && e.target.value<100){
            let questionPoints = null;
            if(questionId===undefined){
                questionPoints={
                    "questionTestPK":{
                        "questionId":questionTest?.questionTestPK?.questionId===undefined ? questionTest?.id : questionTest?.questionTestPK?.questionId,
                        "testId":testId
                    },
                    "question": questionTest.question===undefined ? questionTest : questionTest?.question,
                    "test":updatedTest!==undefined ? updatedTest : undefined,
                    "points":e.target.value!==undefined ? e.target.value : 0
                }
            }
            else{
                questionPoints={
                    "questionTestPK":{
                        "questionId":questionId,
                        "testId":questionTest?.questionTestPK?.testId===undefined ? questionTest?.id : questionTest?.questionTestPK?.testId,
                    },
                    "question": updatedQuestion!==undefined ? updatedQuestion : undefined,
                    "test":questionTest.test===undefined ? questionTest : questionTest?.test,
                    "points":e.target.value!==undefined ? e.target.value : 0
                }
            }
            arrayQuestionTest[i] = questionPoints;
            questionsForPoints[i].points = questionPoints?.points;
            setArrayQuestionTest(arrayQuestionTest);
        }
        else{
            arrayQuestionTest[i] = null;
        }
        const filterQuestionTest = arrayQuestionTest.filter(questionTest=>questionTest==null);
        if(filterQuestionTest.length>0){
            document.getElementById('pointsErr').value = "Broj poena mora biti u intervalu od 0 do 100";
            document.getElementById('pointsErr').style.visibility = 'visible';
        }
        else{
            document.getElementById('pointsErr').style.visibility = 'hidden';
        }
    }
    
    const addQuestionTest = async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        if(document.getElementById('pointsErr').style.visibility === 'hidden'){
            if(!pathName.includes("updateTest") && !pathName.includes("updateQuestion")){
                const response = await saveQuestionTest(arrayQuestionTest);
                console.log(response);
                setIsLoading(false);
                pathName.includes("tests/") ? navigate("/tests") : navigate("/questions");
            }
            else{
                getQuestionsTest(questionsForPoints);
                setIsLoading(false);
                navigate(-1);
            }
        }
        else{
            navigate(-1);
        }
        setIsLoading(false);
    }

    function cancel(e){
        e.preventDefault();
        if(updatedQuestion!==undefined || updatedTest!==null){
            navigate(-1);
        }
        else{
            pathName.includes("tests/") ? navigate("/tests") : navigate("/questions");
        }
    }

    return (
    <div className='create-div'>
        <form className='create-form' onSubmit={addQuestionTest}>
            {questionsForPoints?.length
            ? (
            <>
              {questionsForPoints.map((questionTest,i)=>
              <div key={pathName.includes("tests") ?  questionTest?.questionTestPK?.questionId || questionTest?.id : questionTest?.questionTestPK?.testId || questionTest?.id}>
                {pathName.includes("tests") ? questionTest?.content || questionTest?.question?.content : questionTest?.content || questionTest?.test?.content}
                <input key={i} name='points' defaultValue={questionTest?.points} placeholder='Unesite broj poena pitanja' style={{marginLeft:'10px'}} onChange={(e)=>handleInput(e,questionTest,i)}/>
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
        <div id="alertLoading" style={isLoading ? {visibility:'visible'} : {visibility:'hidden'}}>
            <div id="boxLoading">
                <div className="obavestenje">
                    Obaveštenje!
                </div>
                <div className="sadrzaj">
                    <p id="textAlertLoading" style={{color:'black'}}>Ucitavanje...</p>
                    <p id='textAlertLoading' style={{color:'black'}}>Molimo Vas sacekajte!</p>
                </div>
            </div>
        </div>
    </div>
     )
}

export default AddQuestionTest