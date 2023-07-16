import { axiosPrivate } from '../api/axios';

export const getAnswersFromQuestion = async(questonId,controller)=>{
    try{
        const response = await axiosPrivate.get(`/answers/${questonId}`,{signal : controller.signal});
        return response.data;
    }catch(err){
        console.error("Error with retrieving answers from question: " + err);
        throw err;
    }
}