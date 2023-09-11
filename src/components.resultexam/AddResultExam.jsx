import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getStudents } from '../services/StudentService';
import { saveResultExam } from '../services/ExamService';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const AddResultExam = () => {

    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const examId = location.state?.examId;

    const[students,setStudents]=useState([]);
    const[selectedStudents,setSelectedStudents]=useState([]);

    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
        setIsLoading(true);
        const getAllStudents = async()=>{
          try{
            const response = await getStudents(controller);
            isMounted && setStudents(response);
          }catch(err){
            localStorage.clear();
            console.error(err);
            navigate('/login',{state:{from:location},replace:true});
          }
          finally{
            setIsLoading(false);
          }
        }
        getAllStudents();
    
        return ()=>{
          isMounted = false;
          isMounted && controller.abort();
        }
    },[axiosPrivate,location,navigate])

    const addStudents = async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        try{
            await saveResultExam(selectedStudents,examId);
            navigate(-1);
        }catch(err){
            console.log(err);
        }finally{
          setIsLoading(false);
        }
    }

    const handleSelectStudents = (event)=>{
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedStudents(selectedOptions);
    }

    function cancel(e){
        e.preventDefault();
        navigate(-1);
    }

  return (
    <div className='create'>
      <div className="create-div">
        <form className="create-form" onSubmit={addStudents}>
          <label htmlFor="students">Dostupni studenti</label>
          <select name="students" id="selectionOption" multiple value={selectedStudents} onChange={(e)=>handleSelectStudents(e)}>
          {students?.length
          ? (
            <>
              {students.map((student,i)=>
              <option key={i} value={student.id} style={{fontFamily:'cursive'}}>{student.name + " " + student.lastname + " " + student.index}</option>
              )}
            </>
            )
            :
            <option style={{color:'red'}}>Sistem ne moze da ucita studente</option>
          }
        </select>
        <div className='button'>
            <input type="submit" name="saveStudent" id="btn-save" value="Sacuvaj"/>
            <button id="cancel" onClick={(e)=>cancel(e)}>Otkazi</button>
        </div>
        </form>
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

export default AddResultExam
