Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';


if (Parse.User.current()) {
    document.getElementById("payTerms").style.display = "block";
    if ($('#terms').is(":checked")) {
        document.getElementById("customButton").style.display = "block";
        document.getElementById("acceptFirst").style.display = "none";
    } else {
        document.getElementById("customButton").style.display = "none";
        document.getElementById("acceptFirst").style.display = "block";
    }
} else {
    document.getElementById("customButton").style.display = "none";
    document.getElementById("payTerms").style.display = "none";
}

if ($('#terms').is(":checked")) {
    document.getElementById("customButton").style.display = "block";
    document.getElementById("acceptFirst").style.display = "none";
}

var login;
var loggedInAs;
var notYou;
var toCreate;
var password;
var emailText;
var noUser;
var fullName;
var register;
var alreadyUser;
if (language == "NO") {
    login = "Logg inn";
    loggedInAs = "Logget inn som";
    notYou = "Er ikke denne brukeren deg? Logg ut";
    toCreate = "for å oppgradere ditt lag";
    password = "Passord";
    emailText = "Mail";
    noUser = "Har du ikke en bruker? Registrer deg her";
    fullName = "Fullt navn";
    register = "Registrer";
    alreadyUser = "Har allerede en bruker? Logg inn";

} else {
    login = "Log in";
    loggedInAs = "Logged in as";
    notYou = "Is this not your user? Log out";
    toCreate = "to upgrade your team";
    password = "Password";
    emailText = "E-mail";
    noUser = "Do you not have a user? Register here."
    fullName = "Full name";
    register = "Register";
    alreadyUser = "Already have a user? Log in";
}

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
    outputLog += '<input type="text" class="text" name="username" placeholder="' + emailText + '" onkeydown="if (event.keyCode == 13) document.getElementById("password-input").focus();/>';
    outputLog += '<input type="password" id="password-input" class="text" name="password" placeholder="' + password + '" onkeydown="if (event.keyCode == 13) document.getElementById("loginButton").click()"/>';
    outputLog += '</form>';
    outputLog += '<button id="loginButton" onclick="logIn()">' + login + '</button>';

    outputLog += '</div>';
    outputLog += '</div>';



    $("#list-form").html(outputLog);

    document.getElementById('logged-in').style.display = "none";
}

function removeLogin() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    if (url.searchParams.get("teamId")) {
        $("#list-log").html('');
        $("#list-form").html('');

        document.getElementById("payTerms").style.display = "block";

    } else {
        if (Parse.User.current()) {

        } else {
            document.getElementById("customButton").style.display = "none";
            document.getElementById("acceptFirst").style.display = "block";

            $("#upgrade-title").html("Start your free 30 day trial");
            $("#description").html("Unlock new features on EasyCoach by upgrading your team to Premium. Start your 30 day free trial today and let the whole team recieve the benefits of the Premium team.");
        }
    }


}
removeLogin();

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
            alert('Seems as though the email or password does not correspond.');
        }
    })
    return false;
}

function logOut() {
    Parse.User.logOut(
        console.log("Logging out"));
    window.location.reload();

}

function getTeams() {

    var outputTeams = "";

    if (Parse.User.current()) {

        var user = Parse.User.current();
        var userId = user.get("username");
        var users = Parse.Object.extend("User");
        var queryUsers = new Parse.Query(users);
        queryUsers.equalTo("username", userId);
        queryUsers.include("teams");
        queryUsers.find({
            success: function (results) {

                var teamLength = results.length;
                if (teamLength == 0) {

                }
                for (var i in results) {
                    var team = results[i].get("teams");
                    outputTeams += '<div id="change-team">';
                    outputTeams += '<h1>Select your team</h1>';
                    outputTeams += '<select id="select-team" onclick="changeTeam()">';
                    for (var k = 0; k < team.length; k++) {
                        var teamName = team[k].get("Name");
                        var teamid = team[k].id;
                        var subscription = team[k].get("subscription");
                        if (subscription != "premium") {
                            if (teamid == klubbID) {
                                outputTeams += '<option id="' + teamid + '" selected>' + teamName + '</option>';
                            } else {
                                outputTeams += '<option id="' + teamid + '">' + teamName + '</option>';
                            }
                        }

                    }
                    outputTeams += '</select>';
                    outputTeams += '</div>';
                    $("#list-teams").html(outputTeams);

                }

            }
        });
    }

}
getTeams();

var teamId;
var useremail;

function changeTeam() {

    var team = document.getElementById('select-team');
    teamId = team.options[team.selectedIndex].id;

    checkTrial();

}

var url_string = window.location.href;
var url = new URL(url_string);


if (Parse.User.current()) {
    useremail = Parse.User.current().get("email");
    if (url.searchParams.get("teamId")) {
        Parse.User.logOut();
        window.location.reload();
        checkTrial();
    } else {
        teamId = klubbID;
        checkTrial();
    }

} else {
    var tId = url.searchParams.get("teamId");
    var email = url.searchParams.get("mail");
    teamId = tId;
    useremail = email;
    checkTrial();
}

var trial;

function checkTrial() {

    var teams = Parse.Object.extend("Teams");
    var query = new Parse.Query(teams);
    query.equalTo("objectId", teamId);
    query.find({
        success: function (results) {
            var team = results[0];
            trial = team.get("trial_used");

            if (trial == true) {
                $("#upgrade-title").html("Upgrade your team to Premium");
                console.log("ASDF");
                $("#customButton").html("Upgrade to Premium subscription");
                console.log("ASDF");
                $("#description").html("Unlock new features on EasyCoach by upgrading your team to Premium. For only €35 a year, the whole team will recieve the benefits of the Premium team.");
                console.log("ASDF");
                trialUpdate();
            } else {
                trial = false;
                $("#upgrade-title").html("Start your free 30 day trial");
                $("#customButton").html("Start 30 day free trial");
                $("#description").html("Unlock new features on EasyCoach by upgrading your team to Premium. Start your 30 day free trial today and let the whole team recieve the benefits of the Premium team.");
                trialUpdate();
            }
        }

    });

}

var handler = StripeCheckout.configure({
    //realKey: pk_live_TINLeoPYzrMvBun5kgJKfR1G
    //testKey: pk_test_D6MICwodyNK6JackKJstv4Oz
    key: 'pk_live_TINLeoPYzrMvBun5kgJKfR1G',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function (token) {
        console.log(token);
        console.log(teamId);
        Parse.Cloud.run("assignToSubscription", {
            token: token,
            teamId: teamId,
            trialUsed: trial,
        });
        document.getElementById("loading").style.display = "block";
        setTimeout(function () {
            location.href = "paymentConfirmed.html";
        }, 2000);

    }
});


function trialUpdate() {
    if (trial == true) {
        console.log("PREMIUM");
        document.getElementById('customButton').addEventListener('click', function (e) {
            // Open Checkout with further options:
            handler.open({
                name: 'EasyCoach',
                description: 'Premium subscription - 35€',
                zipCode: false,
                currency: 'eur',
                email: useremail,
                amount: 3500,
            });
            e.preventDefault();
        });
    } else {
        console.log(useremail);
        document.getElementById('customButton').addEventListener('click', function (e) {
            // Open Checkout with further options:
            handler.open({
                name: 'EasyCoach',
                description: 'Free trial period - Premium subscription',
                zipCode: false,
                currency: 'eur',
                email: useremail,
                amount: 0
            });
            e.preventDefault();
        });
    }
}

// Close Checkout on page navigation:
window.addEventListener('popstate', function () {
    handler.close();
});


function showTerms() {
    document.getElementById("information").style.display = "block";
}


function showPay() {
    if ($('#terms').is(":checked")) {
        document.getElementById("customButton").style.display = "block";
        document.getElementById("acceptFirst").style.display = "none";

    } else {
        document.getElementById("customButton").style.display = "none";
        document.getElementById("acceptFirst").style.display = "block";
    }
}
