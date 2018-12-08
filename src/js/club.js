Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var mainClass = "data_umCaWls7lR_";
var membersClass = "Members";

function checkLogin() {
    if (Parse.User.current) {
        $("#brukernavn").html(Parse.User.current().get("name"));
    } else {
        $("#brukernavn").html("");
        location.href = "registration.html";
    }
}

var currentUser = Parse.User.current();

function logOut() {
    Parse.User.logOut(
        console.log("Logger ut"));

}


function chooseClub(team, id) {

    var currentUser = Parse.User.current();
    var bruker = Parse.User.current().id;

    var alreadySentText;
    if (language == "NO") {
        alreadySentText = "Du har allerede sendt en forspørsel til dette laget";
    } else {
        alreadySentText = "You have already sent a request to this team";
    }

    var Club = Parse.Object.extend(mainClass + membersClass);
    var clubQuery = new Parse.Query(Club);
    clubQuery.equalTo("team", id)
    clubQuery.find({

        success: function (results) {

            var truefalse = new Array();
            truefalse = [];
            for (var j in results) {
                var userId = results[j].get("user").id;
                if (userId == bruker) {
                    truefalse.push(true);
                } else {
                    truefalse.push(false);
                }
            }
            var alreadySent = $.inArray(true, truefalse);
            if (alreadySent != -1) {
                alert(alreadySentText);
                location.href = "noteam.html";
            } else {
                var club = new Club();
                club.set("user", currentUser)
                club.set("accepted", false);

                club.save(null, {
                    success: function (club) {
                        console.log("Fantastisk");
                        location.href = "noteam.html";
                    },
                    error: function (club, error) {
                        console.log("Error:" + error.message);
                    }
                });
            }
        }

    });


}


var Teams = Parse.Object.extend("Teams");

function getTeams() {

    var requestMemb;
    var alreadyMemb;
    var sentText;
    if (language == "NO") {
        requestMemb = "Forespørr medlemskap";
        alreadyMemb = "Allerede medlem";
        sentText = "Forespørsel sendt";
    } else {
        requestMemb = "Request membership";
        alreadyMemb = "Already a member";
        sentText = "Request sent";
    }

    var currentTeam = Parse.User.current().get("teams");
    var currentTeamsArray = new Array();
    for (var k in currentTeam) {

        var currentTeamId = currentTeam[k].id;

        currentTeamsArray.push(currentTeamId);
    }

    var query = new Parse.Query(Teams);
    query.find({

        success: function (results) {
            var output = "";
            for (var i in results) {

                var teams = results[i].get("Name");
                var teamId = results[i].id;


                var sameTeam = $.inArray(teamId, currentTeamsArray);
                if (sameTeam != -1) {
                    output += '<div class="lagVelg" id="orange">';
                    output += "<div id=\"box1\">";
                    output += "<h4>" + teams + "</h4>";
                    output += "</div>";
                    output += "<div id=\"box2\">";
                    output += '<button name="' + teams + '" id="' + teamId + '" type="button" >' + alreadyMemb + '</button>';
                    output += "</div>";
                    output += "</div>";
                } else {

                    output += "<div class=\"lagVelg\">";
                    output += "<div id=\"box1\">";
                    output += "<h4>" + teams + "</h4>";
                    output += "</div>";
                    output += "<div id=\"box2\">";
                    output += '<button name="' + teams + '" id="' + teamId + '" type="button" onclick="chooseClub(name, id);">' + requestMemb + '</button>';
                    output += "</div>";
                    output += "</div>";
                }


            }
            $("#list-posts").html(output);
        },
        error: function (error) {
            output += "<div id =\"lagvelg\">";
            output += "<h4>" + "Du er allerede med i en klubb" + "</h4>";
            output += "</div>";
            console.log("Query error:" + error.message);
        }
    });

}
getTeams();

function submitCode() {
    var code = document.getElementById("password").value;

    var noCode;
    if (language == "NO") {
        noCode = "Passordet kan ikke være blankt. Velg laget ditt fra listen nedenfor hvis du ikke har fått et passord fra treneren din.";
    } else {
        noCode = "The password cannot be empty. Choose your team from the list below if your coach has not given you a password.";
    }

    if ((code == "") || (code == " ")) {

        alert(noCode);
    } else {

        var Teams = new Parse.Object.extend("Teams");
        var queryTeams = new Parse.Query(Teams);

        queryTeams.equalTo("password", code);
        queryTeams.find({

            success: function (objects) {

                for (var k in objects) {

                    var thisUser = Parse.User.current();
                    var userId = Parse.User.current().id;
                    var clubId = objects[k].id;
                    var subscription = objects[k].get("subscription");

                    if (thisUser.get("teams")) {

                        var teamIds = new Array();
                        var userTeams = thisUser.get("teams");
                        for (var j in userTeams) {
                            var id = userTeams[j].id;
                            teamIds.push(id);
                        }
                        var arrayContained = $.inArray(clubId, teamIds);
                        if (arrayContained == -1) {
                            setPlayersTeam(userId, clubId, subscription);
                        } else {
                            localStorage.setItem("clubId", clubId);
                            location.href = "home.html";
                        }

                    } else {
                        setPlayersTeam(userId, clubId, subscription);
                    }



                }

            },
            error: function (error) {
                console.log(error.code + ": " + error.message);
            }
        });

    }

}


function setPlayersTeam(userId, teamId, subscription) {

    var query = Parse.Object.extend(mainClass + membersClass);
    var queryMembers = new Parse.Query(query);

    queryMembers.include("user");
    queryMembers.equalTo("team", teamId);
    queryMembers.find({
        success: function (results) {

            var user = Parse.User.current();

            var teamPointer = {
                __type: 'Pointer',
                className: 'Teams',
                objectId: teamId
            };

            var checkUserArray = new Array();

            var memberAmount = 0;
            for (var i in results) {

                var userid = results[i].get("user").id;
                var userRole = results[i].get("role");
                if (userid == user.id) {
                    checkUserArray.push(true);
                } else {
                    checkUserArray.push(false);
                }

                if (results[i].get("accepted") == true) {
                    if ((userRole == "trener") || (userRole == "spiller") || (userRole == "admin")) {
                        memberAmount++;
                    }
                }

            }
            var alreadyIn = $.inArray(true, checkUserArray);
            if (alreadyIn != -1) {
                user.set("team", teamPointer);
                user.addUnique("teams", teamPointer);
                user.save(null, {
                    success: function () {
                        localStorage.setItem("clubId", teamId);
                        Parse.User.logOut();
                        location.href = "registration.html";
                    }
                });
            } else {

                if ((memberAmount < 25) || (subscription == "premium")) {
                    var newMember = new query();


                    newMember.set("user", user);
                    newMember.set("accepted", true);
                    newMember.set("role", "spiller");
                    newMember.set("team", teamId)
                    newMember.save(null, {

                        success: function () {

                            user.set("team", teamPointer);
                            user.addUnique("teams", teamPointer);
                            user.save(null, {
                                success: function () {
                                    localStorage.setItem("clubId", teamId);
                                    Parse.User.logOut();
                                    location.href = "registration.html";
                                }
                            });
                        },
                        error: function (error) {

                        }

                    });
                } else {
                    var errorMessage;
                    if (language == "NO") {
                        errorMessage = "Det ser ut til at laget du ønsker å bli med i er fullt. En trener i laget må oppgradere det til Premium for å kunne legge til flere medlemmer.";
                    } else {
                        errorMessage = "It looks as though the team is filled up. A coach in the team has to upgrade it to Premium in order to accept  more members.";
                    }
                    alert(errorMessage);
                }
            }
        }
    });

}
