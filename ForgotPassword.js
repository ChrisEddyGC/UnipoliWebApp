import {
    ResetPassword
} from './firebase.js'
const resetPasswordForm = document.getElementById('ResetPassword-form')

resetPasswordForm.addEventListener('submit', (e)=>{
    try{
        e.preventDefault();
        const email = resetPasswordForm['email'];
        ResetPassword(email.value);
    }catch(err){
        console.log("Error getting cached document:", err);
    }
})