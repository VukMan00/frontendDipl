import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const AddQuestionTest = ({getArrayQuestionTest}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const questionsForPoints = location.state?.questionsForPoints;
    
    const[arrayQuestionTest,setArrayQuestionTest] = useState([]);

    function handleInput(e,question,i){
        if(e.target.value>0 && e.target.value<100){
            const questionPoints={
                "questionId":question.id,
                "content":question.content,
                "points":e.target.value!==undefined ? e.target.value : 0
            }
            arrayQuestionTest[i] = questionPoints;
            setArrayQuestionTest(arrayQuestionTest);
        }
        else{
            arrayQuestionTest[i] = null;
        }
        console.log(arrayQuestionTest);
    }

    const addQuestionTest = async(e)=>{
        e.preventDefault();
        console.log(arrayQuestionTest);
        getArrayQuestionTest(arrayQuestionTest);
        navigate(-1);
    }

    function cancel(e){
        e.preventDefault();
        navigate(-1);
      }

    return (
    <div className='create-div'>
        <form className='create-form' onSubmit={addQuestionTest}>
            {questionsForPoints?.length
            ? (
            <>
              {questionsForPoints.map((question,i)=>
              <div>
                {question?.content}
                <input key={question?.id} name='points' placeholder='Unesite broj poena pitanja' style={{marginLeft:'10px'}} onChange={(e)=>handleInput(e,question,i)}/>
              </div>
              )}
            </>
            )
            :
            <h1>Niste izabrali pitanja</h1>
        }
        <div className='button'>
            <input type="submit" name="saveTest" id="btn-save" value="Sacuvaj"/>
            <button id="cancel" onClick={(e)=>cancel(e)}>Otkazi</button>
        </div>
        </form>
    </div>
     )
}

export default AddQuestionTest