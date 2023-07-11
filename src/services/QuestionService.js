import { axiosPrivate } from '../api/axios';


export const getQuestions = async(controller)=>{
    try{
        const response = await axiosPrivate.get('/questions',{signal : controller.signal});
        return response.data;
    }catch(err){
        console.error("Error with retrieving questions: " + err);
        throw err;
    }
}