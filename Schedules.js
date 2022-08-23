import {
    saveSchedule, 
    getCustomDoc, 
    onGetSchedules, 
    updateSchedule,
    deleteSchedule, 
    UserStatus,
    UserVerificaitonStatus,
    logOut
} from './firebase.js'

const schedulesForm = document.getElementById('schedules-form')
const schedulesContainer = document.getElementById('schedules-container')

//variable para saber si se esta editando un Schedule existente o se esta guardando uno nuevo
let editStatus = false;
let editingScheduleId ='';

window.addEventListener('DOMContentLoaded', async () => {
    UserStatus();
    UserVerificaitonStatus();
    onGetSchedules((quertySnapshot) => {
        try{
            let html ='';
    
            quertySnapshot.forEach(async doc => {
                const Schedule = doc.data();
                let BISstatus =""
                if(Schedule.BIS){
                    BISstatus = "BIS"
                }
                //const CommunityNewImage = await getCommunityNewImage(CommunityNew.storageLocation);
                //se inserta la lista de objetos de la base de datos a la pagina
                html += `
                <div class = "col-md-6">
                    <div class="card border-info mb-3">
                        <div class="card-body">
                            <div class="modal-body">
                                <span class="badge rounded-pill bg-primary">${Schedule.career}</span>
                                <span class="badge rounded-pill bg-primary">${Schedule.period}</span>
                                <span class="badge rounded-pill bg-primary">${Schedule.grade}  '${Schedule.group}' ${BISstatus}</span>
                                <img src="${Schedule.imageURL}" class ="img-fluid">
                            </div>
                            <div class="modal-footer">
                                <button class ="btn btn-info btn-edit" data-id = "${doc.id}">Editar</button>
                                <button class ="btn btn-danger btn-delete" data-id = "${doc.id}">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            
            })
            schedulesContainer.innerHTML = html;

            const btnsDelete = schedulesContainer.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', ({target: { dataset }}) => {
                    deleteSchedule(dataset.id);
                })
                
            })
            const btnsEdit = schedulesContainer.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async ({target: { dataset }}) => {
                    const doc = await getCustomDoc(dataset.id, 'Schedules');
                    const Schedule = doc.data();

                    //guardando la informacion del CommunityNew para poder editarlo
                    schedulesForm['schedule-Career'].value = Schedule.career;
                    schedulesForm['schedule-Period'].value = Schedule.period;
                    schedulesForm['schedule-Grade'].value = Schedule.grade;
                    schedulesForm['schedule-Group'].value = Schedule.group;
                    schedulesForm['schedule-ImagePreviews'].src = Schedule.imageURL
                    sc
                    editStatus = true;
                    editingScheduleId = dataset.id;
                    schedulesForm['btn-schedule-save'].innerText = 'Actualizar'
                    schedulesForm['btn-schedule-save'].className = 'btn btn-primary'
                })
            })
        } catch(e){
            console.log("Error getting cached document:", e);
        }
    })
    
    let html ='';
    const d = new Date();
    const year = d.getFullYear();
    html +=`
    <option value="${year}-1">${year}-1</option>
    <option value="${year}-2">${year}-2</option>
    <option value="${year}-3">${year}-3</option>`;
    d.getFullYear();
    schedulesForm['schedule-Period'].innerHTML = html;
    
})

schedulesForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //obtener la informacion del formulario
    const career = schedulesForm['schedule-Career'];
    const period = schedulesForm['schedule-Period'];
    const grade = schedulesForm['schedule-Grade'];
    const group = schedulesForm['schedule-Group'];
    
    const image= schedulesForm['schedule-Image'];

    const BIS =  schedulesForm['checkbox-bis'].checked;
    //mandar la informacion del formulario a la base de datos
    if(editStatus){
        updateSchedule(editingScheduleId,{
            career: career.value,period: period.value,
            grade: grade.value,group: group.value, BIS,
            image: image.files[0]});
        
        schedulesForm['btn-schedule-save'].innerText = 'Guardar'
        schedulesForm['btn-schedule-save'].className = 'btn btn-success'
        editStatus = false;
    }else{
        saveSchedule(career.value,period.value,
            grade.value,group.value, BIS,
            image.files[0]);
    }
    
    schedulesForm['schedule-ImagePreviews'].src = ''
    schedulesForm.reset();
})
schedulesForm['schedule-Image'].addEventListener('change',(e) =>{
    e.preventDefault();
    const image= schedulesForm['schedule-Image'].files[0];
    if(image){
        const reader = new FileReader();
        reader.onload = function(){
            const result = reader.result;
            schedulesForm['schedule-ImagePreviews'].src = result;
        }
        reader.readAsDataURL(image);
    }
})
const btnLogout = document.getElementById('logout');
btnLogout.addEventListener('click',(e) =>{
    e.preventDefault();
    logOut();
})