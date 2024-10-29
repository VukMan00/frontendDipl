import { axiosPrivate } from '../api/axios';

export const createAnswer = async(answer)=>{
    try{
        const response = await axiosPrivate.post('http://localhost:8100/api/questions-service/questions/answers',answer);
        return response.data;
    }catch(err){
        console.error("Error creating answer: " + err);
        throw err;
    }
}

export const updateAnswer = async(answer)=>{
    try{
        const response = await axiosPrivate.put('http://localhost:8100/api/questions-service/questions/answers',answer);
        return response.data;
    }catch(err){
        console.error("Error updating answer: " + err);
        throw err;
    }
}

export const deleteAnswer = async(answerId,questionId)=>{
    try{
        const response = await axiosPrivate.delete(`http://localhost:8100/api/questions-service/questions/${questionId}/answers/${answerId}`);
        return response.data;
    }catch(err){
        console.error("Error deleting answer: " + err);
        throw err;
    }
}

export const getAnswer = async(answerId,questionId)=>{
    try{
        const response = await axiosPrivate.get(`http://localhost:8100/api/questions-service/questions/${questionId}/answers/${answerId}`);
        return response.data;
    }catch(err){
        console.error("Error retrieving answer: " + err);
        throw err;
    }
}

export const getAnswersFromQuestion = async(questionId,controller)=>{
    try{
        const response = await axiosPrivate.get(`http://localhost:8100/api/questions-service/questions/${questionId}/answers`,{signal : controller.signal});
        return response.data;
    }catch(err){
        console.error("Error with retrieving answers from question: " + err);
        throw err;
    }
}