import {
    saveAgenda,
    getCustomDoc,
    onGetAgendas,
    updateAgenda,
    deleteAgenda,
    UserStatus,
    UserVerificaitonStatus,
    logOut
} from './firebase.js'

const agendaForm = document.getElementById('agenda-form')
const agendaContainer = document.getElementById('agenda-container')

let editStatus = false;
let editingAgendaId = '';

window.addEventListener('DOMContentLoaded', async () => {
    UserStatus();
    UserVerificaitonStatus();
    onGetAgendas((querySnapshot) => {
        try{
            let html ='';
    
            querySnapshot.forEach(async doc => {
                const Agenda = doc.data();
                
                html +=`
                <div class = "col-md-4">
                    <div class="card border-info mb-3">
                        <div class="card-body">
                            <div class="modal-body">
                                <p>${Agenda.ciclo}</p>
                                <img class="imageSizeManager" src="${Agenda.imageURL}">
                            </div>
                            <div class="modal-footer">
                                <button class ="btn btn-info btn-edit" data-id = "${doc.id}">Editar</button>
                                <button class ="btn btn-danger btn-delete" data-id = "${doc.id}">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            })
            agendaContainer.innerHTML = html;

            const btnsDelete = agendaContainer.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', ({target: { dataset }}) => {
                    deleteAgenda(dataset.id);
                })
                
            })
            const btnsEdit = agendaContainer.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async ({target: { dataset }}) => {
                    const doc = await getCustomDoc(dataset.id, 'Agendas');
                    const Agenda = doc.data();

                    agendaForm['agenda-ImagePreviews'].src = Agenda.imageURL
                    editStatus = true;
                    editingAgendaId = dataset.id;
                    agendaForm['btn-agenda-save'].innerText = 'Actualizar'
                    agendaForm['btn-agenda-save'].className = 'btn btn-primary'
                })
            })
        } catch(e){
            console.log("Error getting cached document:", e);
        }
    })
})
agendaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const image= agendaForm['agenda-Image'];
    const period = agendaForm['agenda-Period'];

    if(editStatus){
        updateAgenda(editingAgendaId,image.files[0]);
        
            agendaForm['btn-agenda-save'].innerText = 'Guardar'
            agendaForm['btn-agenda-save'].className = 'btn btn-success'
        editStatus = false;
    }else{
        saveAgenda(image.files[0],period.value);

    }
    agendaForm['agenda-ImagePreviews'].src = ''
    agendaForm.reset();
})
agendaForm['agenda-Image'].addEventListener('change',(e) =>{
    e.preventDefault();
    const image= agendaForm['agenda-Image'].files[0];
    if(image){
        const reader = new FileReader();
        reader.onload = function(){
            const result = reader.result;
            agendaForm['agenda-ImagePreviews'].src = result;
        }
        reader.readAsDataURL(image);
    }
})
const btnLogout = document.getElementById('logout');
btnLogout.addEventListener('click',(e) =>{
    e.preventDefault();
    logOut();
})