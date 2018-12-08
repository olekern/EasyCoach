/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var mainClass = "data_umCaWls7lR_";
var membersClass = "Members";
var eventsClass = "Events";
var eventsAnswersClass = "Events_Answers";
var teamsClass = "Teams";


var csvText;
if (language == "NO") {
    csvText = "Last ned svarene som en CSV-fil";
} else {
    csvText = "Download the answers as a CSV-file";
}

var subscription;

function checkForPremium() {

    var teams = Parse.Object.extend(teamsClass);
    var query = new Parse.Query(teams);
    query.equalTo("objectId", klubbID);
    query.find({
        success: function (results) {
            var team = results[0];
            subscription = team.get("subscription");

            if (subscription != "premium") {

                var labelOutput = "";
                labelOutput += '<h1>Premium</h1>';
                $("#premium-label").html(labelOutput);
            }
        }
    });
}


function checkRole() {
    if (role == undefined) {
        setTimeout(function () {
            checkRole();
        }, 100);
    } else if (role == "spiller") {
        checkForPremium();
        $('#single-event').html('');
    } else if ((role == "trener") || (role == "admin")) {
        checkForPremium();
        var outputCSV = "";
        outputCSV += '<div id="downloadCsv" onclick="downloadCsv()">';
        outputCSV += '<i class="material-icons">insert_drive_file</i>';
        outputCSV += '<h1 id="download-csv">' + csvText + '</h1>';
        outputCSV += '</div>';
        outputCSV += '<div id="premium-label"></div>';

        $("#download-box").html(outputCSV);
        document.getElementById("sort-box").style.display = "block";

    }
}
checkRole();

var fromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
fromDate.setHours(23, 59, 59, 59);
var toDate = new Date();
toDate.setHours(23, 59, 59, 59);

function setDates() {
    document.getElementById("update-stats").style.display = "none";
    var datePicker1 = $('#to-date').datepicker();
    var eventDate1 = datePicker1.datepicker('getDate');

    var datePicker2 = $('#from-date').datepicker();
    var eventDate2 = datePicker2.datepicker('getDate');

    if (eventDate1 != null) {
        toDate = eventDate1;
    } else {
        toDate = new Date();
    }
    toDate.setHours(23, 59, 59, 59);
    fromDate = eventDate2;
    fromDate.setHours(23, 59, 59, 59);

    $('#list-player-attendance').html('');
    $('#piechart').html('<img src="./src/loading/Preloader_8.gif" id="loader">');

    amountOfTrueAnswers = 0;
    amountOfFalseAnswers = 0;
    amountOfNotAnswered = 0;

    allAnswersArray = [];
    allPractices = [];
    allPractices2 = [];

    memberArray = [];
    amountOfTrainings = 0;

    getEvents();
    getAllRecords(0);
}



var members = Parse.Object.extend(mainClass + membersClass);
var queryMemb = new Parse.Query(members);

var amountOfPlayers = 0;
var member;
var allMembers;

function getMembers() {
    queryMemb.include("user");
    queryMemb.equalTo("team", klubbID);
    queryMemb.find({
        success: function (membs) {

            for (var k in membs) {

                allMembers = membs;

                var userRole = membs[k].get("role");

                var userId = membs[k].get("user").id;
                var currentUser = Parse.User.current().id;

                if (userId == currentUser) {
                    member = membs[k];
                }

                if (userRole == "spiller") {
                    amountOfPlayers++;
                }

            }

            if (amountOfPlayers == 0) {

                var noneText;
                if (language == "NO") {
                    noneText = "Fant ingen utøvere å vise statistikk for";
                } else {
                    noneText = "Did not find any athletes in the team";
                }

                var outputNone = "";
                outputNone += '<div id="noPlayers">';
                outputNone += '<p>' + noneText + '</p>';
                outputNone += '</div>';


                $('#list-player-attendance').html(outputNone);
            }

        }
    });
}
getMembers();

var events = Parse.Object.extend(mainClass + eventsClass);
var queryEvents = new Parse.Query(events);
var allPractices = new Array();
var allPractices2 = new Array();
var amountOfTrainings = 0;
var countEvents = 0;
var amountOfAllTrainings = 0;

function getEvents() {

    queryEvents.limit(10000);
    queryEvents.descending("date");
    queryEvents.equalTo("team", klubbID);
    queryEvents.find({
        success: function (results) {

            for (var i in results) {

                var eventType = results[i].get("eventID");
                var eventDate = results[i].get("date");
                //eventDate.setHours(12, 0, 0, 0);
                var today = new Date();
                //today.setHours(12, 0, 0, 0);
                if (eventDate <= today) {
                    if (eventDate >= fromDate) {
                        console.log(toDate);
                        if (eventDate <= toDate) {
                            if (eventType == "training") {
                                amountOfTrainings++;
                                if (amountOfAllTrainings == 0) {
                                    countEvents++;
                                    allPractices2.push(results[i]);
                                }
                                allPractices.push(results[i]);
                            }
                        }
                    }
                }

            }
            /*
            if(allPractices2.length == 0) {
                allPractices2 = allPractices;
            }*/
            amountOfAllTrainings = countEvents;
        }
    });
}
getEvents();


var amountOfTrueAnswers = 0;
var amountOfFalseAnswers = 0;
var amountOfNotAnswered = 0;

var allAnswersArray = new Array();
var allAnswersArray2 = [];
var allAnswers;
role = "trener";
//recursive call, initial loopCount is 0 (we haven't looped yet)
function getAllRecords(loopCount) {

    if (loopCount == 0) {
        allAnswersArray = [];
    }

    ///set your record limit
    var limit = 10000;

    var queryEvents = new Parse.Object.extend(mainClass + eventsAnswersClass);
    new Parse.Query(queryEvents)
        .limit(limit)
        .include('member.user')
        .equalTo("team", klubbID)
        .skip(limit * loopCount)
        .find({
            success: function (results) {
                if (results.length > 0) {

                    for (var j = 0; j < results.length; j++) {
                        allAnswers = results;

                        var eventType = results[j].get("event").get("eventID");
                        var eventAnswer = results[j].get("attending");
                        var eventDate = results[j].get("event").get("date");
                        //eventDate.setHours(12, 0, 0, 0);
                        var today = new Date();
                        //today.setHours(12, 0, 0, 0);
                        if (eventDate <= today) {
                            if (eventDate >= fromDate) {
                                if (eventDate <= toDate) {
                                    if (eventType == "training") {
                                        allAnswersArray.push(results[j]);
                                        if (eventAnswer == true) {
                                            amountOfTrueAnswers++;
                                        } else if (eventAnswer == false) {
                                            amountOfFalseAnswers++;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    loopCount++;

                    getAllRecords(loopCount);
                } else {

                    if (allAnswersArray2.length == 0) {
                        allAnswersArray2 = allAnswersArray;
                    }
                    attendanceOverview();
                }
            },
            error: function (error) {
                //badness with the find
            }
        });
}
getAllRecords(0);


var playersAttendance = new Array();
var practiceText;
if (language == "NO") {
    practiceText = "Antall treninger";
} else {
    practiceText = "Amount of practices";
}
var practiceCount;

var memberArray = [];

function attendanceOverview() {

    playersAttendance = [];
    $("#list-player-attendance").html('');

    var eventsAnswers = amountOfPlayers * amountOfTrainings;
    amountOfNotAnswered = eventsAnswers - amountOfTrueAnswers - amountOfFalseAnswers;
    if (amountOfNotAnswered < 0) {
        amountOfNotAnswered = 0;
    }
    var attended;
    var notAttended;
    var notAnswered;
    var attendanceStats;

    if (language == "NO") {
        attended = "Deltatt";
        notAttended = "Ikke deltatt";
        notAnswered = "Ikke svart";
        attendanceStats = "Oppmøtestatistikk";
    } else {
        attended = "Attended";
        notAttended = "Not attended";
        notAnswered = "Not answered";
        attendanceStats = "Attendance statistics";
    }

    google.charts.load('current', {
        callback: function () {

            var container = document.getElementById('piechart').appendChild(document.createElement('div'));

            var data = google.visualization.arrayToDataTable([
                                      ["Attendance", attendanceStats],
                                      [attended, amountOfTrueAnswers],
                                      [notAttended, amountOfFalseAnswers],
                                      [notAnswered, amountOfNotAnswered],
                                    ]);
            var options = {
                title: attendanceStats,
                colors: ['#2E9C00', '#cf2424', '#F6A623'],
                chartArea: {
                    width: 400,
                    height: 300
                },
                width: 600,
                height: 400,
            };
            var chart = new google.visualization.PieChart(container);
            chart.draw(data, options);
        },

        packages: ['corechart']
    });
    document.getElementById("loader").style.display = "none";

    google.charts.load('current', {
        callback: function () {
            checkFunction();
            for (var i in allMembers) {
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Topping');
                data.addColumn('number', 'Slices');



                var thisMember = allMembers[i];

                var thisMemberName = thisMember.get("user").get("name");
                var thisMemberId = thisMember.id;
                var thisMemberRole = thisMember.get("role");
                
                if ((role == "trener") || (thisMemberName == Parse.User.current().get("name"))) {

                    if (thisMemberRole == "spiller") {
                        var outputMemberAttendance = "";
                        var outputImg = "";
                        var userImg = "";
                        var noUserImg = "";
                        if (thisMember.get("user").get("profileImage_small")) {
                            var brukerPB = thisMember.get("user").get("profileImage_small");
                            var PBUrl = brukerPB.url();
                            userImg = "<img src='" + PBUrl + "'>";
                        } else {
                            noUserImg = '<img src="./src/img/User_Small.png">';
                        }

                        outputMemberAttendance += '<div class="membAttendance">';
                        outputMemberAttendance += "<div id=\"memberPb\">";
                        outputMemberAttendance += userImg;
                        outputMemberAttendance += noUserImg;
                        outputMemberAttendance += "</div>"
                        outputMemberAttendance += '<div class="text">';
                        outputMemberAttendance += '<button id="' + thisMemberId + '" name="' + thisMemberName + '" onclick="playerAttendance(id, name);">' + thisMemberName + '</button>';

                        var nrAttend = 0;
                        var nrNotAttend = 0;
                        for (var k in allAnswersArray) {
                            var eventAuthor = allAnswersArray[k].get("member");
                            if (eventAuthor == undefined) {

                            } else {
                                if (eventAuthor.id == thisMember.id) {
                                    var eventAttendance = allAnswersArray[k].get("attending");

                                    if (eventAttendance == true) {
                                        nrAttend++;
                                    } else if (eventAttendance == false) {
                                        nrNotAttend++;
                                    }
                                }
                            }

                        }

                        outputMemberAttendance += '<p>' + attended + ' ' + nrAttend + '/' + amountOfTrainings + '</p>';
                        outputMemberAttendance += '</div>';
                        outputMemberAttendance += '<div id="draw-charts' + i + '" class="charts">';
                        outputMemberAttendance += '</div>';
                        outputMemberAttendance += '</div>';
                        memberArray.push([nrAttend, thisMemberName, outputMemberAttendance]);
                        $("#list-player-attendance").append(outputMemberAttendance);
                        document.getElementById("update-stats").style.display = "block";



                        var nrNotAnswered = amountOfTrainings - nrAttend - nrNotAttend;
                        var attendedPercentage = Math.round(nrAttend / amountOfTrainings * 100 * 10) / 10;
                        var notAttendedPercentage = Math.round(nrNotAttend / amountOfTrainings * 100 * 10) / 10;
                        playerArray = [thisMemberName, nrAttend, nrNotAttend, nrNotAnswered, attendedPercentage + '%', notAttendedPercentage + '%'];
                        playersAttendance.push(playerArray);

                        practiceCount = [practiceText + ': ' + amountOfTrainings];

                        data.addRows([
                          [attended, nrAttend],
                          [notAttended, nrNotAttend],
                          [notAnswered, nrNotAnswered]
                        ]);

                        var options = {

                            width: 80,
                            height: 80,
                            legend: "none",
                            colors: ['#2E9C00', '#cf2424', '#F6A623']
                        };

                        var container = document.getElementById('draw-charts' + i).appendChild(document.createElement('div'));
                        var chart = new google.visualization.PieChart(container);
                        chart.draw(data, options);
                    }
                }
            }
        },
        packages: ['corechart']
    });

}

function sortAnswers(sortType) {
    if (sortType == "descending-attendance") {
        memberArray.sort(function (a, b) {
            return b[0] - a[0]
        });
        playersAttendance.sort(function (c, d) {
            return d[1] - c[1]
        });
    } else if (sortType == "ascending-attendance") {
        memberArray.sort(function (a, b) {
            return a[0] - b[0]
        });
        playersAttendance.sort(function (c, d) {
            return c[1] - d[1]
        });
    } else if (sortType == "alphabetically") {
        memberArray.sort(function (a, b) {
            return a[1].localeCompare(b[1]);
        });
        playersAttendance.sort(function (c, d) {
            return c[0].localeCompare(d[0]);
        });
    }

    var outputAttendance = "";
    for (var j in memberArray) {
        outputAttendance += memberArray[j][2];
    }
    $("#list-player-attendance").html(outputAttendance);
}

function checkFunction() {

    var memberId = localStorage.getItem("memberId");
    var memberName = localStorage.getItem("memberName");


    setTimeout(
        function () {
            if ((memberId == undefined) || (memberId == "") || (memberId == null)) {} else {
                playerAttendance(memberId, memberName);

                localStorage.removeItem("memberId");
                localStorage.removeItem("memberName");
            }

        }, 500);

}

function playerAttendance(memberId, memberName) {

    var currentname = Parse.User.current().get("name");

    if ((currentname == memberName) || (role == "trener")) {
        setTimeout(
            function () {

                var outputSingleStats = "";

                outputSingleStats += '<div class="single-box">';
                outputSingleStats += '<div id="draw-player-chart"></div>';
                outputSingleStats += '<div id="list-events"></div>';
                outputSingleStats += '</div>';

                $("#list-singlePlayer-attendance").html(outputSingleStats);

                var nrattended = 0;
                var nrnotAttended = 0;
                var nrnotAnswered;

                var participationTrue;
                var participationFalse;
                var participationNotAnswered;

                if (language == "NO") {
                    participationTrue = "Deltatt";
                    participationFalse = "Ikke deltatt";
                    participationNotAnswered = "Ikke svart";
                } else {
                    participationTrue = "Attended";
                    participationFalse = "Not attended";
                    participationNotAnswered = "Not answered";
                }

                for (var t in allPractices2) {

                    var outputSS = "";
                    outputSS += '<div class="event-box">';
                    outputSS += '<div class="top-box">';
                    outputSS += '<div class="date-boxes" id="date-box' + t + '"></div>';
                    outputSS += '<div class="attendance-boxes" id="attendance-box' + t + '"></div>';
                    outputSS += '</div>';
                    outputSS += '<div class="comment-boxes" id="comment-box' + t + '"></div>';

                    outputSS += '</div>';

                    $("#list-events").append(outputSS);

                    var practiceId = allPractices2[t].id;

                    if (language == "NO") {
                        moment.locale('nb');

                        var answerDate = allPractices2[t].get("date");
                        var date1 = moment(answerDate).format('llll');
                        var date = date1.slice(0, -10);

                    } else {
                        moment.locale('en');

                        var answerDate = allPractices2[t].get("date");
                        var date1 = moment(answerDate).format('llll');
                        var date = date1.slice(0, -8);

                    }

                    var outputDate = "";
                    outputDate += '<h3>' + date + '</h3>';
                    var dateListing = "#date-box" + t;
                    $(dateListing).html(outputDate);

                    var answered = false;

                    for (var l in allAnswersArray2) {
                        var answer = allAnswersArray2[l];
                        var answerId = answer.id;

                        var answerMember = answer.get("member");


                        if (answerMember == undefined) {

                        } else {

                            var answerMemberId = answer.get("member").id;

                            if (answerMemberId == memberId) {

                                var practiceId = allPractices2[t].id;
                                var eventId = answer.get("event").id;

                                if (practiceId == eventId) {
                                    var comment;
                                    answered = true;

                                    if (language == "NO") {
                                        comment = "Kommentar";
                                    } else {
                                        comment = "Comment";
                                    }


                                    var answerAttending = answer.get("attending");
                                    var answerComment = answer.get("comment");

                                    if (answerComment) {
                                        if (answerComment.length != 0) {
                                            var outputComment = "";
                                            outputComment += '<h4 id="comment' + t + '">' + comment + ': ' + answerComment + '</h4>';
                                            outputComment += '<button class="material-icons" name="' + answerId + '" id="' + t + '" onclick="showTextField(id, name)">create</button>';
                                            var commentListing = "#comment-box" + t;
                                            $(commentListing).html(outputComment);
                                        }
                                    } else {

                                        var submit;
                                        var writeComment;
                                        var pressEnter;
                                        if (language == "NO") {
                                            submit = "Publiser";
                                            writeComment = "Skriv en kommentar";
                                            pressEnter = "Trykk enter-tasten for å publisere";
                                        } else {
                                            submit = "Submit";
                                            writeComment = "Write a comment";
                                            pressEnter = "Press enter to submit";
                                        }
                                        var outputCom = "";
                                        outputCom += '<button class="material-icons" name="' + answerId + '" id="' + t + '" onclick="showTextField(id, name)">create</button>';
                                        var commentListing = "#comment-box" + t;
                                        $(commentListing).append(outputCom);

                                        $('#textarea' + t).on('keyup', function (e) {
                                            if (e.which == 13) {
                                                submitComment(answerId, t);
                                            }
                                        });
                                    }


                                    var participation;
                                    var color;
                                    if (answerAttending == true) {
                                        nrattended++;
                                        participation = participationTrue;
                                        color = "#2E9C00";
                                    } else {
                                        nrnotAttended++;
                                        participation = participationFalse;
                                        color = "#CF2424";
                                    }
                                    var outputAttendance = "";
                                    outputAttendance += '<button class="button" id="' + answerId + '" name="' + memberId + '_' + memberName + '" onclick="changeAttendance(id, name);" style="color: ' + color + '">' + participation + '</button>';

                                    var attendanceListing = "#attendance-box" + t;
                                    $(attendanceListing).html(outputAttendance);

                                }


                            }
                        }

                    }

                    if (answered == false) {
                        var outputAttendance = "";
                        outputAttendance += '<button class="button" id="' + practiceId + '" name="' + memberId + '_' + memberName + '" onclick="createAttendance(id, name);" style="color:#F6A623;">' + participationNotAnswered + '</button>';

                        var attendanceListing = "#attendance-box" + t;
                        $(attendanceListing).html(outputAttendance);
                    }

                }

                nrnotAnswered = amountOfAllTrainings - nrattended - nrnotAttended;

                google.charts.load('current', {
                    callback: function () {

                        var container = document.getElementById('draw-player-chart').appendChild(document.createElement('div'));

                        var data = google.visualization.arrayToDataTable([
                                      ["Name", memberName],
                                      [participationTrue, nrattended],
                                      [participationFalse, nrnotAttended],
                                      [participationNotAnswered, nrnotAnswered],
                                    ]);
                        var options = {
                            title: memberName,
                            colors: ['#2E9C00', '#cf2424', '#F6A623'],
                            chartArea: {
                                width: 400,
                                height: 300
                            },
                            width: 600,
                            height: 400,
                        };
                        var chart = new google.visualization.PieChart(container);
                        chart.draw(data, options);
                    },

                    packages: ['corechart']
                });


                document.getElementById('list-singlePlayer-attendance').style.display = 'block';
            }, 0);

    }
}


$(document).click(function (event) {
    if (!$(event.target).closest('.single-box').length) {
        if ($('.single-box').is(":visible")) {
            var output = "";

            $("#list-singePlayer-attendance").html(output);

            document.getElementById('list-singlePlayer-attendance').style.display = 'none';
        }
    }
});


function changeAttendance(answerId, memberInfo) {

    var answer = Parse.Object.extend(mainClass + eventsAnswersClass);
    var Query = new Parse.Query(answer);
    Query.equalTo("objectId", answerId);
    Query.find({
        success: function (objects) {
            for (var j in objects) {

                var attendance = objects[j].get("attending");
                var newAttendance;
                if (attendance == true) {
                    newAttendance = false;
                } else if (attendance == false) {
                    newAttendance = true;
                }

                var member = memberInfo.split('_');
                var memberId = member[0];
                var memberName = member[1];


                objects[j].set("attending", newAttendance);
                objects[j].save({
                    success: function () {
                        playerAttendance(memberId, memberName);
                    }
                });


            }

        },
        error: function (error) {
            console.log("Query error:" + error.message);
            $("#draw-charts").html(outputnone);
        }
    });
}

function createAttendance(eventId, memberInfo) {

    var member = memberInfo.split('_');
    var memberId = member[0];
    var memberName = member[1];


    var eventPointer = {
        __type: 'Pointer',
        className: mainClass + eventsClass,
        objectId: eventId
    }

    var userPointer = {
        __type: 'Pointer',
        className: mainClass + membersClass,
        objectId: memberId
    }


    var attending = true;


    var eventsAnswers = Parse.Object.extend(mainClass + eventsAnswersClass);
    var newAttendance = new eventsAnswers();
    newAttendance.set("attending", attending);
    newAttendance.set("member", userPointer);
    newAttendance.set("event", eventPointer);
    newAttendance.set("team", klubbID);
    newAttendance.save(null, {
        success: function () {
            localStorage.setItem("memberId", memberId);
            localStorage.setItem("memberName", memberName);
            document.location.reload();

        },
        error: function (newPost, error) {
            console.log("Error:" + error.message);
            handleParseError();
        }
    });

}

function showTextField(nr, ansId) {

    var textarea = "#textarea" + nr;
    if ($(textarea).length < 1) {

        if (document.getElementById("comment" + nr)) {
            document.getElementById("comment" + nr).style = "display: none;";
        }
        var submit;
        var writeComment;
        var pressEnter;
        if (language == "NO") {
            submit = "Publiser";
            writeComment = "Skriv en kommentar";
            pressEnter = "Trykk enter-tasten for å publisere";
        } else {
            submit = "Submit";
            writeComment = "Write a comment";
            pressEnter = "Press enter to submit";
        }

        var outputComment = "";
        $(commentListing).html(outputComment);
        outputComment += '<div id="write-comment' + nr + '">';
        outputComment += '<textarea rows="1" id="textarea' + nr + '" placeholder="' + writeComment + '" ></textarea>';
        outputComment += '<p>' + pressEnter + '</p>';
        outputComment += '</div>';

        var commentListing = "#comment-box" + nr;
        $(commentListing).append(outputComment);

        $('#textarea' + nr).on('keyup', function (e) {
            if (e.which == 13) {
                submitComment(ansId, nr);
            }
        });
    } else {
        document.getElementById("textarea" + nr).outerHTML = '';
        document.getElementById("write-comment" + nr).outerHTML = '';
        document.getElementById("comment" + nr).style = "display: block;";
    }

}

function submitComment(answerId, nr) {

    var comment;

    if (language == "NO") {
        comment = "Kommentar";
    } else {
        comment = "Comment";
    }


    var textbox = "#textarea" + nr;
    var commentValue = $(textbox).val();

    var answer = Parse.Object.extend(mainClass + eventsAnswersClass);
    var Query = new Parse.Query(answer);
    Query.equalTo("objectId", answerId);
    Query.find({
        success: function (objects) {
            for (var j in objects) {

                objects[j].set("comment", commentValue);
                objects[j].save({
                    success: function () {

                        var outputComment = "";
                        outputComment += '<h4 id="comment' + nr + '">' + comment + ': ' + commentValue + '</h4>';
                        outputComment += '<button class="material-icons" name="' + answerId + '" id="' + nr + '" onclick="showTextField(id, name)">create</button>';

                        var commentListing = "#comment-box" + nr;
                        $(commentListing).html(outputComment);

                    }
                });


            }

        },
        error: function (error) {
            console.log("Query error:" + error.message);
        }
    });


}
