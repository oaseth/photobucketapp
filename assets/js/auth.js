// A function to show alerts
function showAlert(div, type, msg) {
    var divToUse = document.getElementById(div)
    divToUse.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert"> ' + msg + ' <button type = "button" class="close" data-dismiss="alert" aria-label="Close" ><span aria-hidden="true">&times;</span></button></div>'
}


// A function to sign out a user when the logout button is clicked
$("#logoutBtn").on("click", (e) => {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
})


// User authentication
var currentUsersEmail
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        currentUsersEmail = user.email;
        document.getElementById('logoutBtn').style.display = 'block'
        document.getElementById('not-logged-in').style.display = 'none'
        document.getElementById('logged-in').style.display = 'block'

        mapinit();
        installalert()
        // ...
    } else {
        // User is signed out
        document.getElementById('logoutBtn').style.display = 'none'
        document.getElementById('not-logged-in').style.display = 'block'
        document.getElementById('logged-in').style.display = 'none'
        // ...
    }
});


// Signing up a new user
$('#sign-up-form').submit((e) => {
    e.preventDefault()
    var email = document.querySelector('#sign-up-email').value
    var pswd1 = document.querySelector('#sign-up-password1').value
    var pswd2 = document.querySelector('#sign-up-password2').value

    if (pswd1 == pswd2) {
        firebase.auth().createUserWithEmailAndPassword(email, pswd1)
            // .then((userCredential) => {
            //     // Signed in 
            //     var user = userCredential.user;
            //     // ...
            // })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                showAlert('sign-up-alerts', 'warning', errorMessage)
                // ..
            });
    } else {
        showAlert('sign-up-alerts', 'warning', 'The passwords are not matching!!')
    }
})


// Signing in an existing user
$('#sign-in-form').submit((e) => {
    e.preventDefault()
    var email = document.querySelector('#sign-in-email').value
    var pswd = document.querySelector('#sign-in-password').value
    firebase.auth().signInWithEmailAndPassword(email, pswd)
        // .then((userCredential) => {
        //     // Signed in 
        //     var user = userCredential.user;
        //     // ...
        // })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            showAlert('sign-in-alerts', 'warning', errorMessage)
            // ..
        });
})

// A function to create a popup to ask the user to install the app
function installalert() {
    if (deferredPrompt) {
        deferredPrompt.prompt()

        deferredPrompt = null
    }
}