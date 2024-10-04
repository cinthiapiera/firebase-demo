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
    
    // Crear una instancia del proveedor de Google
    const provider = new firebase.auth.GoogleAuthProvider();

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
                // console.log(result);
                // Resultado de la autenticación exitoso
                // const user = result.user;
                // $('#userName').text(user.displayName || user.email.split('@')[0]); // Mostrar nombre de usuario
                // $('#welcomeSection').removeClass('d-none'); // Mostrar sección de bienvenida
                // $('#main-buttons').addClass('d-none'); // Ocultar botones principales
                // $('#loginEmailForm').addClass('d-none'); // Ocultar formulario de login por correo si está visible
                // $('#registerForm').addClass('d-none'); // Ocultar formulario de registro si está visible
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

    // **onAuthStateChanged**
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
});