import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getTests } from '../services/TestService';
import { validationQuestion } from '../validation/ValidationHandler';
import { createQuestion} from '../services/QuestionService';

const CreateQuestion = ({newAnswers}) => {

    const navigate = useNavigate();
    const location = useLocation();
    
    const[question,setQuestion]=useState({
        'id':0,
        'content':'',
        'answers':''
    })

    const[questionId,setQuestionId]=useState();

    const[tests,setTests]=useState([]);
    const[questionsForPoints,setQuestionsForPoints]=useState([]);
    const[answers,setAnswers]=useState([]);

    const[selectedTests,setSelectedTests]=useState([]);
    const[selectedAnswers,setSelectedAnswers]=useState([]);

    useEffect(()=>{
        setAnswers(newAnswers);
    },[newAnswers]);

    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        const getAllTests = async()=>{
          try{
            const response = await getTests(controller);
            isMounted && setTests(response);
          }catch(err){
            localStorage.clear();
            console.error(err);
            navigate('/login',{state:{from:location},replace:true});
          }
        }
        getAllTests();
    
        return ()=>{
          isMounted = false;
          isMounted && controller.abort();
        }
    },[location,navigate])

    const saveQuestion = async(e)=>{
        e.preventDefault();
        try{
            question.answers = setAnswersForQuestion();
            const response = await createQuestion(question);
            setQuestionId(response.id);
            setAnswers([]);
            document.getElementById('textAlert').innerHTML = "Sistem je zapamtio pitanje";
            document.getElementById("alert").style.visibility='visible';
        }catch(error){
            console.log(error);
            validation(error);
        }
    }

    function setAnswersForQuestion(){
        const changedAnswers = [];
        for(let i=0;i<answers.length;i++){
            const newAnswer = {
                "answerPK":{
                    "questionId":'',
                    "answerId":''
                },
                "content":answers[i].content,
                "solution":answers[i].solution
            }
            changedAnswers.push(newAnswer);
        }
        return changedAnswers;
    }

    function handleInput(e){
        let newQuestion = question;
        newQuestion[e.target.name] = e.target.value;
        setQuestion(newQuestion);
    }

    const handleSelectTests = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedTests(selectedOptions);
        console.log(selectedTests);
        const filteredQuestionForPoints = tests.filter(test=>selectedOptions.includes(test.id.toString()));
        setQuestionsForPoints(filteredQuestionForPoints);
    };

    const handleSelectAnswers = (event)=>{
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedAnswers(selectedOptions);
    }

    const removeAnswers = (e)=>{
        e.preventDefault();
        console.log(answers);
        console.log(selectedAnswers);
        const filteredAnswers = answers.filter(answer=>!selectedAnswers.includes(answer.answerPK.answerId.toString()));
        setAnswers(filteredAnswers);
    }

    function unSelectAll(e){
        e.preventDefault();
        setSelectedTests([]);
    }

    function potvrdi(){
        document.getElementById('alert').style.visibility = 'hidden';
        if(document.getElementById("textAlert").innerHTML==="Sistem je zapamtio pitanje"){
          navigate("/questions");
        }
      }

    function cancel(e){
        e.preventDefault();
        navigate("/questions");
    }

    function validation(error){
        document.getElementById('textAlert').innerHTML = "Sistem ne moze da zapamti pitanje";
        document.getElementById('alert').style.visibility = 'visible';
        validationQuestion(error,document.getElementById('contentErr'));
      }
    
    return (
        <div className='create'>
            <div className="create-div">
                <form className="create-form" onSubmit={saveQuestion}>
                    <label htmlFor="content">Naziv</label>
                    <input type="text" name="content" placeholder='Unesite naziv pitanja' onInput={(e)=>handleInput(e)}/>
                    <input type="text" name="contentErr" id="contentErr" readOnly/>
                    <label htmlFor='answers'>Kreirani odgovori</label>
                    <select name="answers" id="selectionOption" multiple value={selectedAnswers} onChange={(e)=>handleSelectAnswers(e)}>
                    {answers?.length
                    ? (
                        <>
                        {answers.map((a,i)=>
                        <option key={i} value={a?.answerPK?.answerId}>{a?.content}</option>
                        )}
                        </>
                    )
                    :
                    <option style={{color:'red'}}>Niste ubacili odgovore</option>
                    }
                    </select>
                    <div className='button'>
                        <Link id='btn-add-answer' to={"addAnswer"} state={{answers:answers}}>Ubaci odgovor</Link>
                        <button id="btn-remove-answer" onClick={(e)=>removeAnswers(e)}>Izbaci odgovor</button>
                    </div>
                    <label htmlFor="questions">Ubacite pitanje u testove:</label>
                    <select name="questions" id="selectionOption" multiple value={selectedTests} onChange={(e)=>handleSelectTests(e)}>
                    {tests?.length
                    ? (
                        <>
                        {tests.map((test,i)=>
                        <option key={i} value={test.id}>{test.content}</option>
                        )}
                        </>
                    )
                    :
                    <option style={{color:'red'}}>Sistem ne moze da ucita testove</option>
                    }
                    </select>
                    <button id="btn-unselectAll" onClick={(e) => unSelectAll(e)}>Ponisti izbor testova</button>
                    <div className='button'>
                        <input type="submit" name="saveQuestion" id="btn-save" value="Sacuvaj"/>
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
                        <p id="textAlert">Sistem je zapamtio pitanje</p>
                        {questionsForPoints.length!==0 ? (
                        <div className="btn-confirm">
                            <Link id="link-add-question-test" to={questionId!==0 && questionId!==undefined && questionsForPoints.length!==0 ? "addQuestionTest" : ""} state={{questionsForPoints:questionsForPoints,questionId:questionId}} onClick={()=>potvrdi()}>Ubaci pitanje u testove</Link>
                            <button id="btn-save-question" onClick={(e)=>potvrdi(e)}>OK</button>
                        </div>
                        ):
                        (
                        <div className="btn-confirm">
                            <button id="btn-save-question" onClick={(e)=>potvrdi(e)}>OK</button>
                        </div> 
                        )
                        }
                    </div> 
                </div>
            </div>
            <Outlet />
        </div>
    ) 
}

export default CreateQuestion
