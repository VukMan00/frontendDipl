import { axiosPrivate } from '../api/axios';


export const getStudents = async(controller)=>{
    try{
        const response = await axiosPrivate.get('http://localhost:8500/api/student-service/students',{signal : controller.signal});
        return response.data;

      }catch(err){
        console.error("Error with retrieving students: " + err);
        throw err;
      }
}

export const getStudent = async(studentId)=>{
    try{
        if(studentId!==undefined && studentId!==0){
            const response = await axiosPrivate.get(`http://localhost:8500/api/student-service/students/${studentId}`);
            return response.data;
        }else{
            throw new Error("Did not provide id of student");
        }
      }catch(err){
        console.error("Error with retrieving student: " + err);
        throw err;
      }
}

export const createStudent = async(student)=>{
    try{
        const response = await axiosPrivate.post('http://localhost:8500/api/student-service/students',student);
        return response.data;
      }catch(err){
        console.error("Error creating student: " + err);
        throw err;
      }
}

export const updateStudent = async(student)=>{
    try{
        const response = await axiosPrivate.put('http://localhost:8500/api/student-service/students',student);
        return response.data;
      }catch(err){
        console.error("Error updating student: " + err);
        throw err;
      }
}

export const deleteStudent = async(studentId)=>{
    try{
        const response = await axiosPrivate.delete(`http://localhost:8500/api/student-service/students/${studentId}`);
        return response.data;
      }catch(err){
        console.error("Error deleting student: " + err);
        throw err
      }
}

export const saveResultExam = async(selectedExams,studentId)=>{
    try{
        for(let i=0;i<selectedExams.length;i++){
          const resultExam = {
            "resultExamPK":{
              "studentId":studentId,
              "examId":selectedExams[i]
            },
            "points":0,
            "grade":5
          }
          const response = await axiosPrivate.post("http://localhost:8400/api/exam-service/exams/results",resultExam);
          console.log(response);
        }
    }catch(err){
      console.error("Error saving result exam: " + err);
      throw err;
    }
}

export const getResults = async(studentId,controller)=>{
  try{
      const response = await axiosPrivate.get(`http://localhost:8400/api/exam-service/exams/students/${studentId}/results`,{signal : controller.signal});
      return response.data;
  }catch(err){
    console.error("Error with retrieveng results of students: " + err);
    throw err;
  }
}

export const getExamsOfStudent = async(studentId)=>{
    try{
        const response = await axiosPrivate.get(`http://localhost:8400/api/exam-service/exams/students/${studentId}/exams`);
        return response.data;
    }catch(err){
      console.error("Error with retrieveng exams of student: " + err);
      throw err;
    }
}

export const deleteStudentFromExams = async(removeExams,studentId)=>{
    try{
      console.log(removeExams);
      for(let i=0;i<removeExams.length;i++){
        const response = await axiosPrivate.delete(`http://localhost:8400/api/exam-service/exams/${removeExams[i].id}/students/${studentId}`);
        console.log(response.data);
      }
    }catch(err){
      console.log("Error with deleting student from exams: " + err);
      throw err;
    }
}

export const deleteStudentFromExam = async(examId,studentId)=>{
  try{
      const response = await axiosPrivate.delete(`http://localhost:8400/api/exam-service/exams/${examId}/students/${studentId}`);
      console.log(response.data);
  }catch(err){
    console.log("Error with deleting student from exams: " + err);
    throw err;
  }
}

