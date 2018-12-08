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
                role = objects[i].get("role");
                var team = objects[i].get("team");
                if (team === klubbID) {
                    if (role == "spiller") {
                        location.href = "home.html";
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
