import { axiosPrivate } from '../api/axios';

export const getTests = async(controller)=>{
    try{
        const response = await axiosPrivate.get('http://localhost:8300/api/test-service/tests',{signal : controller.signal});
        return response.data;
    }catch(err){
        console.error("Error with retrieving tests: " + err);
        throw err;
    }
}

export const getTest = async(testId)=>{
    try{
        if(testId!==undefined && testId!==0){
            const response = await axiosPrivate.get(`http://localhost:8300/api/test-service/tests/${testId}`);
            return response.data;
        }else{
            throw new Error("Did not provide id of test");
        }
    }catch(err){
        console.error("Error with retrieving test: " + err);
        throw err;
    }
}

export const createTest = async(test)=>{
    try{
        const response = await axiosPrivate.post('http://localhost:8300/api/test-service/tests',test);
        return response.data;
    }catch(err){
        console.error("Error creating test: " + err);
        throw err;
    }
}

export const updateTest = async(test)=>{
    try{
        const response = await axiosPrivate.put('http://localhost:8300/api/test-service/tests',test);
        return response.data;
    }catch(err){
        console.error("Error updating test: " + err);
        throw err;
    }
}

export const deleteTest = async(testId)=>{
    try{
        const response = await axiosPrivate.delete(`http://localhost:8300/api/test-service/tests/${testId}`);
        return response.data;
    }catch(err){
        console.error("Error deleting test: " + err);
        throw err;
    }
}

export const saveQuestionTest = async(arrayQuestionTest)=>{
    try{
        for(let i=0;i<arrayQuestionTest.length;i++){
            if(arrayQuestionTest[i]!==null){
                const questionTest = {
                "questionTestPK":{
                    "questionId":arrayQuestionTest[i]?.questionTestPK?.questionId,
                    "testId":arrayQuestionTest[i]?.questionTestPK?.testId
                },
                "points":arrayQuestionTest[i].points
                }
                await axiosPrivate.post("http://localhost:8300/api/test-service/tests/questions",questionTest);
            }
        }
      }catch(err){
        console.error("Error saving questionTest: " + err);
        throw err;
      }
}

export const getQuestionsFromTest = async(testId)=>{
    try{
        if(testId!==undefined && testId!==0){
            const response = await axiosPrivate.get(`http://localhost:8300/api/test-service/tests/${testId}/questions`);
            return response.data;
        }else{
            throw new Error("Did not provide id of test");
        }
    }catch(err){
        console.error("Error with retrieving questions from test: " + err);
        throw err;
    }
}

export const deleteQuestionsFromTest = async(removeQuestions,testId)=>{
    try{
      console.log(removeQuestions);
      for(let i=0;i<removeQuestions.length;i++){
        const response = await axiosPrivate.delete(`http://localhost:8300/api/test-service/tests/${testId}/questions/${removeQuestions[i].questionTestPK.questionId}`);
        console.log(response.data);
      }
    }catch(err){
      console.log("Error with deleting questions from test: " + err);
      throw err;
    }
}
