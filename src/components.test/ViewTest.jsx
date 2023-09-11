import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getQuestionsFromTest, getTest } from '../services/TestService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ViewTest = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const testId = location.state?.testId;
    const [isLoading, setIsLoading] = useState(false);

    const[test,setTest]=useState({
        'id':0,
        'content':'',
        'author':'',
    });

    const[maxPoints,setMaxPoints]=useState(0);

    const[questionsTest,setQuestionsTest]=useState([]);

    useEffect(()=>{
        const retrieveTest = async()=>{
          setIsLoading(true);
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
            setIsLoading(false);

          }catch(e){
            console.log(e);
            setQuestionsTest([]);
            setIsLoading(false);
          }
        }
        retrieveQuestionsFromTest();
    },[testId])

    const printTest = (e) => {
      e.preventDefault();
      setIsLoading(true);
      const input = document.getElementById('printTest');
  
      const pdf = new jsPDF('p', 'mm', 'a4');

      html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        pdf.save(`${test.content}.pdf`);
        setIsLoading(false);
        document.getElementById('textAlert').innerHTML = "Sistem je odstampao test";
        document.getElementById('alert').style.visibility = 'visible';
      })
      .catch((error) => {
        setIsLoading(false);
        document.getElementById('textAlert').innerHTML = "Sistem ne moze da odstampa test";
        document.getElementById('alert').style.visibility = 'visible';
        console.error('Error generating PDF:', error);
      });
    }

    function potvrdi(e){
      e.preventDefault();
      document.getElementById('alert').style.visibility = 'hidden';
      if(document.getElementById('textAlert').innerHTML === "Sistem je odstampao test"){
        clearCheckBoxes();
        navigate("/tests");
      }
    }

    function potvrdiNotFound(e){
      e.preventDefault();
      document.getElementById('alertWrong').style.visibility = 'hidden';
      clearCheckBoxes();
      navigate('/tests');
    }

    function cancel(e){
      e.preventDefault();
      clearCheckBoxes();
      navigate('/tests');
    }

    function clearCheckBoxes(){
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(function(checkbox) {
          checkbox.checked = false;
      });
    }
  
  if(testId!==undefined && testId!==0){
    return (
      <div className='viewTest'>
            <form onSubmit={printTest}>
              <div className="printTest" id="printTest">
                <p style={{fontStyle:'italic',textAlign:'end'}}>Autor: {test?.author?.name + " " + test?.author?.lastname}</p>
                <p style={{fontStyle:'italic',textAlign:'end'}}>Maksimalan broj poena: {maxPoints}</p>
                <div style={{display:'flex',flexDirection:'row'}}>
                  <p>Ime i Prezime: _________________________________________</p>
                  <p>Broj indeksa: ______/___</p>
                </div>
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
    return (
      <div id="alertWrong">
        <div id="box">
            <div className="obavestenje">
              Obaveštenje!
            </div>
            <div className="sadrzaj">
              <p id="textAlert">Sistem ne moze da ucita test</p>
              <button id="confirm" onClick={(e)=>potvrdiNotFound(e)}>OK</button>
            </div>
        </div>
      </div>
    )
  }
}

export default ViewTest
