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