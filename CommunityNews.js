import {
    saveCommunityNew, 
    getCustomDoc, 
    onGetCommunityNews, 
    updateCommunityNew,
    deleteCommunityNew, 
    UserStatus,
    UserVerificaitonStatus,
    logOut
} from './firebase.js'

const communityNewsForm = document.getElementById('communityNews-form')
const communityNewsContainer = document.getElementById('communityNews-container')

//variable para saber si se esta editando un CommunityNew existente o se esta guardando uno nuevo
let editStatus = false;
let editingCommunityNewId ='';


window.addEventListener('DOMContentLoaded', async () => {
    UserStatus();
    UserVerificaitonStatus();
    onGetCommunityNews((querySnapshot) => {
        try {
            let html ='';
    
            querySnapshot.forEach(async doc => {
                const CommunityNew = doc.data();
                const communityNewDate = CommunityNew.createdAt.toDate();
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const communityNewFrontDate = communityNewDate.toLocaleDateString(undefined, options) 
                                        + " " 
                                        + communityNewDate.toLocaleTimeString('en-US');
                //const CommunityNewImage = await getCommunityNewImage(CommunityNew.storageLocation);
                //se inserta la lista de objetos de la base de datos a la pagina
                html += `
                <div class="card border-info mb-3">
                    <div class="card-body">
                        <div class="modal-body">`;
                if(CommunityNew.message){
                    html += `<p>${CommunityNew.message}</p>`;
                }    
                
                if(CommunityNew.imageURL){
                    html += `<img src="${CommunityNew.imageURL}" class ="img-fluid">`;
                }
                html += `   <div class="text-muted">
                                ${communityNewFrontDate}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class ="btn btn-info btn-edit" data-id = "${doc.id}">Editar</button>
                            <button class ="btn btn-danger btn-delete" data-id = "${doc.id}">Eliminar</button>
                        </div>
                    </div>
                </div>`;
            
            })
            communityNewsContainer.innerHTML = html;

            //se le asigna el evento deleteCommunityNew a cada boton eliminar
            const btnsDelete = communityNewsContainer.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', ({target: { dataset }}) => {
                    deleteCommunityNew(dataset.id);
                })
            })
            
            //se le asigna el evento editCommunityNew a cada boton editar
            const btnsEdit = communityNewsContainer.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async ({target: { dataset }}) => {
                    const doc = await getCustomDoc(dataset.id, 'CommunityNews');
                    const CommunityNew = doc.data();

                    //guardando la informacion del CommunityNew para poder editarlo
                    communityNewsForm['communityNew-Message'].value = CommunityNew.message;
                    communityNewsForm['communityNew-ImagePreviews'].src = CommunityNew.imageURL
                    editStatus = true;
                    editingCommunityNewId = dataset.id;
                    communityNewsForm['btn-comunnityNew-save'].innerText = 'Actualizar'
                    communityNewsForm['btn-comunnityNew-save'].className = 'btn btn-primary'
                })
            })
        } catch(e){
            console.log("Error getting cached document:", e);
        }
    })
    
})

//objeto donde se guarda la informacion del formulario CommunityNews

communityNewsForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //obtener la informacion del formulario
    const message= communityNewsForm['communityNew-Message'];
    const image= communityNewsForm['communityNew-Image'];
    //mandar la informacion del formulario a la base de datos
    if(editStatus){
        if(image.value){
            updateCommunityNew(editingCommunityNewId,{message: message.value,image: image.files[0]});
        }else{
            updateCommunityNew(editingCommunityNewId,{message: message.value});
        }
        
        communityNewsForm['btn-comunnityNew-save'].innerText = 'Guardar'
        communityNewsForm['btn-comunnityNew-save'].className = 'btn btn-success'
        editStatus = false;
    }else{
        if(image.files[0]){
            saveCommunityNew(message.value,image.files[0]);
        }
        else{
            saveCommunityNew(message.value);
        }
    }
    
    communityNewsForm['communityNew-ImagePreviews'].src = ''
    communityNewsForm.reset();
})
communityNewsForm['communityNew-Image'].addEventListener('change',(e) =>{
    e.preventDefault();
    const image= communityNewsForm['communityNew-Image'].files[0];
    if(image){
        const reader = new FileReader();
        reader.onload = function(){
            const result = reader.result;
            communityNewsForm['communityNew-ImagePreviews'].src = result;
        }
        reader.readAsDataURL(image);
    }

})
const btnLogout = document.getElementById('logout');
btnLogout.addEventListener('click',(e) =>{
    e.preventDefault();
    logOut();
})
