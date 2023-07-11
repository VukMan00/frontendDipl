export const validationStudent = async(e,firstnameErr,lastnameErr,indexErr,emailErr,birthErr)=>{
    if(e.response.data.message.name !== undefined){
        firstnameErr.style.visibility = 'visible';
        firstnameErr.value = e.response.data.message.name;
    }
    else{
        firstnameErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.lastname !== undefined){
        lastnameErr.style.visibility = 'visible';
        lastnameErr.value = e.response.data.message.lastname;
    }
    else{
       lastnameErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.index !== undefined){
        indexErr.style.visibility = 'visible';
        indexErr.value = e.response.data.message.index;
    }
    else{
        indexErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.email!==undefined){
        emailErr.style.visibility = 'visible';
        emailErr.value = e.response.data.message.email;
    }
    else{
        emailErr.style.visibility='hidden';
    }
    if(e.response.data.message.birth!==undefined){
        birthErr.style.visibility = 'visible';
        birthErr.value = e.response.data.message.birth;
    }
    else{
       birthErr.style.visibility = 'hidden';
    }
}

export const validationChangingPassword = async(e,oldPasswordErr,newPasswordErr)=>{
    if(e.response.data.message.oldPassword!==undefined){
        oldPasswordErr.value = e.response.data.message.oldPassword;
        oldPasswordErr.style.visibility = 'visible';
    }
    else{
        oldPasswordErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.newPassword!==undefined){
        newPasswordErr.value = e.response.data.message.newPassword;
        newPasswordErr.style.visibility = 'visible';
    }
    else{
        newPasswordErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.error!==undefined){
        oldPasswordErr.value = "Pogresna stara lozinka"
        oldPasswordErr.style.visibility = 'visible';
    }
    else{
        oldPasswordErr.style.visibility = 'hidden';
    }
}

export const validationRegistration = async(e,firstnameErr,lastnameErr,passwordErr,indexErr,birthErr,registrationTokenErr)=>{
    if(e.response.data.message.firstname !== undefined){
        firstnameErr.style.visibility = 'visible';
        firstnameErr.value = e.response.data.message.firstname;
    }
    else{
        firstnameErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.lastname !== undefined){
        lastnameErr.style.visibility = 'visible';
        lastnameErr.value = e.response.data.message.lastname;
    }
    else{
        lastnameErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.password !== undefined){
        passwordErr.style.visibility = 'visible';
        passwordErr.value = e.response.data.message.password;
    }
    else{
        passwordErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.index !== undefined){
        indexErr.style.visibility = 'visible';
        indexErr.value = e.response.data.message.index;
    }
    else{
        indexErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.birth!==undefined){
        birthErr.style.visibility = 'visible';
        birthErr.value = e.response.data.message.birth;
    }
    else{
        birthErr.style.visibility = 'hidden';
    }
    if(e.response.data.message.registrationToken!==undefined){
        registrationTokenErr.style.visibility = 'visible';
        registrationTokenErr.value = e.response.data.message.registrationToken;
    }
    else{
        registrationTokenErr.style.visibility = 'hidden';
    }
}

export const validationTest = async(e,contentErr)=>{
    if(e.response.data.message.content!==undefined){
        contentErr.style.visibility = 'visible';
        contentErr.value = e.response.data.message.content;
      }
      else{
        contentErr.style.visibility='hidden';
      }
}