# UnipoliWebApp
aplicacion web para el sistema "agenda institucional" de la universidad politecnica de durango

para el desarrollo de la aplicacion se utilizo Visual Studio Code 1.70.2
con la extension Live Server
Desglose de código.

		Manuales tecnicos
		https://drive.google.com/drive/folders/1qZuX3Tc5rMVfKwOUcBGvNQatYbNWCJwa?usp=sharing

  Diccionario de funciones
  
Dentro de la aplicación web existe un documento llamado firebase.js, el cual contiene todas las funciones que manejan la conexión de la aplicación con la base de datos y la manipulación de información dentro de la misma

	  1.UserStatus
Líneas (45,46): Se verifica si hay un usuario activo en sesión
Línea (48-50): Se hace una consulta para buscar al usuario dentro de la colección de estudiantes.
Línea (51): Si es el caso, se redijera a la página inicial
Línea (56): en caso de no haber un usuario activo se redijera a la página inicial

	  2.UserVerificationStatus
Líneas (62,63): Se verifica si hay un usuario activo en sesión
Línea (65): Si el usuario no está verificado será redirigido a la página de verificación de correo. 
Línea (69): En caso de no haber un usuario activo se redijera a la página inicial

	  3.signUp
Línea (76): Se creará una cuenta de usuario con el correo y contraseña ingresadas
Línea (79): Al terminar el proceso anterior se creará un documento con la información del usuario dentro de la colección “UniversityStaff”

	  4.signIn
Línea (88): Se iniciará sesión con el correo y contraseña ingresadas.
Línea (90): Si el usuario ya está verificado se le dara acceso a la aplicación
Línea (92): Si el usuario no está verificado será redirigido a la página de verificación de correo.

	  5.logOut
Línea (99): se cerrara la sesión y el usuario será redirigido a la página inicial

	  6.getUserInfo
Línea (107): se realizará una consulta del documento con id del usuario activo.

	  7.ResetPassword
Línea (120): se enviará un mensaje al correo electrónico del usuario solicitante con un formulario de restablecimiento de contraseña

	  8.VerifyEmail
Línea (127): Se enviará un mensaje al correo electrónico del usuario solicitante con un formulario de verificación de identidad

	  9.getCustomDoc
Línea (140): se obtiene un documento especifico de una colección.

    10.saveCommunityNew
Línea (146): en caso de que se guarde un CommunityNew con imagen y mensaje:
Línea (150): se subirá al Storage la imagen, 
Línea (151): se obtendrá el enlace del archivo en el servidor
Línea (152): se agregará a los datos del CommunityNew y se subirá el documento
Línea (154): en caso de ser solo un mensaje se subirá directamente
Línea (156): en caso de ser solo una imagen:
	Línea (162): se subirá la imagen al Storage
	Línea (164): se subirá el documento
  
    11.onGetCommunityNews
Linea (170): se obtendrá toda la colección de CommunityNews cuando haya un cambio en la colección

    12.updateCommunityNew
Línea (177): en caso que se vayan a actualizar la imagen y el mensaje
Línea (179): se elimina la imagen relacionada al CommunityNew del Storage.
Línea (189): se subirá al Storage la nueva imagen
Línea (192): en caso de que vaya a actualizar solo el mensaje
	Línea (197): se actualizará directamente.
  
    13.deleteCommunityNew
Línea (206): se hay una imagen asignada al CommunityNew se eliminará del storage
Línea (211): se eliminará el documento.

    14.saveMessage
Líneas (217-220): se obtiene el nombre del usuario en sesión activa
Línea (225): se guarda el mensaje

    15.onGetMessages
Líneas (233-237): se obtiene el nombre del usuario en sesión activa
Línea (241): se obtendrá toda la colección de Messages realizados or el usuario activo cuando haya un cambio en la colección

    16.updateMessage
Línea (251): se actualiza el contenido del mensaje
Línea (252): se actualiza la fecha de registro del mensaje en el servidor

    17.deleteMessage
Línea (255): se elimina el mensaje

    18.saveSchedule
Líneas (264-271): se revisa en la colección si ya existe un Schedule con la misma información
Líneas (272-274): si no existe un Schedule se sube directamente la imagen al Storage.
Línea (275): se obtiene el enlace de la imagen subida al Storage
Línea (277): se agrega el nuevo documento)
Líneas (280-286): En caso de existir un Schedule se borra la imagen anterior asignada 
Línea (290): se sube la nueva imagen al Storage
Línea (292): Se actualiza el documento existente

    19.onGetSchedules
Línea (300): se obtendrá toda la colección de Schedules cuando haya un cambio en la colección

    20.updateSchedule
Líneas (206-213): se obtiene el documento a actualizar y se borra la imagen asignada al documento del Storage.
Línea (318): se sube la nueva imagen al Storage
Línea (325): se actualiza la información del Schedule

    21.deleteSchedule
Líneas (332-338): se elimina la imagen asignada al Schedule del Storage
Línea (340): se elimina el documento

    22.saveDepartment
Líneas (346-349): se sube la imagen del Department al Storage
Línea (352): se agrega el documento

    23.onGetDepartments
Línea (358): se obtendrá toda la colección de Departments cuando haya un cambio en la colección

    24.updateDepartment
Líneas (362-368):  se elimina la imagen asignada al Department de Storage
Línea (373): se sube la nueva imagen al Storage
Línea (376): se actualiza la información del Department

    25.deleteDepartment
Líneas (381-387): se elimina la imagen asignada al Department de Storage
Línea (389): se elimina el documento
Líneas (391-398): se elimina la asignación del Department eliminado de todos los UniversityStaff.

    26.saveAgenda
Líneas (412-414): se verifica si existe una Agenda con la misma información
Líneas (414-420): en caso de no existir se sube la imagen asignada a la Agenda y se agrega el documento
Lineas (424-429): en caso de existir se elimina la imagen asignada a la Agenda del Storage
Lineas (431-436): se sube la nueva imagen del Agenda y se actualiza la información de la Agenda existente

    27.onGetAgendas
Línea (444): se obtendrá toda la colección de Agendas cuando haya un cambio en la colección

    28.updateAgenda
Lineas (448-454): se elimina la imagen asignada a la Agenda del Storage
Linea (459): se sube la nueva imagen de la Agenda
LInea (461): se actualiza la información de la Agenda

    29.deleteAgenda
Lineas (467-473): se elimina la imagen asignada a la Agenda
Linea (475): se elimina el documento


    Agenda.js
  
Líneas (23-44): se inserta al archivo Agenda.html las agendas obtenidas de la base de datos dentro del agendaContainer
Lineas (46-39): se asigna un evento click a cada agenda para eliminarla
Lineas(53-63): se asigna un evento click a cada agenda para actualizar su informacion
Linea (71): se genera un evento al agendaForm para mandar la información el formulario a la base de datos
Lineas (77): si el formulario está asignado a editar un Agenda se realiza la función updateAgenda (5.1.28)
Linea (84): si el formulario está asignado a crear una Agenda se realizaera la función saveAgenda (5.1.26)

    CommunityNews.js
  
Líneas (25-59): se inserta al archivo CommunityNews.html las agendas obtenidas de la base de datos dentro del communityNewsContainer
líneas (62-65): se asigna un evento click a cada communityNew para eliminarla
líneas (70-82): se asigna un evento click a cada communityNew para actualizar su información
Línea (94): se genera un evento al communityNewForm para mandar la información el formulario a la base de datos
Líneas (100): si el formulario está asignado a editar un CommunityNew se realizará la función updateCommunityNews (5.1.12)
Línea (110): si el formulario está asignado a crear una CommunityNew se realizará la función saveCommunityNews (5.1.10)

     Department.js
  
Líneas (26-44): se inserta al archivo Departments.html las agendas obtenidas de la base de datos dentro del departmentContainer
líneas (46-49): se asigna un evento click a cada departmentpara eliminarla
líneas (53-65): se asigna un evento click a cada departmentpara actualizar su información
Línea (76): se genera un evento al departmentForm para mandar la información el formulario a la base de datos
Líneas (81): si el formulario está asignado a editar un Departmentse realizará la función updateDepartments (5.1.24)
Línea (87): si el formulario está asignado a crear una Departmentse realizará la función saveDepartments (5.1.22)

    Messages.js
  
Líneas (23-73): se inserta al archivo Messages.html las agendas obtenidas de la base de datos dentro del messagesContainer
líneas (75-78): se asigna un evento click a cada message para eliminarla
líneas (83-101): se asigna un evento click a cada message para actualizar su información
Línea (110): se genera un evento al messagesForm para mandar la información el formulario a la base de datos
Líneas (123): si el formulario está asignado a editar un Message se realizará la función updateMessages (5.1.16)
Línea (133): si el formulario está asignado a crear una Message se realizará la función saveMessages (5.1.14)

    Schedules.js
  
Líneas (24-53): se inserta al archivo Schedule.html las agendas obtenidas de la base de datos dentro del schedulesContainer
líneas (55-58): se asigna un evento click a cada schedule para eliminarla
líneas (62-78): se asigna un evento click a cada schedule para actualizar su información
líneas (86.94): se generan las opciones del select Schedule-Period basado en el año en curso
Línea (98): se genera un evento al schedulesForm para mandar la información el formulario a la base de datos
Líneas (110): si el formulario está asignado a editar un Schedule se realizará la función updateSchedules (5.1.20)
Línea (119): si el formulario está asignado a crear una Schedule se realizará la función saveSchedules (5.1.18)
