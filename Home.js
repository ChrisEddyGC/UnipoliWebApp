import {
    onGetDepartments,
    getUserInfo,
    getCustomDoc,
    UserStatus,
    UserVerificaitonStatus,
    updateUserInfo,
    logOut
} from './firebase.js'

const userinfoContainer = document.getElementById('user-info')
const departmentSelect = document.getElementById('department')
const userinfoForm = document.getElementById('update-form')

window.addEventListener('DOMContentLoaded', async() => {
    UserStatus();
    UserVerificaitonStatus();
    document.getElementById("userInfo-form").style.display = 'none';

    const userinfo = await getUserInfo('UniversityStaff');
    const userProfile = userinfo.data();
    let html ='';
    html+=`
    <h5><b>Usuario:</b>${userProfile.userName}</h5>
    <h5><b>Correo institucional:</b>${userProfile.email}</h5>
    <h5><b>Telefono:</b>${userProfile.phone}</h5>`;
    if(userProfile.department){
        const userDep = await getCustomDoc(userProfile.department, 'Departments');
        const userDepData = userDep.data();
        html+=`<h5><b>Departamento:</b>${userDepData.name}</h5>`;
    }else{
        html+=`<h5><b>Departamento:</b>No asignado</h5>`;
    }
    html+=`<h5><b>Puesto:</b>${userProfile.jobTitle}</h5>
    <h5><b>Horario:</b>${userProfile.workingHours}</h5>`;

    userinfoContainer.innerHTML = html;

    userinfoForm['userName'].value = userProfile.userName;
    userinfoForm['phone'].value = userProfile.phone;
    userinfoForm['department'].value = userProfile.department;
    userinfoForm['jobTitle'].value = userProfile.jobTitle;
    userinfoForm['workingHours'].value = userProfile.workingHours;

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

const btnUpdate = document.getElementById('btn-openUpdateForm')
btnUpdate.addEventListener('click',(e) =>{
    e.preventDefault();
    document.getElementById("userInfo-form").style.display = 'block';
    document.getElementById("userInfo-container").style.display = 'none';
})
const btnHide = document.getElementById('btn-closeUpdateForm')
btnHide.addEventListener('click',(e) =>{
    e.preventDefault();
    document.getElementById("userInfo-form").style.display = 'none';
    document.getElementById("userInfo-container").style.display = 'block';
})


const btnLogout = document.getElementById('logout');
btnLogout.addEventListener('click',(e) =>{
    e.preventDefault();
    logOut();
})

userinfoForm.addEventListener('submit', (e)=>{
    try{
        e.preventDefault();
        const username = userinfoForm['userName'];
        const phone = userinfoForm['phone'];
        const department = userinfoForm['department'];
        const jobTitle = userinfoForm['jobTitle'];
        const workingHours = userinfoForm['workingHours'];
        const email = userinfoForm['email'];

        if(email.value != null){
            updateUserInfo(email.value,username.value,phone.value,department.value,jobTitle.value,workingHours.value)
            .then(()=>{
              document.location.reload(true);
            });
        }
        
    }catch(err){
        console.log("Error getting cached document:", err);
    }
})