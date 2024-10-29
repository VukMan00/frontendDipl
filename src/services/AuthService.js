import axios, { axiosPrivate } from '../api/axios';

export const authenticate = async(memberData)=>{
    try{
        const response = await axios.post("http://localhost:8000/api/auth-service/auth/authenticate",memberData);
            if(response.data!=null){
                memberData.firstname = response.data.firstname;
                memberData.lastname = response.data.lastname;
                memberData.username = response.data.email;
                memberData.role = response.data.role;
                memberData.index = response.data.index !=null ? response.data.index : null;

                window.localStorage.setItem("id",response.data?.id);
                window.localStorage.setItem("firstname",memberData.firstname);
                window.localStorage.setItem("lastname",memberData.lastname);
                window.localStorage.setItem("username",memberData.username);
                window.localStorage.setItem("role",memberData.role);
                window.localStorage.setItem("index",memberData.index!=null ? memberData.index : null);
                window.localStorage.setItem('accessToken',response?.data?.accessToken);
                const accessToken = response?.data?.accessToken;
                const roles = response?.data?.role;
                
                memberData.accessToken = accessToken;
                memberData.roles = roles;

                return memberData;
            }
            else{
                return null;
            }
      }catch(err){
        console.error("Error authenticating member: " + err);
        throw err;
      }
}

export const emailForPassowrd = async(email)=>{
    try{
        const response = await axiosPrivate.post("http://localhost:8000/api/auth-service/email/emailChangePassword",email);
        return response.data;
      }catch(err){
        console.error("Error with sending email for password: " + err);
        throw err;
      }
}

export const changePassword = async(reqPassword)=>{
    try{
        console.log(reqPassword);
        const response = await axiosPrivate.post("http://localhost:8000/api/auth-service/auth/changePassword",reqPassword);
        return response;
    }catch(err){
        console.error("Error with changing password: " + err);
        throw err;
    }
}

export const emailPreRegister = async(email)=>{
    try{
        const response = await axios.post("http://localhost:8000/api/auth-service/email/preRegister",email);
        return response;
    }catch(err){
        console.error("Error with sending email for pre registration: " + err);
        throw err;
    }
}

export const checkEmail = async(email)=>{
    try{
        const response = await axios.post("http://localhost:8000/api/auth-service/email/forgottenEmail",email);
        return response;
    }catch(err){
        console.error("Error checking email: " + err);
        throw err;
    }
}

export const register = async(registerData)=>{
    try{
        const response = await axios.post("http://localhost:8000/api/auth-service/auth/register",registerData);
        return response.data;
    }catch(err){
        console.error("Error with registration: " + err);
        throw err;
    }
}

export const logOut = async()=>{
    try{
        const response = await axiosPrivate.post('http://localhost:8000/api/auth-service/auth/logout');
        return response;
    }catch(err){
        console.error("Error with registration: " + err);
        throw err;
    }
}