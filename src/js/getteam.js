Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var klubbID;
if (localStorage.getItem("clubId")) {
    if (Parse.User.current().get("team") == undefined) {
        window.location = "club.html";
        localStorage.removeItem('clubId');
    } else {
        /*
        var teams = Parse.User.current().get("teams");
        var teamArray = new Array();
        for (var i in teams) {
            var teamid = teams[i].id;
            teamArray.push(teamid);
        }
        if ($.inArray(klubbID, teamArray) != -1) {

            localStorage.removeItem('clubId');

            klubbID = Parse.User.current().get("team").id;
            localStorage.setItem('clubId', klubbID);
        } else {
        */
            klubbID = localStorage.getItem("clubId");
       // }
    }
} else {
    if (Parse.User.current().get("team") == undefined) {
        window.location = "club.html";
    } else {
        klubbID = Parse.User.current().get("team").id;
        localStorage.setItem('clubId', klubbID);
    }
}
