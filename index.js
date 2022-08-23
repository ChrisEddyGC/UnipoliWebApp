import {
    signIn
} from './firebase.js'

const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', (e) =>{
    try {
        e.preventDefault();
        //obtener la informacion del formulario
        const email= loginForm['email'];
        const password= loginForm['password'];
        //mandar la informacion del formulario a la base de datos
        signIn(email.value,password.value)
        loginForm.reset();
        
    } catch(err){
        console.log("Error getting cached document:", err);
    }
})