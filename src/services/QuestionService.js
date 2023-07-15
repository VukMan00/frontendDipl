import { axiosPrivate } from '../api/axios';

export const createQuestion = async(question)=>{
    try{
        const response = await axiosPrivate.post('/questions',question);
        return response.data;
    }catch(err){
        console.error("Error creating question: " + err);
        throw err;
    }
}

export const getQuestions = async(controller)=>{
    try{
        const response = await axiosPrivate.get('/questions',{signal : controller.signal});
        return response.data;
    }catch(err){
        console.error("Error with retrieving questions: " + err);
        throw err;
    }
}

export const saveAnswers = async(answers,questionId)=>{
    try{
        for(let i=0;i<answers.length;i++){
            const answer = {
                "answerPK":{
                    "questionId":questionId
                },
                "content":answers[i].content,
                "solution":answers[i].solution
            }
            const response = await axiosPrivate.post("/answers",answer);
            console.log(response.data);
        }
    }catch(err){
        console.error("Error with saving answers: " + err);
        throw err;
    }
}