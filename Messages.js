import {
    saveMessage, 
    getCustomDoc, 
    onGetMessages, 
    updateMessage,
    deleteMessage, 
    UserStatus,
    UserVerificaitonStatus,
    logOut
} from './firebase.js'

const messagesForm = document.getElementById('messages-form')
const messagesContainer = document.getElementById('messages-container')

let editStatus = false;
let editingMessageId ='';

window.addEventListener('DOMContentLoaded', () => {
    UserStatus();
    UserVerificaitonStatus();
    onGetMessages((quertySnapshot) => {
        try{
            let html ='';

            quertySnapshot.forEach(async doc => {
                const Message = doc.data();
                const messageDate = Message.createdAt.toDate();
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const messageFrontDate = messageDate.toLocaleDateString(undefined, options) 
                                        + " " 
                                        + messageDate.toLocaleTimeString('en-US');

                html +=`
                <div class="card border-info mb-3">
                    <div class="card-body">
                        <div class="card-header">${Message.title}</div>
                        <div class="modal-body">
                            <p>${Message.message}</p>
                        </div>
                        <div class="modal-footer">`
                        
                html += `<div class="text-muted">
                            <p>${messageFrontDate}</p>
                        </div>`
                if(Message.ISW){
                    html += `<span class="badge rounded-pill bg-primary">ISW</span>`;
                }
                if(Message.IC){
                    html += `<span class="badge rounded-pill bg-primary">IC</span>`;
                }
                if(Message.IRT){
                    html += `<span class="badge rounded-pill bg-primary">IRT</span>`;
                }
                if(Message.ITA){
                    html += `<span class="badge rounded-pill bg-primary">ITA</span>`;
                }
                if(Message.ITM){
                    html += `<span class="badge rounded-pill bg-primary">ITM</span>`;
                }
                if(Message.LAGE){
                    html += `<span class="badge rounded-pill bg-primary">LAGE</span>`;
                }
                html +=`
                        </div>
                        <div class="modal-footer">
                            <button class ="btn btn-info btn-edit" data-id = "${doc.id}">Editar</button>
                            <button class ="btn btn-danger btn-delete" data-id = "${doc.id}">Eliminar</button>
                        </div>
                    </div>
                </div>`;
            })

            messagesContainer.innerHTML = html;

            const btnsDelete = messagesContainer.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', ({target: { dataset }}) => {
                    deleteMessage(dataset.id);
                })
            })

            //se le asigna el evento editMessage a cada boton editar
            const btnsEdit = messagesContainer.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async ({target: { dataset }}) => {
                    const doc = await getCustomDoc(dataset.id, 'Messages');
                    const Message = doc.data();

                    //guardando la informacion del Message para poder editarlo
                    messagesForm['message-Title'].value = Message.title;
                    messagesForm['message-Body'].value = Message.message;
                    messagesForm['checkbox-isw'].checked = Message.ISW;
                    messagesForm['checkbox-ic'].checked = Message.IC;
                    messagesForm['checkbox-irt'].checked = Message.IRT;
                    messagesForm['checkbox-ita'].checked = Message.ITA;
                    messagesForm['checkbox-itm'].checked = Message.ITM;
                    messagesForm['checkbox-lage'].checked = Message.LAGE;
                    editStatus = true;
                    editingMessageId = dataset.id;
                    messagesForm['btn-comunnityNew-save'].innerText = 'Actualizar'
                    messagesForm['btn-comunnityNew-save'].className = 'btn btn-primary'
                })
            })
        } catch(e){
            console.log("Error getting cached document:", e);
        }
    })
})

messagesForm.addEventListener('submit',(e) =>{
    e.preventDefault();

    const newTitle= messagesForm['message-Title'];
    const newMessage= messagesForm['message-Body'];

    const newISW = document.getElementById('checkbox-isw').checked;
    const newIC = document.getElementById('checkbox-ic').checked;
    const newIRT = document.getElementById('checkbox-irt').checked;
    const newITA = document.getElementById('checkbox-ita').checked;
    const newITM = document.getElementById('checkbox-itm').checked;
    const newLAGE = document.getElementById('checkbox-lage').checked;

    if(editStatus){
        updateMessage(editingMessageId, {
            title: newTitle.value,message: newMessage.value,
            ISW: newISW,IC: newIC,IRT: newIRT,
            ITA: newITA,ITM: newITM,LAGE: newLAGE,
        });

        messagesForm['btn-comunnityNew-save'].innerText = 'Guardar'
        messagesForm['btn-comunnityNew-save'].className = 'btn btn-success'
        editStatus = false;
    }else{
        saveMessage(newTitle.value,newMessage.value,newISW,newIC,newIRT,newITA,newITM,newLAGE)
    }
    messagesForm.reset();
})
const btnLogout = document.getElementById('logout');
btnLogout.addEventListener('click',(e) =>{
    e.preventDefault();
    logOut();
})
