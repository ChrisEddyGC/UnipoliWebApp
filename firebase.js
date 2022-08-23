// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { 
  getFirestore, collection,doc, addDoc,
  setDoc,getDoc,getDocs,deleteDoc,
  deleteField,updateDoc,onSnapshot,serverTimestamp,
  query,where,orderBy
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";
import { 
  getStorage,uploadBytes,getDownloadURL,
  deleteObject,ref
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";
import {
  createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,
  onAuthStateChanged,getAuth,sendPasswordResetEmail,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgTO2U6UeZh1Tw0RtMtK-2El6WVvU26Qk",
  authDomain: "unipoliappdatabase.firebaseapp.com",
  projectId: "unipoliappdatabase",
  storageBucket: "unipoliappdatabase.appspot.com",
  messagingSenderId: "998269719762",
  appId: "1:998269719762:web:b2409717f24706a703890b",
  measurementId: "G-VJVDF3SBFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore()
const storage = getStorage(app);

const auth = getAuth();

//Funciones para el login
    // funcion para saber si hay un [User] con sesion abierta, sino, sera redirigido al index
    export const UserStatus = () =>{
      onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        getDoc(doc(db, 'Students', uid))
        .then((snapshotQuery)=>{
          const student = snapshotQuery.data();
          if(student){
            window.location.replace("./index.html")
          }
        })

      } else {
        window.location.replace("./index.html")
      }
      });
    }
    export const UserVerificaitonStatus = () =>{
      onAuthStateChanged(auth, (user) => {
        if (user) {
          if(user.emailVerified){
          }else{
            window.location.replace("./VerificationLobby.html")
          }
  
        } else {
          window.location.replace("./index.html")
        }
        });
    }
    //funcion para crear un nuevo [User]
    export const signUp = (email,password,userName,phone,department,jobTitle,workingHours) =>{
      createUserWithEmailAndPassword(auth,email,password)
      .then((userCredential) => {
        const UserId = userCredential.user.uid;
        setDoc(doc(db,'UniversityStaff',UserId),{id:UserId,userName,email,phone,department,jobTitle,workingHours})
        .then(()=>{
          window.location.replace("./VerificationLobby.html")
        })
        //addDoc(collection(db,'UniversityStaff',UserId),{id:UserId,userName,email,phone,area,jobTitle,workingHours})
      })
    }
    //funcion para ingresar en un [User] existente
    export const signIn = (email,password) =>{
      signInWithEmailAndPassword(auth,email,password)
      .then((user) => {
        if(user.user.emailVerified){
          window.location.replace("./Home.html")
        }else{
          window.location.replace("./VerificationLobby.html")
        }
      })
    }
    //funcion para cerrar sesion
    export const logOut = () => {
      signOut(auth)
      .then(() => {
        window.location.replace("./index.html")
      })
    }
    //funcion para obtener la informacion del usuario actual
    export const getUserInfo = (collection) => {
      //crear una promesa y asignar el valor de retorno con resolve
      return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            getDoc(doc(db, collection, user.uid))
            .then((doc)=>{            
              resolve(doc)
            })
          }
        })
      })
    }
    export const updateUserInfo = (email,userName,phone,department,jobTitle,workingHours) => {
      return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            if(user.email == email){
              updateDoc(doc(db, 'UniversityStaff', user.uid),{userName,phone,department,jobTitle,workingHours})
              .then((doc)=>{            
                resolve(doc)
              })
            }
          } 
        })
      })
    }
    //funcion para enviar correo de restablecimiento de contraseña
    export const ResetPassword = (email) => {
      sendPasswordResetEmail(auth,email)
      .then(()=>{
        alert("se ha enviado la solicitud para restablecer su contraseña")
      })
    }
    //funcion para enviar correo de verificacion de cuenta
    export const VerifyEmail = ()=>{
      onAuthStateChanged(auth, (user) => {
        if (user) {
          sendEmailVerification(user)
          .then(()=>{
            alert("la solicitud de verificacion ha sido enviada a su correo electronico")
          })
        } else {
          window.location.replace("./index.html")
        }
        });
    }

//Funciones mixtas
    export const getCustomDoc = (id, collectionName) => getDoc(doc(db, collectionName, id))

//Funciones para las [CommunityNews]
    //funcion para mandar la informacion del formulario a la coleccion [CommunityNews] de la base de datos
    export const saveCommunityNew = (message,image) => {
      //en el caso de que el community new lleve imagen y mensaje
      if((image) && (message)){
        const imageName = image.name;
        let storageLocation ='CommunityNews/'+ imageName;
        const storageRef = ref(storage, storageLocation)
        uploadBytes(storageRef, image).then(async snapshot => {
          const imageURL = await getDownloadURL(snapshot.ref)
          addDoc(collection(db,'CommunityNews'),{message,imageURL,imageName,createdAt: serverTimestamp()})
        })
      }else if(message){
        //en el caso de que el community new solo lleve mensaje
        addDoc(collection(db,'CommunityNews'),{message,createdAt: serverTimestamp()})
      }else if(image){
        //en el caso de que el community new solo lleve imagen
        const imageName = image.name;
        let storageLocation ='CommunityNews/'+ imageName;
        const storageRef = ref(storage, storageLocation)
        uploadBytes(storageRef, image).then(async snapshot => {
          const imageURL = await getDownloadURL(snapshot.ref)
          addDoc(collection(db,'CommunityNews'),{imageURL,imageName,createdAt: serverTimestamp()})
        })
      }
    }
    //funcion para obtener los [CommunityNews] cada que se edita la informacion de firebase
    export const onGetCommunityNews =(callback) => {
      const CommunityNewQuery = query(collection(db,'CommunityNews'), orderBy("createdAt", "desc"))
      onSnapshot(CommunityNewQuery, callback)
    }
    //funcion para actualizar un [CommunityNew]
    export const updateCommunityNew = async (id,newInfo) => {
      //obtener el documento que se va a actualizar
      const oldDataDoc = await getDoc(doc(db, 'CommunityNews', id));
      if((newInfo.image) && (newInfo.message)){
        //eliminar la imagen anterior del community new del storage de firebase
        const oldData = oldDataDoc.data();
        if(oldData.imageName){
          const oldImageName = oldData.imageName;
          const oldImageRef = ref(storage, 'CommunityNews/'+oldImageName);
          deleteObject(oldImageRef)
        }
        //actualizar el CommunityNew
        const imageName = newInfo.image.name;
        let storageLocation ='CommunityNews/'+ newInfo.image.name;
        const storageRef = ref(storage, storageLocation);
        uploadBytes(storageRef, newInfo.image).then(async snapshot => {
          const message = newInfo.message;
          const imageURL = await getDownloadURL(snapshot.ref);
          updateDoc(doc(db, 'CommunityNews', id),{message,imageURL,imageName,createdAt: serverTimestamp()})
        })
      }else if(newInfo.message){
        //actualizar el CommunityNew
        const message = newInfo.message;
        updateDoc(doc(db, 'CommunityNews', id),{message,createdAt: serverTimestamp()})
      }
      
    }
    //funcion para eliminar un [CommunityNew] de la base de datos
    export const deleteCommunityNew = async id => {
      const oldDataDoc = await getDoc(doc(db, 'CommunityNews', id));
      const oldData = oldDataDoc.data();
      //borrar la imagen del community new del storage de firebase
      if(oldData.imageName){
        const oldImageName = oldData.imageName;
        const oldImageRef = ref(storage, 'CommunityNews/'+oldImageName);
        deleteObject(oldImageRef)
      }
      deleteDoc(doc(db, 'CommunityNews', id))
    }

//Funciones para los [Messages]
    //funcion para guardar el [Message]
    export const saveMessage = (title,message,ISW,IC,IRT,ITA,ITM,LAGE) =>{
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          addDoc(collection(db,'Messages'),{title,message,ISW,IC,IRT,ITA,ITM,LAGE,createdAt: serverTimestamp(),user: uid})
        }
      })
    }
    //funcion para obtener los [Messages] cada que se edita la informacion de firebase
    export const onGetMessages = (callback) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //obtener los mensajes unicamente creados por el usuario actual
          const uid = user.uid;
          const MessagesQuery = query(collection(db,'Messages'),where("user", "==", uid), orderBy("createdAt", "desc"))
          onSnapshot(MessagesQuery, callback)
        }
      })
    }
    //funcion para actualizar un [Message]
    export const updateMessage = (id, newInfo) => {
      updateDoc(doc(db, 'Messages', id),newInfo)
      updateDoc(doc(db, 'Messages', id),{createdAt: serverTimestamp()})
    }
    //funcion para eliminar el Message
    export const deleteMessage = id => deleteDoc(doc(db,'Messages', id))

//Funciones para las [Schedules]
    //funcion para mandar la informacion del formulario a la coleccion [Schedules] de la base de datos
    export const saveSchedule = async(career, period, grade, group, BIS,image) => {
      //en el caso de que el community new lleve imagen y mensaje
        const imageName = image.name;

        
      const q = query(collection(db, "Schedules"), 
      where("career", "==", career), 
      where("period", "==", period), 
      where("grade", "==", grade), 
      where("group", "==", group), 
      where("BIS", "==", BIS));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        let storageLocation ='Schedules/'+ imageName;
        const storageRef = ref(storage, storageLocation)
        uploadBytes(storageRef, image).then(async snapshot => {
          getDownloadURL(snapshot.ref)
          .then(imageURL =>{
            addDoc(collection(db,'Schedules'),{career, period, grade, group, BIS,imageURL,imageName})
          })
        })
      }else{querySnapshot.forEach(docs =>{
        const oldData = docs.data();
        if(oldData.imageURL){
          const oldImageName = oldData.imageName;
          const oldImageRef = ref(storage, 'Schedules/'+oldImageName);
          deleteObject(oldImageRef)
        }
        const imageName = image.name;
        let storageLocation ='Schedules/'+ imageName;
        const storageRef = ref(storage, storageLocation);
        uploadBytes(storageRef, image).then(async snapshot => {
          const imageURL = await getDownloadURL(snapshot.ref);
          updateDoc(doc(db, 'Schedules', docs.id),{career,period,grade,group,BIS,imageURL,imageName})
          })
        })
      }
      
    }
    //funcion para obtener los [Schedules] cada que se edita la informacion de firebase
    export const onGetSchedules =(callback) => {
      const ScheduleQuery = query(collection(db,'Schedules'), orderBy("grade"), orderBy("group"))
      onSnapshot(ScheduleQuery, callback)
    }
    //funcion para actualizar un [Schedule]
    export const updateSchedule = async (id,newInfo) => {
      //obtener el documento que se va a actualizar
      const oldDataDoc = await getDoc(doc(db, 'Schedules', id));
        //eliminar la imagen anterior del community new del storage de firebase
        const oldData = oldDataDoc.data();
        if(oldData.imageName){
          const oldImageName = oldData.imageName;
          const oldImageRef = ref(storage, 'Schedules/'+oldImageName);
          deleteObject(oldImageRef)
        }
        //actualizar el CommunityNew
        const imageName = newInfo.image.name;
        let storageLocation ='Schedules/'+ imageName;
        const storageRef = ref(storage, storageLocation);
        uploadBytes(storageRef, newInfo.image).then(async snapshot => {
          const career = newInfo.career;
          const period = newInfo.period;
          const grade = newInfo.grade;
          const group = newInfo.group;
          const BIS = newInfo.BIS;
          const imageURL = await getDownloadURL(snapshot.ref);
          updateDoc(doc(db, 'Schedules', id),{career,period,grade,group,BIS,imageURL,imageName})
        })
      
      
    }
    //funcion para eliminar un [Schedule] de la base de datos
    export const deleteSchedule = async id => {
      const oldDataDoc = await getDoc(doc(db, 'Schedules', id));
      const oldData = oldDataDoc.data();
      //borrar la imagen del community new del storage de firebase
      if(oldData.imageName){
        const oldImageName = oldData.imageName;
        const oldImageRef = ref(storage, 'Schedules/'+oldImageName);
        deleteObject(oldImageRef)
      }
      deleteDoc(doc(db, 'Schedules', id));

    }
//Funciones para los [Departments]
    //funciones para mandar la informacion del formulario a la coleccion [Departments]
    export const saveDepartment = async(name, image) => {
      const q = query(collection(db, "Departments"), 
      where("name", "==", name.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        const imageName = image.name;
        let storageLocation = 'Departments/' + imageName;
        const storageRef = ref(storage,storageLocation)
        uploadBytes(storageRef,image).then(async snapshot =>{
          getDownloadURL(snapshot.ref)
          .then(imageURL =>{
            addDoc(collection(db,'Departments'),{name: name.toLowerCase(),imageName,imageURL})
          })
        })
      }else{querySnapshot.forEach(docs =>{
        if(image){
          const oldData = docs.data();
          if(oldData.imageName){
            const oldImageName = oldData.imageName;
            const oldImageRef = ref(storage, 'Departments/'+oldImageName);
            deleteObject(oldImageRef)
          }
          const imageName = image.name;
          let storageLocation ='Departments/'+ imageName;
          const storageRef = ref(storage, storageLocation);
          uploadBytes(storageRef, image).then(async snapshot => {
            const imageURL = await getDownloadURL(snapshot.ref);
            updateDoc(doc(db, 'Departments', docs.id),{name: name.toLowerCase(),imageURL,imageName})
          })
        }

        })
      }

    }
    //funcion para obtener los [Departments] cada que se edita la informacion de firebase
    export const onGetDepartments = (callback) => {
      const DepartmentQuery = query(collection(db,'Departments'), orderBy('name'))
      onSnapshot(DepartmentQuery,callback)
    }
    //funcion para actualizar un [Department]
    export const updateDepartment = async(id,oldname,image) => {
      if(image){
        const oldDataDoc = await getDoc(doc(db, 'Departments', id));

        const oldData = oldDataDoc.data();
        if(oldData.imageName){
          const oldImageName = oldData.imageName;
          const oldImageRef = ref(storage, 'Departments/'+oldImageName);
          deleteObject(oldImageRef)
        }
        const imageName = image.name;
        let storageLocation ='Departments/'+ imageName;
        const storageRef = ref(storage, storageLocation);
        uploadBytes(storageRef, image).then(async snapshot => {
          const name = oldname;
          const imageURL = await getDownloadURL(snapshot.ref);
          updateDoc(doc(db, 'Departments', id),{name: name.toLowerCase(),imageURL,imageName})
        })
      }
    }
    //funcion para eliminar un [Department] de la base de datos
    export const deleteDepartment = async(id) => {
      const oldDataDoc = await getDoc(doc(db, 'Departments', id));
      const oldData = oldDataDoc.data();
      //borrar la imagen del storage
      if(oldData.imageName){
        const oldImageName = oldData.imageName;
        const oldImageRef = ref(storage, 'Departments/'+oldImageName);
        deleteObject(oldImageRef)
      }
      deleteDoc(doc(db, 'Departments', id));
      
      const q = query(collection(db, "UniversityStaff"), 
                  where("department", "==", id));
      getDocs(q)
        .then(querySnapshot =>{
          querySnapshot.forEach((qdoc) =>{
            const staff = qdoc.data();
            updateDoc(doc(db, 'UniversityStaff', staff.id), {
              department: deleteField()
            });
          })
        })
    }
//Funciones para las [Agendas]
    //funcion paa mandar la informacion del formulario a la coleccion [Agendas] de la base de datos
    export const saveAgenda = async (image,period) => {
      let imageURL ="";
      const imageName = image.name;
      let storageLocation = "Agendas/" + imageName;
      const d = new Date();
      const year = d.getFullYear();
      const ciclo = year + period;

      const q = query(collection(db, "Agendas"), where("ciclo", "==", ciclo));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        let storageRef = ref(storage, storageLocation)
        await uploadBytes(storageRef, image).then(async snapshot => {
            getDownloadURL(snapshot.ref)
            .then(imgURL =>{
              imageURL = imgURL;
              addDoc(collection(db,'Agendas'),{imageName, imageURL,ciclo: ciclo})
          })
        })
      }else{
        querySnapshot.forEach(docs =>{
          const oldData = docs.data();
          if(oldData.imageURL){
            const oldImageName = oldData.imageName;
            const oldImageRef = ref(storage, 'Agendas/'+oldImageName);
            deleteObject(oldImageRef)
          }
          const imageName = image.name;
          let storageLocation ='Agendas/'+ imageName;
          const storageRef = ref(storage, storageLocation);
          uploadBytes(storageRef, image).then(async snapshot => {
            const imageURL = await getDownloadURL(snapshot.ref);
            updateDoc(doc(db, 'Agendas', docs.id),{imageURL,imageName})
          })
        })
      }

    }
    //funcion para obtener los [Agendas] cada que se edita la informacion de firebase
    export const onGetAgendas = (callback) => {
      const DepartmentQuery = query(collection(db,'Agendas'), orderBy('ciclo'))
      onSnapshot(DepartmentQuery,callback)
    }
    //funcion para actualizar un [Agenda]
    export const updateAgenda = async(id, newImg) => {
      if(newImg){
        const oldDataDoc = await getDoc(doc(db, 'Agendas', id));

        const oldData = oldDataDoc.data();
        if(oldData.imageURL){
          const oldImageName = oldData.imageNameL;
          const oldImageRef = ref(storage, 'Agendas/'+oldImageName);
          deleteObject(oldImageRef)
        }
        const imageName = newImg.name;
        let storageLocation ='Agendas/'+ imageName;
        const storageRef = ref(storage, storageLocation);
        uploadBytes(storageRef, newImg).then(async snapshot => {
          const imageURL = await getDownloadURL(snapshot.ref);
          updateDoc(doc(db, 'Agendas', id),{imageURL,imageName})
        })
      }
    }
    //funcion para eliminar un [Agenda] de la base de datos
    export const deleteAgenda = async(id) => {
      const oldDataDoc = await getDoc(doc(db, 'Agendas', id));
      const oldData = oldDataDoc.data();
      //borrar la imagen del storage
      if(oldData.imageURL){
        const oldImageName = oldData.imageName;
        const oldImageRef = ref(storage, 'Agendas/'+oldImageName);
        deleteObject(oldImageRef)
      }
      deleteDoc(doc(db, 'Agendas', id));
      
    }