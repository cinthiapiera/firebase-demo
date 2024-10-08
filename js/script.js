$(document).ready(function () {
    // Configuración de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAGmxKChmIRXXME7JPWh6UhM5JBWpXZiCw",
        authDomain: "fir-demo-71814.firebaseapp.com",
        projectId: "fir-demo-71814",
        storageBucket: "fir-demo-71814.appspot.com",
        messagingSenderId: "495872357832",
        appId: "1:495872357832:web:22b4bbdd73d3581914fcfd",
        measurementId: "G-9NX6K4LLDY"
    };

    // Inicializar Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Crear una instancia del proveedor de Google
    const provider = new firebase.auth.GoogleAuthProvider();

    // Crear una instancia del proveedor de facebook
    // const facebookProvider = new firebase.auth.FacebookAuthProvider();

    // Definir la URL del avatar provisional
    const defaultAvatar = "https://via.placeholder.com/100";


    // Manejo de eventos para mostrar el formulario de registro
    $('#showRegisterForm').click(function () {
        $('#registerForm').removeClass('d-none');
        $('#main-buttons').addClass('d-none');
    });

    // Volver al menú principal desde el formulario de registro
    $('#backToMain2').click(function () {
        $('#registerForm').addClass('d-none');
        $('#main-buttons').removeClass('d-none');
    });

    // Manejo de eventos para iniciar sesión con correo
    $('#loginEmailBtn').click(function () {
        $('#loginEmailForm').removeClass('d-none');
        $('#main-buttons').addClass('d-none');
    });

    // Volver al menú principal desde el formulario de inicio de sesión
    $('#backToMain1').click(function () {
        $('#loginEmailForm').addClass('d-none');
        $('#main-buttons').removeClass('d-none');
    });

    // Manejo de la acción de cerrar sesión
    $('#logout').click(function () {
        auth.signOut().then(function () {
            $('#welcomeSection').addClass('d-none'); // Ocultar sección de bienvenida
            $('#main-buttons').removeClass('d-none'); // Mostrar botones principales
        }).catch(function (error) {
            console.error("Error al cerrar sesión:", error);
        });
    });

    // Manejo del registro de usuario
    $('#registerNewUserForm').submit(function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto
        const email = $('#registerEmail').val();
        const password = $('#registerPassword').val();

        auth.createUserWithEmailAndPassword(email, password)
            .then(function (userCredential) {
                console.log("Registro exitoso. ¡Bienvenido!");
            })
            .catch(function (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error al registrar:", errorCode, errorMessage);
                alert("Error al registrar: " + errorMessage);
            });
    });

    // Manejo del inicio de sesión
    $('#loginForm').submit(function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        auth.signInWithEmailAndPassword(email, password)
            .then(function (userCredential) {
                console.log("Inicio de sesión exitoso. ¡Bienvenido de nuevo!");
            })
            .catch(function (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error al iniciar sesión:", errorCode, errorMessage);
                alert("Error al iniciar sesión: " + errorMessage);
            });
    });

    // Manejo de eventos para iniciar sesión con Google
    $('#loginGoogleBtn').click(function () {
        //lanza la ventana emergente de google
        auth.signInWithPopup(provider)
            .then(function (result) {
                console.log("Inicio de sesión con Google exitoso. ¡Bienvenido!");
            })
            .catch(function (error) {
                // Manejar errores de autenticación
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error al iniciar sesión con Google:", errorCode, errorMessage);
                alert("Error al iniciar sesión con Google: " + errorMessage);
            });
    });

    // Manejo de eventos para iniciar sesión con Facebook
    // $('#loginFacebookBtn').click(function(){
    //     auth.signInWithPopup(facebookProvider)
    //         .then(function(result){
    //             console.log("Inicio de sesión con Facebook. ¡Bienvenido!");
    //         })
    //         .catch(function(error){
    //             // Manejar errores de autenticación
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             console.error("Error al iniciar sesión con Facebook:", errorCode, errorMessage);
    //             alert("Error al iniciar sesión con Facebook: " + errorMessage);
    //         })
    // });

    // **onAuthStateChanged** --> Observador para cambios en el estado de autenticación
    auth.onAuthStateChanged(function (user) {
        if (user) {
            console.log(user);
            // Usuario autenticado
            const displayName = user.displayName || user.email.split('@')[0];
            const photoURL = user.photoURL || defaultAvatar;

            $('#userName').text(displayName);
            $('#userAvatar').attr('src', photoURL);
            $('#welcomeSection').removeClass('d-none'); //Se muestra la seccion de bienvenida con el nombre y el avatar del usuario.
            $('#main-buttons').addClass('d-none'); // Se ocultan los botones principales
            $('#loginEmailForm').addClass('d-none');// se oculta formulario de sesion.
            $('#registerForm').addClass('d-none'); // se oculta formulario de registro.
            $('#logout').removeClass('d-none'); //Se muestra el botón de cerrar sesión.

            // Cargar los datos al iniciar sesión
            cargarDatos();
        } else {
            // Usuario no autenticado
            $('#welcomeSection').addClass('d-none');
            $('#main-buttons').removeClass('d-none');
            $('#loginEmailForm').addClass('d-none');
            $('#registerForm').addClass('d-none');
            $('#logout').addClass('d-none');
            $('#userName').text('');
            $('#userAvatar').attr('src', defaultAvatar);
        }
    });

    // Manejar el registro de datos
    $('#registroForm').submit(function (event) {
        event.preventDefault();
        console.log("Formulario de registro enviado"); // Agregar esta línea
        const pais = $('#pais').val();
        const ciudad = $('#ciudad').val();
        const habitantes = $('#habitantes').val();
        const lenguaje = $('#lenguaje').val();
        const docId = $(this).data('docId'); // Obtener el ID del documento desde el formulario

        // Validar que los campos no estén vacíos
        if (!pais || !ciudad || !habitantes || !lenguaje) {
            alert("Por favor completa todos los campos.");
            return;
        }
        
        if (docId) {
            // Actualizar el documento existente
            db.collection("paises").doc(docId).update({
                pais: pais,
                ciudad: ciudad,
                habitantes: parseInt(habitantes),
                lenguaje: lenguaje
            })
            .then(function () {
                console.log("Datos actualizados correctamente");
                $('#registroForm')[0].reset(); // Limpiar el formulario
                $(this).removeData('docId'); // Limpiar el ID guardado
                $('#btn-actualizar').addClass('d-none');
                $('#btn-registrar').removeClass('d-none');
                cargarDatos(); // Recargar la lista de países
            })
            .catch(function (error) {
                console.error("Error al actualizar los datos: ", error);
            });
        }else{
            // Enviar los datos a Firestore
            db.collection("paises").add({
                pais: pais,
                ciudad: ciudad,
                habitantes: parseInt(habitantes),
                lenguaje: lenguaje
            })
            .then(function (docRef) {
                console.log("Datos registrados con ID: ", docRef.id);
                // $('#registroForm').trigger('reset'); ambas sentencias son iguales
                $('#registroForm')[0].reset(); // Limpiar el formulario
                cargarDatos(); // Recargar la lista de países
            })
            .catch(function (error) {
                console.error("Error al registrar los datos: ", error);
            });
        }
    });

    // Función para cargar los datos registrados
    function cargarDatos() {
        const tablaPaises = $('#tablaPaises');
        const sinDatos = $('#sinDatos');

        // Limpiar tabla
        tablaPaises.empty();

        // Leer los datos de Firestore
        db.collection("paises").get().then(function (querySnapshot) {
            if (querySnapshot.empty) {
                sinDatos.show(); // Mostrar mensaje si no hay datos
            } else {
                sinDatos.hide(); // Ocultar mensaje si hay datos
                querySnapshot.forEach(function (doc) {
                    const pais = doc.data();
                    tablaPaises.append(`
                        <tr data-id="${doc.id}">
                            <td>${pais.pais}</td>
                            <td>${pais.ciudad}</td>
                            <td>${pais.habitantes}</td>
                            <td>${pais.lenguaje}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-btn" aria-label="Editar registro">Editar</button>
                                <button class="btn btn-sm btn-danger delete-btn" aria-label="Eliminar registro">Eliminar</button>
                            </td>
                        </tr>
                    `);
                });
            }
        }).catch(function (error) {
            console.error("Error al obtener los datos: ", error);
        });
    }

    // Manejar la apertura del modal para editar un registro
    $(document).on('click', '.edit-btn', function () {
        const tr = $(this).closest('tr');
        const docId = tr.data('id');

        // Obtener los datos actuales del registro
        db.collection("paises").doc(docId).get()
            .then(function (doc) {
                if (doc.exists) {
                    const data = doc.data();
                    $('#editDocId').val(doc.id);
                    $('#editPais').val(data.pais);
                    $('#editCiudad').val(data.ciudad);
                    $('#editHabitantes').val(data.habitantes);
                    $('#editLenguaje').val(data.lenguaje);
                    
                    // Mostrar el modal
                    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
                    editModal.show();
                } else {
                    console.log("No se encontró el documento!");
                    alert("No se encontró el registro.");
                }
            })
            .catch(function (error) {
                console.error("Error al obtener el documento: ", error);
                alert("Error al obtener el registro: " + error.message);
            });
    });

    // Manejar el envío del formulario de edición
    $('#editForm').submit(function (event) {
        event.preventDefault();

        const docId = $('#editDocId').val();
        const pais = $('#editPais').val();
        const ciudad = $('#editCiudad').val();
        const habitantes = $('#editHabitantes').val();
        const lenguaje = $('#editLenguaje').val();

        // Actualizar el documento en Firestore
        db.collection("paises").doc(docId).update({
            pais: pais,
            ciudad: ciudad,
            habitantes: parseInt(habitantes),
            lenguaje: lenguaje
        })
        .then(function () {
            console.log("Registro actualizado con ID: ", docId);
            // Cerrar el modal
            const editModalEl = document.getElementById('editModal');
            const editModal = bootstrap.Modal.getInstance(editModalEl);
            editModal.hide();
            // Recargar los datos
            cargarDatos();
        })
        .catch(function (error) {
            console.error("Error al actualizar el registro: ", error);
            alert("Error al actualizar el registro: " + error.message);
        });
    });

    // Manejar la eliminación de un registro
    $(document).on('click', '.delete-btn', function () {
        const tr = $(this).closest('tr');
        const docId = tr.data('id');

        if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
            db.collection("paises").doc(docId).delete()
                .then(function () {
                    console.log("Registro eliminado con ID: ", docId);
                    tr.remove(); // Eliminar la fila de la tabla
                    // Verificar si la tabla está vacía
                    if ($('#tablaPaises tr').length === 0) {
                        $('#sinDatos').show();
                    }
                })
                .catch(function (error) {
                    console.error("Error al eliminar el registro: ", error);
                    alert("Error al eliminar el registro: " + error.message);
                });
        }
    });

});