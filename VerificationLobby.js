import {
    VerifyEmail,
    UserStatus,
    logOut
} from './firebase.js'
const sendVerification = document.getElementById('btn-email-verification')

window.addEventListener('DOMContentLoaded', async() => {
    UserStatus();
})
sendVerification.addEventListener('click', (e)=>{
    try{
        e.preventDefault();
        VerifyEmail();
    }catch(err){
        console.log("Error getting cached document:", err);
    }
})
const btnLogout = document.getElementById('logout');
btnLogout.addEventListener('click',(e) =>{
    e.preventDefault();
    logOut();
})