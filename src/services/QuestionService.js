import { axiosPrivate } from '../api/axios';

export const createQuestion = async(question)=>{
    try{
        const response = await axiosPrivate.post('http://localhost:8765/api/questions-service/questions', question);
        return response.data;
    }catch(err){
        console.error("Error creating question: " + err);
        throw err;
    }
}

export const updateQuestion = async(question)=>{
    try{
        const response = await axiosPrivate.put('http://localhost:8765/api/questions-service/questions',question);
        return response.data;
    }catch(err){
        console.error("Error updating question: " + err);
        throw err;
    }
}

export const deleteQuestion = async(questionId)=>{
    try{
        const response = await axiosPrivate.delete(`http://localhost:8765/api/questions-service/questions/${questionId}`);
        return response.data;
      }catch(err){
        console.error("Error deleting question: " + err);
        throw err
      }
}

export const getQuestions = async(controller)=>{
    try{
        const response = await axiosPrivate.get('http://localhost:8765/api/questions-service/questions',{signal : controller.signal});
        return response.data;
    }catch(err){
        console.error("Error with retrieving questions: " + err);
        throw err;
    }
}

export const getQuestion = async(questionId)=>{
    try{
        const response = await axiosPrivate.get(`http://localhost:8765/api/questions-service/questions/${questionId}`);
        return response.data;
    }catch(err){
        console.error("Error with retrieving question: " + err);
        throw err;
    }
}

export const getTestsFromQuestion = async(questionId)=>{
    try{
        if(questionId!==undefined && questionId!==0){
            const response = await axiosPrivate.get(`http://localhost:8765/api/test-service/tests/questions/${questionId}/tests`);
            return response.data;
        }else{
            throw new Error("Did not provide id of question");
        }
    }catch(err){
        console.error("Error with retrieving tests from question: " + err);
        throw err;
    }
}

export const deleteTestsFromQuestion = async(removeTests,questionId)=>{
    try{
      console.log(removeTests);
      for(let i=0;i<removeTests.length;i++){
        const response = await axiosPrivate.delete(`http://localhost:8765/api/test-service/tests/${removeTests[i].questionTestPK.testId}/questions/${questionId}`);
        console.log(response.data);
      }
    }catch(err){
      console.log("Error with deleting tests from question: " + err);
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
            const response = await axiosPrivate.post("http://localhost:8765/api/questions-service/questions/answers", answer);
            console.log(response.data);
        }
    }catch(err){
        console.error("Error with saving answers: " + err);
        throw err;
    }
}

export const getAnswers = async(questionId)=>{
    try{
        const response = await axiosPrivate.get(`http://localhost:8765/api/questions-service/questions/${questionId}/answers`);
        return response.data;
    }catch(err){
        console.error("Error with retrieving answers: " + err);
        throw err;
    }
}

export const deleteAnswersFromQuestion = async(removeAnswers,questionId)=>{
    try{
      console.log(removeAnswers);
      for(let i=0;i<removeAnswers.length;i++){
        const response = await axiosPrivate.delete(`http://localhost:8765/api/questions-service/questions/${questionId}/answers/${removeAnswers[i].answerPK.answerId}`);
        console.log(response);
      }
    }catch(err){
      console.log("Error with deleting answers from question: " + err);
      throw err;
    }
}