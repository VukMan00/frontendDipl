import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuestionsFromTest, getTest } from '../services/TestService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ViewTest = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const testId = location.state?.testId;
    

    const[test,setTest]=useState({
        'id':0,
        'content':'',
        'author':'',
    });

    const[maxPoints,setMaxPoints]=useState(0);

    const[questionsTest,setQuestionsTest]=useState([]);

    useEffect(()=>{
        const retrieveTest = async()=>{
          try{
            const response = await getTest(testId);
            setTest(response);
          }catch(e){
            console.log(e);
          }
        }
        retrieveTest();
    },[testId])

    useEffect(()=>{
        const retrieveQuestionsFromTest = async()=>{
          try{
            const response = await getQuestionsFromTest(testId);
            setQuestionsTest(response);            
            console.log(response[0].question.answers)
            let points = 0;
            for(let i=0;i<response.length;i++){
                points = points + response[i].points;
            }
            setMaxPoints(points);

          }catch(e){
            console.log(e);
            setQuestionsTest([]);
          }
        }
        retrieveQuestionsFromTest();
    },[testId])

    const printTest = (e) => {
      e.preventDefault();
      const input = document.getElementById('printTest');
  
      const pdf = new jsPDF('p', 'mm', 'a4');

      html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        pdf.save(`${test.content}.pdf`);
        document.getElementById('textAlert').innerHTML = "Sistem je odstampao test";
        document.getElementById('alert').style.visibility = 'visible';
      })
      .catch((error) => {
        document.getElementById('textAlert').innerHTML = "Sistem ne moze da odstampa test";
        document.getElementById('alert').style.visibility = 'visible';
        console.error('Error generating PDF:', error);
      });
    }

    function potvrdi(e){
      e.preventDefault();
      document.getElementById('alert').style.visibility = 'hidden';
      if(document.getElementById('textAlert').innerHTML === "Sistem je odstampao test"){
        navigate("/tests");
      }
    }

    function cancel(e){
      e.preventDefault();
      navigate(-1);
    }
    
  return (
    <div className='viewTest'>
          <form onSubmit={printTest}>
            <div className="printTest" id="printTest">
              <p style={{fontStyle:'italic',textAlign:'end'}}>Autor: {test?.author?.name + " " + test?.author?.lastname}</p>
              <p style={{fontStyle:'italic',textAlign:'end'}}>Maksimalan broj poena: {maxPoints}</p>
              <h1>{test?.content}</h1>
              <p style={{fontStyle:'italic',textAlign:'start'}}>_ / {maxPoints}</p>
              {questionsTest?.length
              ?(
                  <div className='questionsOfTest'>
                  {questionsTest.map((questionTest,i)=>
                      <div key={i} className='questionOfTest'>
                          {(i+1) + ". " + questionTest?.question?.content}
                          {questionTest?.question?.answers?.length
                          ?(
                            <div key={questionTest.questionTestPK.questionId} className='answersOfQuestion'>
                              {questionTest?.question?.answers.map((answer,j)=>
                                <label style={{color:'black', marginBottom:'10px',marginLeft:'10px'}}  key={answer?.answerPK?.answerId}>
                                  <input type="checkbox" checked={false} readOnly/> {answer?.content}
                                </label>
                              )}
                            </div>
                          )
                          :
                          <>
                          </>
                          }
                        <div style={{textAlign:'end'}}>
                          {"_ / " + questionTest?.points}
                        </div>
                      </div> 
                  )}
                  </div>
              )
              :
                  <></>
              }
            </div>
            <div className='button'>
                <input type="submit" name="printTest" id="btn-save" value="Odstampaj test"/>
                <button id="cancel" onClick={(e)=>cancel(e)}>Otkazi</button>
            </div>
          </form>
          <div id="alert">
            <div id="box">
              <div className="obavestenje">
                  Obaveštenje!
              </div>
              <div className="sadrzaj">
                  <p id="textAlert">Sistem je odstampao test</p>
                  <button id="confirm" onClick={(e)=>potvrdi(e)}>OK</button>
              </div>
            </div>
        </div>
    </div>
  )
}

export default ViewTest
