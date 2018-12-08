var home;
var calendar;
var attendance;
var surveys;
var team;

if(language == "NO"){
    home = "Hjem";
    calendar = "Kalender";
    attendance = "Oppmøte";
    surveys = "Undersøkelser";
    team = "Laget";
}else{
    home = "Home";
    calendar = "Calendar";
    attendance = "Attendance";
    surveys = "Surveys";
    team = "Team";
}

var outputSM = "";

outputSM += '<div class="nav">';
outputSM += '<a href="home.html"><img src="./src/img/new-logo.png" id="logo"></a>';
outputSM += '<ul>';
outputSM += '<li>';
outputSM += '<div class="loggut">';
outputSM += '<a href="registration.html" class="material-icons" id="signOut" onclick="logOut()">exit_to_app</a>';
outputSM += '<a href="profile.html">';
outputSM += '<p id="brukernavn" class="navn">';
outputSM += '</p></a>';
outputSM += '<ul id="profile-pb">';
outputSM += '</ul>';
outputSM += '</div>';
outputSM += '</li>';
outputSM += '</ul>';
outputSM += '</div>';
outputSM += '<div id="side-menu">';
outputSM += '<div id="top">';

outputSM += '<div id="dashbord" class="square">';
outputSM += '<div class="box" id="dashBox"></div>';
outputSM += '<a href="home.html" class="material-icons">home<p>' + home + '</p></a>';
outputSM += '</div>';

outputSM += '<div id="calendar" class="square">';
outputSM += '<div class="box" id="calBox"></div>';
outputSM += '<a href="calendar.html" class="material-icons">today<p>' + calendar + '</p></a>';
outputSM += '</div>';

outputSM += '<div id="attendance" class="square">';
outputSM += '<div class="box" id="attendBox"></div>';
outputSM += '<a href="attendance.html" class="material-icons">event_available<p>' + attendance + '</p></a>';
outputSM += '</div>';
    
outputSM += '<div id="survey" class="square">';
outputSM += '<div class="box" id="survBox"></div>';
outputSM += '<a href="answers.html" class="material-icons">insert_chart<p>' + surveys + '</p></a>';
outputSM += '</div>';

outputSM += '<div id="team" class="square">';
outputSM += '<div class="box" id="teamBox"></div>';
outputSM += '<a href="team.html" class="material-icons">group<p>' + team + '</p></a>';
outputSM += '</div>';

outputSM += '</div>';
outputSM += '<div id="btm">';
outputSM += '<p id="NO" class="language" onclick="setLanguage(id)">NO</p>';
outputSM += '<p id="EN" class="language" onclick="setLanguage(id);">EN</p>';
outputSM += '<p id="copy">&copy 2018 Lustek AS</p>';
outputSM += '</div>';
outputSM += '</div>';


$("#list-sm").html(outputSM);

function setLanguage(lng){
    
    localStorage.setItem("language", lng);
    
    document.location.reload();
        
    
}


