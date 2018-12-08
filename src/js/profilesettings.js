Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var passwordText;
var changeText;
var repeatText;
var newText;
var saveChangeText;
var changePBText;
var changeTeamText;
var createTeamText;
var teamNameText;
var createText;

var passwordChange;
var notSameText;
var premiumText;
var yearlyText;
var trialText;
var newPbAlert;
var alertName;

if (language == "NO") {

    passwordText = "passord";
    changeText = "Endre";
    repeatText = "Gjenta";
    newText = "Nytt";
    saveChangeText = "Lagre endring";
    changePBText = "Endre profilbilde";
    changeTeamText = "Bytt lag";
    createTeamText = "Opprett nytt lag";
    teamNameText = "Lagnavn";
    createText = "Opprett lag";
    premiumText = "2,92 EUR/måned*";
    yearlyText = "* betales årlig";
    trialText = "Start din prøveperiode og test Premium gratis i 30 dager";
    newPbAlert = "Ditt nye profilbilde ble lastet opp. Du må logge ut for at endringen skal tre i kraft.";
    alertName = "Skriv inn et lagnavn før du oppretter det nye laget";

} else {

    passwordText = "password";
    changeText = "Change";
    repeatText = "Repeat";
    newText = "New";
    saveChangeText = "Save change";
    changePBText = "Change profile picture";
    changeTeamText = "Change team";
    createTeamText = "Create a new team";
    teamNameText = "Team name";
    createText = "Create team";
    premiumText = "2.92 EUR/month*";
    yearlyText = "* payed yearly";
    trialText = "Start your 30 day free trial and recieve the benefits of Premium before paying."
    newPbAlert = "Your new profile picture was uploaded. You have to log out before you are able to see the change.";
    alertName = "Fill in the name of your team to be able to create it";

}

function handleParseError(err) {
    switch (err.code) {
        case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut();
            location.href = "registration.html";
            break;
    }
}

function profile() {

    var outputProfile = "";
    var outputImg = "";
    var user = Parse.User.current();
    var userImg = "";
    var noUserImg = "";
    if (user.get("profileImage")) {
        var brukerPB = user.get("profileImage");
        var PBUrl = brukerPB.url();
        userImg = "<img src='" + PBUrl + "'>";
    } else {
        noUserImg = '<img src="./src/img/User_Big.jpeg">';
    }
    outputImg += "<div id=\"userPB\">";
    outputImg += userImg;
    outputImg += noUserImg;
    outputImg += "</div>"
    $("#profile-img").html(outputImg);

    var Query = Parse.Object.extend("Teams");
    var query = new Parse.Query(Query);
    query.equalTo("objectId", klubbID);
    query.find({
        success: function (results) {

            for (var i in results) {
                var teamName = results[0].get("Name");
                var username = Parse.User.current().get("name");
                outputProfile += '<p id="user-txt">' + username + '</p>';
                outputProfile += '<p id="team-txt">' + teamName + '</p>';

            }
            $("#list-profile").append(outputProfile);
        },
        error: function (err) {
            handleParseError(err);
        }

    });


    function changeSettings() {

        var outputSettings = "";

        outputSettings += '<h4 id="pass-txt" onclick="showhide()">' + changeText + ' ' + passwordText + '</h4>';
        outputSettings += '<div id="changePass" style="display: none;">';
        outputSettings += '<input type="password" name="password" id="newpass" placeholder="' + newText + ' ' + passwordText + '"/>';
        outputSettings += '<input type="password" name="password" id="repeatpass" placeholder="' + repeatText + ' ' + passwordText + '"/>';
        outputSettings += '<ul id="list-pass"></ul>';
        outputSettings += '<button onclick="changePassword()" id="submitpass">' + saveChangeText + '</button>';
        outputSettings += '</div>';
        outputSettings += '<ul id="list-teams"></ul>';
        outputSettings += '<h4>' + changePBText + ':</h4>';
        outputSettings += '<input id="pb-file" class="pbInput" onChange="changePB(this.value);" type="file"/>';
        $("#list-settings").html(outputSettings);
    }
    changeSettings();
}

profile();

function showhide() {
    if (document.getElementById('changePass').style.display == 'none') {
        document.getElementById('changePass').style.display = 'block';
        //document.getElementById('date-pick').style.display = 'none';
    } else if (document.getElementById('changePass').style.display == 'block') {
        document.getElementById('changePass').style.display = 'none';
        //document.getElementById('date-pick').style.display = 'block';
    }
    return false;
}

function changePassword() {

    var password1 = document.getElementById("newpass").value;
    var password2 = document.getElementById("repeatpass").value;

    var outputPass = "";
    outputPass += '<div id="passchange">';

    if (password1 == password2) {

        var user = Parse.User.current();
        user.set("password", password1);
        user.save(null, {
            success: function () {}
        });
        outputPass += '<p>Passord er endret</p>';
    } else {
        outputPass += '<p>Feltene inneholder ikke samme passord</p>';
    }

    outputPass += '</div>';

    $("#list-pass").html(outputPass);
}

function changeTeam() {

    var user = Parse.User.current();
    var userId = user.get("username");
    var users = Parse.Object.extend("User");
    var queryUsers = new Parse.Query(users);
    queryUsers.equalTo("username", userId);
    queryUsers.include("teams");
    queryUsers.find({
        success: function (results) {
            for (var i in results) {
                var outputTeams = "";
                var team = results[i].get("teams");
                outputTeams += '<div id="change-team">';
                outputTeams += '<h4>' + changeTeamText + '</h4>';
                outputTeams += '<select id="select-team" onchange="saveChange()">';
                for (var k = 0; k < team.length; k++) {
                    var teamName = team[k].get("Name");
                    var teamid = team[k].id;

                    if (teamid == klubbID) {
                        outputTeams += '<option id="' + teamid + '" selected>' + teamName + '</option>';
                    } else {
                        outputTeams += '<option id="' + teamid + '">' + teamName + '</option>';
                    }

                }
                outputTeams += '</select>';
                outputTeams += '</div>';

                outputTeams += '<div id="create-team" onclick="showCreator()" class="creator-box">';
                outputTeams += '<i class="material-icons">add_circle_outline</i>';
                outputTeams += '<h2>' + createTeamText + '</h2>';
                outputTeams += '</div>';
                $("#list-teams").html(outputTeams);

            }

        },
        error: function (error) {
            console.log("Post Save with File Error:" + error.message);
            handleParseError();
        }
    });

}
changeTeam();

function showCreator() {

    var output = "";

    output += '<div class="creator-box" id="creator-box">';
    output += '<h1>' + createTeamText + '</h1>';
    output += '<input type="text" id="nameInput" placeholder="' + teamNameText + '"/>';
    output += '<form>';
    output += '<br>Basic<input type="radio" name="radio" checked id="basic-sub" onclick="hidePremium()">';
    output += '<br>Premium<input type="radio" name="radio" id="premium-sub" onclick="showPremium()">';
    output += '</form>';
    output += '<div id="premium" style="display:none">';
    output += '<h2>' + premiumText + '</h2>';
    output += '<h3>' + yearlyText + '</h3>';
    output += '<h1>' + trialText + '</h1>';
    output += '</div>';
    output += '<button onclick="createTeam()" id="creator-button">' + createText + '</button>';
    output += '</div>';

    $("#createTeam").html(output);

    document.getElementById('createTeam').style.display = "block";

}

function showPremium() {
    document.getElementById("premium").style.display = "block";
    document.getElementById("creator-button").style["margin-top"] = "20px";
}

function hidePremium() {
    document.getElementById("premium").style.display = "none";
    document.getElementById("creator-button").style["margin-top"] = "40px";
}

function createTeam() {

    var premium = false;
    if (document.getElementById('premium-sub').checked) {
        premium = true;
    } else if (document.getElementById('basic-sub').checked) {
        premium = false;
    }

    var teamName = document.getElementById('nameInput').value;
    console.log(teamName);

    if (teamName.length > 0) {

        var userId = Parse.User.current().id;
        Parse.Cloud.run("registerTeam", {
            teamName: teamName,
            userId: userId
        }).then(function (response) {

            alert("Yay! You have just created a new team.");
            
            if(premium == true) {
                location.href = "payments.html";
            }else {
                window.location.reload();
            }

            
        });
    } else {
        alert(alertName);
    }
}

$(document).click(function (event) {
    if (!$(event.target).closest('.creator-box').length) {
        if ($('#creator-box').is(":visible")) {

            $("#createTeam").html('');
            document.getElementById('createTeam').style.display = "none";
        }
    }
});


function saveChange() {
    var team = document.getElementById('select-team');
    var type = team.options[team.selectedIndex].id;

    localStorage.setItem('clubId', type);

    window.location = "profile.html";

}


function changePB() {

    var user = Parse.User.current();

    var bilde = document.getElementById("pb-file");

    var file = bilde.files[0];

    var reader = new FileReader();
    reader.onloadend = function () {
        var base64 = reader.result;
        console.log(base64);
        var newFile = new Parse.File("img.txt", {
            base64: base64
        });

        newFile.save({
            success: function () {
                console.log("YAYA");
            },
            error: function (file, error) {
                console.log("Files Save Error:" + error.message);
            }
        }).then(function (theFile) {
            user.set("profileImage", theFile);
            user.set("profileImage_small", theFile);
            user.save({
                success: function () {
                    alert(newPbAlert);
                    location.href = "profile.html";
                },
                error: function (error) {
                    console.log("Post Save with File Error:" + error.message);
                    handleParseError();
                }
            });
        });
    }
    reader.readAsDataURL(file);

}
