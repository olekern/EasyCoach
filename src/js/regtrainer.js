var login;
var loggedInAs;
var notYou;
var toCreate;
var password;
var email;
var noUser;
var fullName;
var register;
var alreadyUser;
if (language == "NO") {
    login = "Logg inn";
    loggedInAs = "Logget inn som";
    notYou = "Er ikke denne brukeren deg? Logg ut";
    toCreate = "for å opprette lag";
    password = "Passord";
    email = "Mail";
    noUser = "Har du ikke en bruker? Registrer deg her";
    fullName = "Fullt navn";
    register = "Registrer";
    alreadyUser = "Har allerede en bruker? Logg inn";
    
} else {
    login = "Log in";
    loggedInAs = "Logged in as";
    notYou = "Is this not your user? Log out";
    toCreate = "to create a team";
    password = "Password";
    email = "E-mail";
    noUser = "Do you not have a user? Register here"
    fullName = "Full name";
    register = "Register";
    alreadyUser = "Already have a user? Log in";
}

function show() {
    if (document.getElementById('form-input').style.display == 'none') {
        document.getElementById('form-input').style.display = 'block';
    }
    return false;
}

function hide() {
    if (document.getElementById('form-input').style.display == 'block') {
        document.getElementById('form-input').style.display = 'none';
    }
    return false;
}

Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

function logInUser() {
    var outputLog = "";
    if (Parse.User.current()) {
        var name = Parse.User.current().get("name");
        outputLog += '<div id="logged-in">';
        outputLog += '<h3>' + loggedInAs + ': <span>' + name + '</span></h3>';
        outputLog += '<h5 onclick="logOut()">' + notYou + '.</h5>';
        outputLog += '</div>';
    } else {
        outputLog += '<div id="logged-in" class="nohide">';
        outputLog += '<h3 onclick="showLogIn()" id="logToCreate">' + login + ' ' + toCreate + '</h3>';
        outputLog += '</div>';
    }

    $("#list-log").html(outputLog);

}
logInUser();

function showLogIn() {

    var outputLog = "";
    outputLog += '<div id="log-form" class="form">';
    outputLog += '<div id="form-input" class="nohide" style="display: block;">';
    outputLog += '<form name="login">';
    outputLog += '<input type="text" class="text" name="username" placeholder="' + email +'"/>';
    outputLog += '<input type="password" class="text" name="password" placeholder="' + password + '"/>';
    outputLog += '</form>';
    outputLog += '<button onclick="logIn()">' + login + '</button>';

    outputLog += '<h4 onclick="createForm()">' + noUser + '.</h4>';
    outputLog += '</div>';
    outputLog += '</div>';


    
    $("#list-form").html(outputLog);
    
    document.getElementById('background').style.display = "block";
}

function createForm() {

    var outputLog = "";
    outputLog += '<div id="create-coach" class="form">';
    outputLog += '<div class="nohide">';
    outputLog += '<form name="registration">';
    outputLog += '<input type="text" class="text" name="coachName" placeholder="' + fullName + '"/>';
    outputLog += '<input type="text" class="text" name="coachMail" placeholder="' + email +'"/>';
    outputLog += '<input type="password" class="text" name="coachPass" placeholder="' + password +'"/>';
    outputLog += '</form>';
    outputLog += '<button onclick="newCoach()">' + register + '!</button>';
    outputLog += '<h4 onclick="showLogIn()">' + alreadyUser + '.</h4>';
    outputLog += '</div>';
    outputLog += '</div>';

    

    $("#list-form").html(outputLog);
    
    document.getElementById('background').style.display = "block";
}

function logIn() {
    var name = document.login.elements[0].value;
    var pass = document.login.elements[1].value;
    var loginError = "";
    Parse.User.logIn(name, pass, {
        success: function () {
            window.location.reload();
        },
        error: function (error) {
            console.log("Innlogging feilet:" + error.message);
            alert('Looks as if the email or password may be incorrect');
        }
    })
    return false;
}

function logOut() {
    Parse.User.logOut();
    window.location.reload();

}

function newCoach() {
    var coachName = document.registration.elements[0].value;
    var coachMail = document.registration.elements[1].value;
    var coachPass = document.registration.elements[2].value;

    if ((coachName.length == 0) || (coachMail.length == 0) || (coachPass.length == 0)) {
        alert('Har du fylt ut alle feltene?');
    } else {
        console.log(coachMail);
        console.log(coachName);
        console.log(coachPass);
        var user = new Parse.User();
        user.set("name", coachName);
        user.set("email", coachMail);
        user.set("username", coachMail)
        user.set("password", coachPass);
        user.signUp(null, {
            success: function (user) {
                console.log("New user signed up successfully!");

                function logIn() {
                    var email = coachMail;
                    var passord = coachPass;



                    Parse.User.logIn(email, passord, {
                        success: function () {
                            console.log("Innlogging  suksessfull");
                            window.location.reload();
                        },
                        error: function () {
                            console.log("Innlogging feilet:" + error.message);
                        }
                    })
                    return false;
                }
                logIn();
            },
            error: function (user, error) {
                console.log("Error: " + error.code + "" + error.message);
                alert("Her skjedde det visst en liten feil: " + error.message);
            }
        });
        return false;
    }
}

function getInfo() {

    if (Parse.User.current()) {

        var teamName = document.regteam.elements[0].value;
        if ((teamName.length == 0)) {
            alert("Du må fylle inn et lagnavn for å opprette et nytt lag.");
        } else {

            if (document.getElementById('terms').checked) {
                document.getElementById('reg').style.cssText = "display: none;";

                var userId = Parse.User.current().id;
                Parse.Cloud.run("registerTeam", {
                    teamName: teamName,
                    userId: userId
                }).then(function (response) {
                    document.getElementById('reg').style.cssText = "display: block;";
                    alert("Yay! You have just created a new team. Log in to start using it.");
                    
                    if(language == "NO"){
                        Parse.User.logOut();
                        location.href = "../registration.html";
                    }else{
                        Parse.User.logOut();
                        location.href = "registration.html";
                    }
                });

                return false;

            } else {
                alert('Du må bekrefte at du har lest og akseptert våre vilkår og betingelser før du kan registrere deg.');
            }
        }

    } else {
        alert('Ser ikke ut som at du er logget inn. Opprett en ny bruker eller logg inn med en eksisterende.');
    }

}
