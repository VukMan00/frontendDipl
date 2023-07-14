import { axiosPrivate } from '../api/axios';

export const getExams = async(controller)=>{
    try{
        const response = await axiosPrivate.get('/exams',{signal : controller.signal});
        return response.data;
      }catch(err){
        console.error("Error with retrieving exam: " + err);
        throw err;
      }
}

export const getExam = async(examId)=>{
  try{
      if(examId!==undefined && examId!==0){
          const response = await axiosPrivate.get(`/exams/${examId}`);
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
      const response = await axiosPrivate.post('/exams',exam);
      return response.data;
    }catch(err){
      console.error("Error creating exam: " + err);
      throw err;
    }
}

export const updateExam = async(exam)=>{
  try{
      const response = await axiosPrivate.put('/exams',exam);
      return response.data;
    }catch(err){
      console.error("Error updating exam: " + err);
      throw err;
    }
}

export const deleteExam = async(examId)=>{
  try{
      const response = await axiosPrivate.delete(`/exams/${examId}`);
      return response.data;
    }catch(err){
      console.error("Error deleting exam: " + err);
      throw err
    }
}

export const getStudentsOfExam = async(examId)=>{
  try{
      const response = await axiosPrivate.get(`/exams/${examId}/students`);
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
        const response = await axiosPrivate.post("/students/results",resultExam);
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
      const response = await axiosPrivate.delete(`/exams/${examId}/students/${removeStudents[i].id}`);
      console.log(response.data);
    }
  }catch(err){
    console.log("Error with deleting exam from students: " + err);
    throw err;
  }
}
