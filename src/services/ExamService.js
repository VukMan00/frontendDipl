import { axiosPrivate } from '../api/axios';

export const getExams = async(controller)=>{
    try{
        const response = await axiosPrivate.get('http://localhost:8765/api/exam-service/exams',{signal : controller.signal});
        return response.data;
      }catch(err){
        console.error("Error with retrieving exam: " + err);
        throw err;
      }
}

export const getExam = async(examId)=>{
  try{
      if(examId!==undefined && examId!==0){
          const response = await axiosPrivate.get(`http://localhost:8765/api/exam-service/exams/${examId}`);
          return response.data;
      }else{
          throw new Error("Did not provide id of exam");
      }
  }catch(err){
      console.error("Error with retrieving exam: " + err);
      throw err;
  }
}

export const createExam = async(exam)=>{
  try{
      const response = await axiosPrivate.post('http://localhost:8765/api/exam-service/exams',exam);
      return response.data;
    }catch(err){
      console.error("Error creating exam: " + err);
      throw err;
    }
}

export const updateExam = async(exam)=>{
  try{
      console.log(exam)
      const response = await axiosPrivate.put('http://localhost:8765/api/exam-service/exams',exam);
      return response.data;
    }catch(err){
      console.error("Error updating exam: " + err);
      throw err;
    }
}

export const deleteExam = async(examId)=>{
  try{
      const response = await axiosPrivate.delete(`http://localhost:8765/api/exam-service/exams/${examId}`);
      return response.data;
    }catch(err){
      console.error("Error deleting exam: " + err);
      throw err
    }
}

export const getStudentsOfExam = async(examId)=>{
  try{
      const response = await axiosPrivate.get(`http://localhost:8765/api/exam-service/exams/${examId}/students`);
      return response.data;
  }catch(err){
    console.error("Error with retrieveng students of exam: " + err);
    throw err;
  }
}

export const saveResultExam = async(selectedStudents,examId)=>{
  try{
      for(let i=0;i<selectedStudents.length;i++){
        const resultExam = {
          "resultExamPK":{
            "studentId":selectedStudents[i],
            "examId":examId
          },
          "points":0,
          "grade":5
        }
        const response = await axiosPrivate.post("http://localhost:8765/api/exam-service/exams/results",resultExam);
        console.log(response);
      }
    }catch(err){
      console.error("Error saving students to exam: " + err);
      throw err;
    }
}

export const deleteExamsFromStudent = async(removeStudents,examId)=>{
  try{
    console.log(removeStudents);
    for(let i=0;i<removeStudents.length;i++){
      const response = await axiosPrivate.delete(`http://localhost:8765/api/exam-service/exams/${examId}/students/${removeStudents[i].id}`);
      console.log(response.data);
    }
  }catch(err){
    console.log("Error with deleting exam from students: " + err);
    throw err;
  }
}

export const getResults = async(examId,controller)=>{
  try{
      const response = await axiosPrivate.get(`http://localhost:8765/api/exam-service/exams/${examId}/results`,{signal : controller.signal});
      return response.data;
  }catch(err){
    console.error("Error with retrieveng results of exams: " + err);
    throw err;
  }
}

export const saveResults = async(results)=>{
  try{
      for(let i=0;i<results.length;i++){
        const response = await axiosPrivate.post("http://localhost:8765/api/exam-service/exams/results",results[i]);
        console.log(response);
      }
    }catch(err){
      console.error("Error saving results: " + err);
      throw err;
    }
}

export const deleteStudentFromExam = async(resultExam)=>{
  try{
    const response = await axiosPrivate.delete(`http://localhost:8765/api/exam-service/exams/${resultExam.resultExamPK.examId}/students/${resultExam.resultExamPK.studentId}`);
    console.log(response.data);
  }catch(err){
    console.log("Error with deleting student from exam: " + err);
    throw err;
  }
}
