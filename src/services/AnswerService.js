import { axiosPrivate } from '../api/axios';

export const createAnswer = async(answer)=>{
    try{
        const response = await axiosPrivate.post('/answers',answer);
        return response.data;
    }catch(err){
        console.error("Error creating answer: " + err);
        throw err;
    }
}

export const updateAnswer = async(answer)=>{
    try{
        const response = await axiosPrivate.put('/answers',answer);
        return response.data;
    }catch(err){
        console.error("Error updating answer: " + err);
        throw err;
    }
}

export const deleteAnswer = async(answerId,questionId)=>{
    try{
        const response = await axiosPrivate.delete(`answers/${answerId}/question/${questionId}`);
        return response.data;
    }catch(err){
        console.error("Error deleting answer: " + err);
        throw err;
    }
}

export const getAnswer = async(answerId,questionId)=>{
    try{
        const response = await axiosPrivate.get(`/answers/${answerId}/question/${questionId}`);
        return response.data;
    }catch(err){
        console.error("Error retrieving answer: " + err);
        throw err;
    }
}

export const getAnswersFromQuestion = async(questonId,controller)=>{
    try{
        const response = await axiosPrivate.get(`/answers/${questonId}`,{signal : controller.signal});
        return response.data;
    }catch(err){
        console.error("Error with retrieving answers from question: " + err);
        throw err;
    }
}