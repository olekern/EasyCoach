Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var mainClass = "data_umCaWls7lR_";
var membersClass = "Members";

var role;

function roles() {
    var Query = Parse.Object.extend(mainClass + membersClass);
    var query = new Parse.Query(Query);
    query.find().then(function () {}, function (err) {
        handleParseError(err);
    });

    var outputRole = "";
    var outputReq = "";
    query.equalTo("user", Parse.User.current());
    query.find({
        success: function (objects) {
            for (var i in objects) {
                var team = objects[i].get("team");
                if (team === klubbID) {
                    role = objects[i].get("role");
                    if (role == "admin") {} else if (role == "trener") {
                        //document.getElementById("forberedelser").remove();
                        //document.getElementById("evaluering").remove();
                    } else {
                        document.getElementById("survey").remove();
                        document.getElementById("calendar").remove();
                    }
                }
            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
            handleParseError();
        }
    });
}
roles();
