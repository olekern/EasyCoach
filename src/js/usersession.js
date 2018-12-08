Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';


function checkLogin() {
        if (Parse.User.current) {
            $("#brukernavn").html(Parse.User.current().get("name"));
        }
        else {
            $("#brukernavn").html("");
            location.href = "registration.html";
            }
        }

checkLogin();

function logOut() {
            Parse.User.logOut(console.log("Logger ut"));
            location.href = "registration.html";
    
        }