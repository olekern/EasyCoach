var h2;
var h4;
var p;

if(language =="NO"){
    h2 = "For øyeblikket har du ingen lag";
    h4 = "Frykt ikke, treneren din godtar deg snart";
    p = "Logg ut";
}else{
    h2 = "You are not member in any team at the moment";
    h4 = "Wait for approval from the coach";
    p = "Log out";
}

$("#noteam").html(h2);
$("#soonaccept").html(h4);
$("#logout").html(p);

Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
        Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';
        
        var currentUser = Parse.User.current();
        function checkLogin() {
            if (Parse.User.current) {
                if(currentUser.get("team") == undefined){
                    
                }else{
                    location.href = "home.html";
                }
            } else {
                location.href = "registration.html";
            }
        }
        
        checkLogin();

        function logOut() {
            Parse.User.logOut(
                console.log("Logger ut"));
            location.href  = "registration.html";

        }
