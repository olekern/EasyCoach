Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var mainClass = "data_umCaWls7lR_";
var membersClass = "Members";
var eventsClass = "Events";
var eventsAnswersClass = "Events_Answers";

var comingText;
var notComingText;
var notAnsweredText;
var addComment;
var enter;
var commentText;
var yesText;
var noText;
var save;
var dateText;
var timeText;
var cancelText;
if (language == "NO") {
    comingText = "Kommer";
    notComingText = "Kommer ikke";
    notAnsweredText = "Ikke svart";
    addComment = "Skriv en kommentar";
    enter = "Trykk enter for å fullføre";
    commentText = "Kommentar";
    yesText = "Ja";
    noText = "Nei";
    save = "Lagre";
    dateText = "Dato";
    timeText = "Klokkeslett";
    cancelText = "Avbryt";
} else {
    comingText = "Attending";
    notComingText = "Not attending";
    notAnsweredText = "Not answered";
    addComment = "Write a comment";
    enter = "Press enter to submit";
    commentText = "Comment";
    yesText = "Yes";
    noText = "No";
    save = "Save";
    dateText = "Date";
    timeText = "Time";
    cancelText = "Cancel";
}

var amountOfMembers;
var coming = 0;
var notComing = 0;
var notAns = 0;

function getAllMembers(loopCount, eventId) {

    coming = 0;
    notComing = 0;
    notAns = 0;
    var eventPointer = {
        __type: 'Pointer',
        className: mainClass + eventsClass,
        objectId: eventId
    }

    var loopCount = 0;

    var members = Parse.Object.extend(mainClass + membersClass);
    var queryMembers = new Parse.Query(members);
    queryMembers.equalTo("role", "spiller");
    queryMembers.equalTo("team", klubbID);
    queryMembers.include("user");
    queryMembers.find({
        success: function (results) {
            amountOfMembers = results.length;

            var playerArray = new Array();
            var commentArray = new Array();
            var attendanceArray = new Array();
            var m = 0;
            for (var i in results) {

                var name = results[i].get("user").get("name");
                console.log(name);
                playerArray.push(name);

                var listing = "#event-stats" + eventId;

                var memberId = results[i].id;
                var userPointer = {
                    __type: 'Pointer',
                    className: mainClass + membersClass,
                    objectId: memberId
                }
                var limit = 10000;

                var queryEvents = new Parse.Object.extend(mainClass + eventsAnswersClass);
                new Parse.Query(queryEvents)
                    .limit(limit)
                    .include('member.user')
                    .skip(limit * loopCount)
                    .equalTo("event", eventPointer)
                    .equalTo("member", userPointer)
                    .find({
                        success: function (objects) {
                            var outputUsers = "";

                            outputUsers += '<div class="athlete">';
                            outputUsers += '<p>' + playerArray[m] + '</p>';

                            var eventAnswer;
                            var eventComment;

                            outputUsers += '<select class="select-members" id="selectmemb" size="1">';
                            if (objects.length > 0) {

                                var answerBoolean = objects[0].get("attending");
                                //console.log(answerBoolean);
                                eventComment = objects[0].get("comment");

                                if ((eventComment == undefined) || (eventComment == null)) {
                                    eventComment = "";
                                }
                                commentArray.push(eventComment);
                                if (answerBoolean == true) {
                                    eventAnswer = comingText;
                                    coming++;

                                    outputUsers += '<option value="attending" selected>' + comingText + '</option>';
                                    outputUsers += '<option value="notAttending">' + notComingText + '</option>';
                                    outputUsers += '<option value="notAnswered">' + notAnsweredText + '</option>';
                                } else if (answerBoolean == false) {
                                    eventAnswer = notComingText;
                                    notComing++;

                                    outputUsers += '<option value="attending">' + comingText + '</option>';
                                    outputUsers += '<option value="notAttending" selected>' + notComingText + '</option>';
                                    outputUsers += '<option value="notAnswered">' + notAnsweredText + '</option>';
                                }

                            } else {
                                eventAnswer = notAnsweredText;
                                eventComment = "";
                                commentArray.push(eventComment);
                                notAns++;

                                outputUsers += '<option value="attending">' + comingText + '</option>';
                                outputUsers += '<option value="notAttending">' + notComingText + '</option>';
                                outputUsers += '<option value="notAnswered" selected>' + notAnsweredText + '</option>';
                            }
                            outputUsers += '</select>';

                            outputUsers += '<p>' + eventAnswer + '</p>';
                            outputUsers += '<p>' + commentText + ': ' + eventComment + '</p>';

                            outputUsers += '</div>';
                            $(listing).append(outputUsers);

                            m++;
                            drawChart();

                        },
                        error: function (error) {}
                    });

            }

        }
    });
}

var amountOfMembers;
var coming = 0;
var notComing = 0;
var notAns = 0;
var membersList;

function listMembers(eventId) {

    coming = 0;
    notComing = 0;
    notAns = 0;

    var listing = "#event-stats" + eventId;

    var members = Parse.Object.extend(mainClass + membersClass);
    var queryMembers = new Parse.Query(members);
    queryMembers.equalTo("role", "spiller");
    queryMembers.equalTo("team", klubbID);
    queryMembers.include("user");
    queryMembers.find({
        success: function (results) {
            amountOfMembers = results.length;
            membersList = results;

            for (var j in results) {

                var playerName = results[j].get("user").get("name");
                var playerId = results[j].get("user").id;

                var userImg = "";
                var noUserImg = "";
                if (results[j].get("user").get("profileImage_small")) {
                    var brukerPB = results[j].get("user").get("profileImage_small");
                    var PBUrl = brukerPB.url();
                    userImg = "<img src='" + PBUrl + "'>";
                } else {
                    noUserImg = '<img src="./src/img/User_Small.png">';
                }

                var outputUsers = "";
                outputUsers += '<div class="athlete">';
                outputUsers += userImg;
                outputUsers += noUserImg;
                outputUsers += '<h1>' + playerName + '</h1>';

                outputUsers += '<select class="select-members" id="' + playerId + '_' + eventId + '" size="1" onchange="changeAttendance(id)">';

                var answerBoolean;
                var answerComment = "";
                var idEvent = "";
                var answerBool = false;
                for (var k in allAnswersArray) {
                    if (allAnswersArray[k].get("member").get("user").id == playerId) {
                        idEvent = allAnswersArray[k].id;
                        answerBoolean = allAnswersArray[k].get("attending");
                        if (answerBoolean == true) {
                            coming++;

                            outputUsers += '<option value="attending" selected>' + comingText + '</option>';
                            outputUsers += '<option value="notAttending">' + notComingText + '</option>';
                            outputUsers += '<option value="notAnswered">' + notAnsweredText + '</option>';
                        } else if (answerBoolean == false) {
                            notComing++;

                            outputUsers += '<option value="attending">' + comingText + '</option>';
                            outputUsers += '<option value="notAttending" selected>' + notComingText + '</option>';
                            outputUsers += '<option value="notAnswered">' + notAnsweredText + '</option>';
                        }
                        answerComment = allAnswersArray[k].get("comment");
                        if ((answerComment == undefined) || (answerComment == null)) {
                            answerComment = "";
                        }

                        answerBool = true;
                    }
                }

                if (answerBool == false) {
                    notAns++;

                    outputUsers += '<option value="attending">' + comingText + '</option>';
                    outputUsers += '<option value="notAttending">' + notComingText + '</option>';
                    outputUsers += '<option value="notAnswered" selected>' + notAnsweredText + '</option>';
                }

                outputUsers += '</select>';
                if (answerBool != false) {
                    outputUsers += '<div class="comment-section">';
                    outputUsers += '<p id="text_' + playerId + '+' + idEvent + '">' + commentText + ': ' + answerComment + '</p>';
                    outputUsers += '<input type="text" id="input_' + playerId + '+' + idEvent + '" placeholder="' + addComment + '" style="display: none" onkeydown="if (event.keyCode == 13) submitComment(id);"/>';
                    outputUsers += '<p id="enter_' + playerId + '+' + idEvent + '" class="enter" style="display: none">' + enter + '</p>';
                    outputUsers += '<i class="material-icons" id="' + playerId + '+' + idEvent + '" onclick="displayCommentInput(id)">mode_edit</i>';
                    outputUsers += '</div>';
                }
                outputUsers += '</div>';
                if (noReload != true) {
                    $(listing).append(outputUsers);
                }

            }
            drawChart();
            noReload = false;
        }

    });
}

function displayCommentInput(id) {

    var input = document.getElementById("input_" + id);

    if (input.style.display == "none") {
        document.getElementById("input_" + id).style.display = "block";
        document.getElementById("enter_" + id).style.display = "block";
        document.getElementById("text_" + id).style.display = "none";

    } else {
        document.getElementById("input_" + id).style.display = "none";
        document.getElementById("enter_" + id).style.display = "none";
        document.getElementById("text_" + id).style.display = "block";

    }

}

function submitComment(parameter) {

    var array = parameter.split("+");

    var inputId = array[0];
    var inputArray = inputId.split("input_");
    var id = inputArray[1];
    var answerId = array[1];

    var comment = document.getElementById(parameter).value;

    var answers = Parse.Object.extend(mainClass + eventsAnswersClass);
    var query = new Parse.Query(answers);
    query.equalTo("objectId", answerId);
    query.find({
        success: function (object) {
            var answer = object[0];
            answer.set("comment", comment);
            answer.save({
                success: function () {

                    document.getElementById("input_" + id + '+' + answerId).style.display = "none";
                    document.getElementById("enter_" + id + '+' + answerId).style.display = "none";
                    document.getElementById('text_' + id + '+' + answerId).style.display = "block";
                    document.getElementById('text_' + id + '+' + answerId).innerHTML = commentText + ': ' + comment;
                }
            });
        }
    });
}

var noReload = false;

function changeAttendance(info) {

    var infoArray = info.split('_');
    var playerId = infoArray[0];
    var eventId = infoArray[1];

    var eventPointer = {
        __type: 'Pointer',
        className: mainClass + eventsClass,
        objectId: eventId
    }

    var select = document.getElementById(info);
    var selectValue = select.options[select.selectedIndex].value;

    var memberObject;

    for (var u in membersList) {
        if (membersList[u].get("user").id == playerId) {
            memberObject = membersList[u];
        }
    }
    var answered = false;
    for (var l in allAnswersArray) {
        if (allAnswersArray[l].get("member").get("user").id == playerId) {
            answered = true;
            var answer = allAnswersArray[l];
            var bool;
            if (selectValue == "attending") {
                bool = true;
            } else if (selectValue == "notAttending") {
                bool = false;
            } else if (selectValue == "notAnswered") {
                bool = "no";
            }
            if ((bool == true) || (bool == false)) {

                answer.set("attending", bool);
                answer.save({
                    success: function () {
                        var count = 0;
                        noReload = true;
                        getAllRecords(count, eventId);
                    }
                });

            } else if (bool == "no") {

                answer.destroy({
                    success: function (result) {
                        var count = 0;
                        noReload = true;
                        getAllRecords(count, eventId);
                    }
                });

            }

        }

    }

    if (answered == false) {
        var bool;
        if (selectValue == "attending") {
            bool = true;
        } else if (selectValue == "notAttending") {
            bool = false;
        } else if (selectValue == "notAnswered") {
            bool = "";
        }
        var answerEvent = Parse.Object.extend(mainClass + eventsAnswersClass);
        var newAnswer = new answerEvent();
        newAnswer.set("attending", bool);
        newAnswer.set("member", memberObject);
        newAnswer.set("team", klubbID);
        newAnswer.set("event", eventPointer);
        newAnswer.save({
            success: function () {
                var count = 0;
                noReload = true;
                getAllRecords(count, eventId);
            }
        });
    }

}

var allAnswersArray = new Array();
var allAnswers;

//recursive call, initial loopCount is 0 (we haven't looped yet)
function getAllRecords(loopCount, eventId) {

    if (loopCount == 0) {
        allAnswersArray = [];

        if (noReload != true) {

            var listing = ".event-stats";
            $(listing).html('');
        }
        coming = 0;
        notComing = 0;
    }

    var eventPointer = {
        __type: 'Pointer',
        className: mainClass + eventsClass,
        objectId: eventId
    }

    ///set your record limit
    var limit = 10000;

    var queryEvents = new Parse.Object.extend(mainClass + eventsAnswersClass);
    new Parse.Query(queryEvents)
        .limit(limit)
        .include('member.user')
        .skip(limit * loopCount)
        .equalTo("event", eventPointer)
        .find({
            success: function (results) {
                if (results.length > 0) {

                    for (var j = 0; j < results.length; j++) {

                        allAnswers = results[j];
                        allAnswersArray.push(allAnswers);
                        /*
                                                var eventType = results[j].get("event").get("eventID");
                                                var eventAnswer = results[j].get("attending");

                                                if (eventAnswer == true) {
                                                    eventAnswer = comingText;
                                                    coming++;
                                                } else if (eventAnswer == false) {
                                                    eventAnswer = notComingText;
                                                    notComing++;
                                                }

                                                var eventComment = results[j].get("comment");;

                                                if (results[j].get("member")) {
                                                    var eventAuthor = results[j].get("member").get("user");
                                                    var eventAuthorName = eventAuthor.get("name");

                                                    var userImg = "";
                                                    var noUserImg = "";
                                                    if (eventAuthor.get("profileImage_small")) {
                                                        var brukerPB = eventAuthor.get("profileImage_small");
                                                        var PBUrl = brukerPB.url();
                                                        userImg = "<img src='" + PBUrl + "'>";
                                                    } else {
                                                        noUserImg = '<img src="./src/img/User_Small.png">';
                                                    }

                                                    var outputUsers = "";
                                                    outputUsers += '<div id="user">';
                                                    outputUsers += userImg;
                                                    outputUsers += noUserImg;
                                                    outputUsers += '<div id="user-text">';
                                                    outputUsers += '<h4>' + eventAuthorName + '</h4>';
                                                    outputUsers += '<p>' + eventAnswer + '</p>';
                                                    outputUsers += '</div>';
                                                    if ((eventComment != null) && (eventComment != undefined) && (eventComment != "")) {
                                                        outputUsers += '<p id="comment">' + commentText + ': ' + eventComment + '</p>';
                                                    } else {
                                                        /*
                                                        outputUsers += '<input type="text" placeholder="' + addComment + '"/>';
                                                        outputUsers += '<p>' + enter + '</p>';
                                                
                                                    }
                                                    outputUsers += '</div>';

                                                    var listing = "#event-stats" + eventId;
                                                    $(listing).append(outputUsers);
                                                }
                                                */
                    }

                    loopCount++;

                    getAllRecords(loopCount, eventId);
                } else {
                    drawChart();
                    listMembers(eventId);
                }
            },
            error: function (error) {}
        });
}

var allEventsArray = new Array();
var allEvents;
var checkForEvents = new Array();

function getAllEvents(loopCount, date) {

    if (loopCount == 0) {
        allAnswersArray = [];
        $("#list-events").html('');
    }

    var showStatsText;
    var noEventText;
    var trainingText;
    var eventText;
    if (language == "NO") {
        showStatsText = "Trykk her for å hente svarene fra arrangementet";
        noEventText = "Fant ingen arrangementer denne dagen";
        trainingText = "Trening";
        eventText = "Arrangement";
    } else {
        showStatsText = "Press here to get the answers from the event";
        noEventText = "No events found this day";
        trainingText = "Practice";
        eventText = "Event";
    }

    ///set your record limit
    var limit = 10000;

    var queryEvents = new Parse.Object.extend(mainClass + eventsClass);
    new Parse.Query(queryEvents)
        .limit(limit)
        .skip(limit * loopCount)
        .equalTo("team", klubbID)
        .find({
            success: function (results) {
                if (results.length > 0) {

                    for (var j = 0; j < results.length; j++) {

                        allEvents = results[j];
                        var eventId = allEvents.id;
                        var eventName = allEvents.get("name");
                        var eventDate = allEvents.get("date");
                        var eventDate2 = eventDate.setHours(0, 0, 0, 0);

                        //console.log(eventDate);
                        date.setHours(0, 0, 0, 0);

                        //console.log(date);
                        if (eventDate.getTime() === date.getTime()) {
                            checkForEvents.push(true);
                            if (language == "NO") {
                                moment.locale('nb');

                            } else {
                                moment.locale('no');

                            }

                            var date1 = moment(eventDate).format('llll');
                            var date2 = date1.slice(0, -15);

                            if ((eventName == undefined) || (eventName == "")) {
                                if (allEvents.get("eventID") == "training") {
                                    eventName = trainingText;
                                } else {
                                    eventName = eventText;
                                }
                            }


                            var outputEvent = "";

                            outputEvent += '<div id="event">';
                            outputEvent += '<h2>' + eventName + '</h2>';
                            outputEvent += '<h3>' + date2 + '</h3>';
                            outputEvent += '<div class="editdelete">';
                            outputEvent += '<div class="nohide">';
                            outputEvent += '<i class="material-icons" id="' + eventId + '" onclick="confirmDelete(id)">close</i>';
                            outputEvent += '</div>';
                            outputEvent += '<i class="material-icons" id="' + eventId + '-----' + eventName + '-----' + eventDate + '" onclick="editEvent(id)">create</i>';
                            outputEvent += '</div>';
                            outputEvent += '<div id="button">';
                            outputEvent += '<button name="0" id="' + eventId + '" onclick="getAllRecords(name, id)">' + showStatsText + '</button>';
                            outputEvent += '</div>';
                            outputEvent += '<div id="event-stats' + eventId + '" class="event-stats"></div>';
                            outputEvent += '</div>';

                            $("#list-events").append(outputEvent);
                        }

                        allEventsArray.push(allEvents);

                        /*
                          var eventType = results[j].get("event").get("eventID");
                          var eventAnswer = results[j].get("attending");
                           */
                    }

                    console.log(checkForEvents);
                    if (checkForEvents.indexOf(true) == -1) {


                        var outputEvent = "";

                        outputEvent += '<div id="noEvent">';
                        outputEvent += '<h2>' + noEventText + '</h2>';
                        outputEvent += '</div>';

                        $("#list-events").html(outputEvent);


                    }


                    loopCount++;

                    getAllEvents(loopCount, date);
                } else {
                    checkForEvents = [];
                }
            },
            error: function (error) {}
        });
}

if (localStorage.getItem("eventId") != undefined) {

    var eventDate = localStorage.getItem("eventDate");
    var date = new Date(eventDate);
    getAllEvents(0, date);
    localStorage.removeItem("eventDate");
    setTimeout(function () {
        var eventId = localStorage.getItem("eventId");
        //getAllRecords(0, eventId);
        localStorage.removeItem("eventId");
    }, 1000);

} else {

    var date = new Date();
    getAllEvents(0, date);

}

$(".datepicker").datepicker({
    onSelect: function (date) {
        var date = $(this).datepicker('getDate');

        var eventDate = date;

        if (eventDate != undefined) {

            $("#list-events").html('');

            getAllEvents(0, eventDate);

        }

    }
});

function drawChart() {

    var amountOfNotAnswered = notAns;
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

    $("#draw-chart").html('');

    google.charts.load('current', {
        callback: function () {

            var container = document.getElementById('draw-chart').appendChild(document.createElement('div'));


            var data = google.visualization.arrayToDataTable([
                                      ["Attendance", attendanceStats],
                                      [attended, coming],
                                      [notAttended, notComing],
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
}

function confirmDelete(eventId) {
    var confirmText;

    if (language == "NO") {
        confirmText = "Er du sikker på at du vil slette dette arrangementet";
    } else {
        confirmText = "Are you sure you want to delete this event";
    }

    var outputBox = "";
    outputBox += '<div id="confirmKick" class="nohide">';
    outputBox += '<p>' + confirmText + '?</p>';
    outputBox += '<button onclick="cancel()">' + noText + '</button>';
    outputBox += '<button id="' + eventId + '" onclick="deleteEvent(id)">' + yesText + '</button>';
    outputBox += '</div>';

    $("#confirm-delete").html(outputBox);
}

function deleteEvent(eventId) {

    var events = Parse.Object.extend(mainClass + eventsClass);
    var queryEvents = new Parse.Query(events);

    queryEvents.equalTo("objectId", eventId);
    queryEvents.find({
        success: function (results) {
            var eventObject = results[0];
            var eventDate = eventObject.get("date");
            eventObject.destroy({
                success: function (result) {

                    var output = "";

                    $("#confirm-delete").html(output);

                    var eventPointer = {
                        __type: 'Pointer',
                        className: mainClass + eventsClass,
                        objectId: eventId
                    }

                    var eventAnswers = Parse.Object.extend(mainClass + eventsAnswersClass);
                    var query = new Parse.Query(eventAnswers);
                    query.equalTo("event", eventPointer);
                    query.find({
                        success: function (results) {
                            for (var i in results) {
                                var answer = results[i];
                                answer.destroy({
                                    success: function (result) {
                                        getAllEvents(0, eventDate);
                                    }
                                });
                            }

                        },
                        error: function (result, error) {

                        }
                    });
                }

            });
        }
    });

}


$(document).click(function (event) {
    if (!$(event.target).closest('.nohide').length) {
        if ($('#confirmKick').is(":visible")) {
            var output = "";

            $("#confirm-delete").html(output);
        }
    }
});


function cancel() {
    var output = "";

    $("#confirm-delete").html(output);
}

function editEvent(params) {

    var eventId = params.split('-----')[0];
    var eventName = params.split('-----')[1];
    var eventDate = new Date(params.split('-----')[2]);

    console.log(eventId);
    console.log(eventName);
    console.log(eventDate);

    var changeTitle;
    var changeName;

    if (language == "NO") {
        changeName = "Nytt navn";
        changeTitle = "Gjør endringer på arrangementet";
    } else {
        changeName = "New name";
        changeTitle = "Make changes to the event";
    }

    var outputEditor = "";

    outputEditor += '<div class="editor" id="editor' + eventId + '">';
    outputEditor += '<h1>' + changeTitle + '</h1>';
    outputEditor += '<p id="' + eventId + '" onclick="cancelEdit(id)">' + cancelText + '</p>';
    outputEditor += '<input type="text" placeholder="' + changeName + '" id="newName" value="' + eventName + '"/>';
    outputEditor += '<p id="date-pick">' + dateText + ': <input type="text" autocomplete="off" id="form-date" class="datepicker"></p>';
    outputEditor += '<p id="time-pick-once">' + timeText + ': <input type="text" autocomplete="off" id="form-time" class="timepicker" /></p>';
    outputEditor += '<button id="' + eventId + '" onclick="sendEdit(id)">' + save + '</button>';
    outputEditor += '</div>';

    var listevent = "#event-stats" + eventId;
    $(listevent).html(outputEditor);

    var timeString;
    if (language == "NO") {
        timeString = "Tid";
    } else {
        timeString = "Time";
    }

    $(function () {
        $(".datepicker").datepicker();

        $("#form-date").datepicker("setDate", eventDate);

    });

    $('.timepicker').wickedpicker({

        twentyFour: true,
        upArrow: 'wickedpicker__controls__control-up',
        downArrow: 'wickedpicker__controls__control-down',
        close: 'wickedpicker__close',
        hoverState: 'hover-state',
        title: timeString
    });
}


function cancelEdit(eventId) {

    var listevent = "#event-stats" + eventId;
    $(listevent).html('');

}

function sendEdit(eventId) {

    var noDate;
    var noTitle;
    if (language == "NO") {
        noDate = "Fyll inn dato før du oppdaterer arrangementet";
        noTitle = "Fyll inn tittel før du oppdaterer arrangementet";
    } else {
        noDate = "Fill in the date before you update the event";
        noTitle = "Fill in the title before you update the event";
    }

    var eventTitle = $('#newName').val();

    if ((eventTitle == undefined) || (eventTitle == "")) {
        alert(noTitle);
    }

    var timepickers = $('#form-time').wickedpicker();
    var eventTime = timepickers.wickedpicker('time');

    var hours = eventTime.substring(0, 2);
    var minutes = eventTime.substring(5, 7);

    var ampm = eventTime.substring(8, 10);

    if (ampm == "PM") {
        hours = parseInt(hours);
        hours = hours + 12;
    }
    minutes = parseInt(minutes);

    var datePicker = $('#form-date').datepicker();
    var eventDate = datePicker.datepicker('getDate');
    if (eventDate == null) {
        alert(noDate);
    } else {
        eventDate.setHours(hours);
        eventDate.setMinutes(minutes);
    }

    var events = Parse.Object.extend(mainClass + eventsClass);
    var queryEvents = new Parse.Query(events);

    queryEvents.equalTo("objectId", eventId);
    queryEvents.find({
        success: function (results) {
            var eventObject = results[0];
            eventObject.set("date", eventDate);
            eventObject.set("name", eventTitle);
            eventObject.set("team", klubbID);
            eventObject.save({
                success: function () {

                    var listevent = "#event-stats" + eventId;
                    $(listevent).html('');

                    getAllEvents(0, eventDate);

                }
            });
        }
    });
}
