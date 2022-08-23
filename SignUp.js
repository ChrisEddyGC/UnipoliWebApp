import {
    onGetDepartments,
    signUp
} from './firebase.js'

const signUpForm = document.getElementById('signup-form')
const departmentSelect = document.getElementById('department')

window.addEventListener('DOMContentLoaded', async () => {
    onGetDepartments((querySnapshot) => {
        try{
            let html = '';
            querySnapshot.forEach(async doc => {
                const Department = doc.data();
                html +=  `<option value="${doc.id}">${Department.name}</option>`;
            })
            departmentSelect.innerHTML = html;
        }catch(e){
            console.log("Error getting cached document:", e);
        }
    })
})

signUpForm.addEventListener('submit', (e)=>{
    try{
        e.preventDefault();
        const email = signUpForm['email'];
        const username = signUpForm['userName'];
        const phone = signUpForm['phone'];
        const department = signUpForm['department'];
        const jobTitle = signUpForm['jobTitle'];
        const workingHours = signUpForm['workingHours'];
        const password = signUpForm['password'];
        const passwordconfrim = signUpForm['passwordConfirm'];
        
        if(password.value == passwordconfrim.value){
            signUp(email.value,password.value,username.value,phone.value,department.value,jobTitle.value,workingHours.value);
        }
    }catch(err){
        console.log("Error getting cached document:", err);
    }
})