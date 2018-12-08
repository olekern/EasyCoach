Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

localStorage.removeItem("clubId");

function checkLogin() {
    if (Parse.User.current) {
        $("#brukernavn").html(Parse.User.current().get("name"));
    } else {
        $("#brukernavn").html("");
    }
}

var currentUser = Parse.User.current();
if (currentUser) {
    location.href = "home.html";
} else {

}

checkLogin();

function logOut() {
    Parse.User.logOut(console.log("Logging out"));

}

function logIn() {
    var name = document.login.elements[0].value;
    var pass = document.login.elements[1].value;
    
    var loginError = "";

    Parse.User.logIn(name, pass, {
        success: function () {
            window.location = "home.html";
        },
        error: function (error) {
            console.log("Innlogging feilet:" + error.message);
            loginError += '<p>There was an error logging in. Check if your email and password are correct. </p>'
            $("#list-error").html(loginError);
        }
    })
    return false;
}

function signUp() {
    var name = document.signup.elements[0].value;
    var mail = document.signup.elements[1].value;
    var pass = document.signup.elements[2].value;
    
    var user = new Parse.User();
    user.set("name", name);
    user.set("email", mail);
    user.set("username", mail)
    user.set("password", pass);

    user.signUp(null, {
        success: function (user) {
            console.log("New user signed up successfully!");
            window.location = "club.html";

            function logIn() {
                var email = mail;
                var passord = pass;



                Parse.User.logIn(email, passord, {
                    success: function () {
                        console.log("Innlogging  suksessfull");
                        window.location = "home.html";
                    },
                    error: function () {
                        console.log("Innlogging feilet:" + error.message);
                    }
                })
                return false;
            }
        },
        error: function (user, error) {
            console.log("Error: " + error.code + "" + error.message);
            alert("The signup was not successfull: " + error.message);
        }
    });
    return false;
}



function forgottenPassword() {

    var mail = document.login.elements[0].value;

    var noMail;
    var validMail;
    var successMail;

    if (language == "NO") {
        noMail = "Skriv inn mailadressen for å tilbakestille passordet";
        validMail = "Skriv inn en gyldig mailadresse";
        successMail = "Du skal nå ha fått en mail med instruksjoner for hvordan du kan tilbakestille passordet. Fikk du ingen mail? Sjekk mappen for søppelpost, den kan ha blitt sortert dit feilaktig av mail-serveren din.";
    } else {
        noMail = "Insert email adress to reset your password";
        validMail = "Insert a valid email adress";
        successMail = "An email was sent to you with further instructions on how to reset your password. Did you not recieve an email? Check your spam folder, it may be there.";
    }

    if (mail == "") {
        alert(noMail);
    } else {
        Parse.User.requestPasswordReset(mail, {
            success: function () {
                alert(successMail);
            },
            error: function (error) {
                alert(validMail);
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }

}
