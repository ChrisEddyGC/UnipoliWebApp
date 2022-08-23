import { 
    saveDepartment,
    getCustomDoc,
    onGetDepartments,
    updateDepartment,
    deleteDepartment,
    UserStatus,
    UserVerificaitonStatus,
    logOut
} from "./firebase.js"


//formularios
const departmentSingleForm = document.getElementById('department-single-form')

const departmensContainer = document.getElementById('department-container')

let editStatus = false;
let editingDepartmentId ='';

window.addEventListener('DOMContentLoaded', async() => {
    UserStatus();
    UserVerificaitonStatus();
    onGetDepartments((querySnapshot) =>{
        try{
            let html ='';
            querySnapshot.forEach(async doc => {
                const Department = doc.data();
                html += `
                <div class = "col-md-4">
                    <div class="card border-info mb-3">
                        <div class="card-body">
                            <div class="modal-body">
                                <p>${Department.name}</p>
                                <img class="imageSizeManager" src="${Department.imageURL}" width="200" height="350" >
                                <button class ="btn btn-info btn-edit" data-id = "${doc.id}">Editar</button>
                                <button class ="btn btn-danger btn-delete" data-id = "${doc.id}">Eliminar</button>

                            </div>
                        </div>
                    </div>
                </div>`;
            });
            departmensContainer.innerHTML = html;

            const btnsDelete = departmensContainer.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', ({target: { dataset }}) => {
                    deleteDepartment(dataset.id);
                })
                
            })
            const btnsEdit = departmensContainer.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async ({target: { dataset }}) => {
                    const doc = await getCustomDoc(dataset.id, 'Departments');
                    const Department = doc.data();

                    //guardando la informacion del CommunityNew para poder editarlo
                    departmentSingleForm['department-Name'].value = Department.name;
                    departmentSingleForm['department-ImagePreviews'].src = Department.imageURL;
                    editStatus = true;
                    editingDepartmentId = dataset.id;
                    departmentSingleForm['btn-departmentSingle-save'].innerText = 'Actualizar'
                    departmentSingleForm['btn-departmentSingle-save'].className = 'btn btn-primary'
                })
            })
            
        } catch(e){
            console.log("Error getting cached document:", e);
        }
    })

})

departmentSingleForm.addEventListener('submit',(e) => {
    e.preventDefault();

    const name = departmentSingleForm['department-Name'];
    const image = departmentSingleForm['department-Image'];
    if(editStatus){
        updateDepartment(editingDepartmentId,name.value,image.files[0])

        departmentSingleForm['btn-departmentSingle-save'].innerText = 'Guardar'
        departmentSingleForm['btn-departmentSingle-save'].className = 'btn btn-success'
        editStatus = false;
    }else{
        saveDepartment(name.value,image.files[0])
    }
    departmentSingleForm['department-ImagePreviews'].src = ''
    departmentSingleForm.reset();

})
departmentSingleForm['department-Image'].addEventListener('change',(e) =>{
    e.preventDefault();
    const image= departmentSingleForm['department-Image'].files[0];
    if(image){
        const reader = new FileReader();
        reader.onload = function(){
            const result = reader.result;
            departmentSingleForm['department-ImagePreviews'].src = result;
        }
        reader.readAsDataURL(image);
    }

})
const btnLogout = document.getElementById('logout');
btnLogout.addEventListener('click',(e) =>{
    e.preventDefault();
    logOut();
})