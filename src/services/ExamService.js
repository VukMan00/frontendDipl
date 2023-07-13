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

export const createExam = async(exam)=>{
  try{
      const response = await axiosPrivate.post('/exams',exam);
      return response.data;
    }catch(err){
      console.error("Error creating exam: " + err);
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
