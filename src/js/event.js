Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var mainClass = "data_umCaWls7lR_";
var membersClass = "Members";
var eventsClass = "Events";
var eventsAnswersClass = "Events_Answers";
var repeatingEventsClass = "RepeatingEvents";


var members = Parse.Object.extend(mainClass + membersClass);
var queryMemb = new Parse.Query(members);

var amountOfPlayers = 0;
var member;
queryMemb.equalTo("team", klubbID);
queryMemb.find({
    success: function (membs) {
        for (var k in membs) {

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
    }
});

function redirect() {

    if (role == "trener") {
        location.href = "events.html";
    }
}


function showNearestEvent() {

    var event = Parse.Object.extend(mainClass + eventsClass);
    var query = new Parse.Query(event);
    query.ascending("date");
    query.equalTo("team", klubbID);
    query.limit(10000)
    query.find({
        success: function (results) {
            if (results.length == 0) {

                var outputEvent = "";
                if (role == "trener") {
                    outputEvent += '<div id="noEvent">';
                    outputEvent += '<h4>' + l.noEvent + '<h4>';
                    outputEvent += '</div>';

                } else if (role == "spiller") {

                    outputEvent += '<div id="noEvent">';
                    outputEvent += '<h4>' + l.noEvent + '<h4>';
                    outputEvent += '</div>';

                } else if (role == undefined) {
                    showNearestEvent();
                }


                if (role == undefined) {
                    showNearestEvent();
                } else if (role == "trener") {
                    var outputC = "";
                    outputC += '<div id="createbox">';
                    outputC += '<i class="material-icons">add_circle</i>';
                    outputC += '<p id="create" class="createbtn" onclick="showCreator()">' + l.createEvent + '<p>';
                    outputC += '</div>';
                }

                $("#list-nearest-event").html(outputEvent);
                $("#list-create-btn").html(outputC);
            } else {
                for (var i = 0; i < results.length; i++) {

                    var eventId = results[i].id;

                    var eventDate = results[i].get("date");


                    var monthNames = [l.january, l.february, l.march, l.april, l.may, l.june,
                          l.july, l.august, l.september, l.october, l.november, l.december];


                    var monthInt = eventDate.getMonth();
                    var month = monthNames[monthInt];

                    var date = eventDate.getDate();

                    if (language == "NO") {
                        var dateMonth = date + ". " + month;
                    } else {
                        var dateMonth = date + "th " + month;
                    }

                    var hours = eventDate.getHours();
                    var minutes = eventDate.getMinutes();
                    if (minutes == 0) {
                        minutes = '00';
                    } else if (minutes < 10) {
                        minutes = '0' + minutes;
                    }
                    var time = hours + ":" + minutes;

                    eventDate.setHours(0, 0, 0, 0);

                    var dato = eventDate.toString();
                    var datoen = dato.substring(4, 15);

                    var today = new Date();
                    today.setHours(0, 0, 0, 0);

                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(0, 0, 0, 0);

                    var twoDays = new Date();
                    twoDays.setDate(twoDays.getDate() + 2);
                    twoDays.setHours(0, 0, 0, 0);

                    var threeDays = new Date();
                    threeDays.setDate(threeDays.getDate() + 3);
                    threeDays.setHours(0, 0, 0, 0);

                    var fourDays = new Date();
                    fourDays.setDate(fourDays.getDate() + 4);
                    fourDays.setHours(0, 0, 0, 0);

                    var fiveDays = new Date();
                    fiveDays.setDate(fiveDays.getDate() + 4);
                    fiveDays.setHours(0, 0, 0, 0);


                    var sixDays = new Date();
                    sixDays.setDate(sixDays.getDate() + 4);
                    sixDays.setHours(0, 0, 0, 0);

                    var sevenDays = new Date();
                    sevenDays.setDate(sevenDays.getDate() + 4);
                    sevenDays.setHours(0, 0, 0, 0);


                    var eventType = results[i].get("eventID");

                    var eventName;

                    if (eventType == "training") {
                        eventName = l.practice;
                    } else if (eventType == "custom") {
                        eventName = results[i].get("name");
                    }

                    var outputEvent = "";

                    if (eventDate.getTime() === today.getTime()) {
                        outputEvent += '<i class="material-icons">fitness_center</i>';
                        outputEvent += '<h3>' + eventName + '</h3>';
                        outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                        outputEvent += '<h4>' + time + '</h4>';

                        if (role == "trener") {

                            coachEvent(eventId);
                        } else if (role == "spiller") {

                            playerEvent(eventId);
                        } else if (role == undefined) {

                            showNearestEvent();
                        }

                        results = i;
                        break;

                    } else if (eventDate.getTime() === tomorrow.getTime()) {
                        outputEvent += '<i class="material-icons">fitness_center</i>';
                        outputEvent += '<h3>' + eventName + '</h3>';
                        outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                        outputEvent += '<h4>' + time + '</h4>';

                        if (role == "trener") {
                            coachEvent(eventId);
                        } else if (role == "spiller") {
                            playerEvent(eventId);
                        } else if (role == undefined) {
                            showNearestEvent();
                        }

                        results = i;
                        break;

                    } else if (eventDate.getTime() === twoDays.getTime()) {
                        outputEvent += '<i class="material-icons">fitness_center</i>';
                        outputEvent += '<h3>' + eventName + '</h3>';
                        outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                        outputEvent += '<h4>' + time + '</h4>';

                        if (role == "trener") {
                            coachEvent(eventId);
                        } else if (role == "spiller") {
                            playerEvent(eventId);
                        } else if (role == undefined) {
                            showNearestEvent();
                        }

                        results = i;
                        break;

                    } else if (eventDate.getTime() === threeDays.getTime()) {
                        outputEvent += '<i class="material-icons">fitness_center</i>';
                        outputEvent += '<h3>' + eventName + '</h3>';
                        outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                        outputEvent += '<h4>' + time + '</h4>';

                        if (role == "trener") {
                            coachEvent(eventId);
                        } else if (role == "spiller") {
                            playerEvent(eventId);
                        } else if (role == undefined) {
                            showNearestEvent();
                        }

                        results = i;
                        break;

                    } else if (eventDate.getTime() === fourDays.getTime()) {
                        outputEvent += '<i class="material-icons">fitness_center</i>';
                        outputEvent += '<h3>' + eventName + '</h3>';
                        outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                        outputEvent += '<h4>' + time + '</h4>';

                        if (role == "trener") {
                            coachEvent(eventId);
                        } else if (role == "spiller") {
                            playerEvent(eventId);
                        } else if (role == undefined) {
                            showNearestEvent();
                        }

                        results = i;
                        break;

                    } else if (eventDate.getTime() === fiveDays.getTime()) {
                        outputEvent += '<i class="material-icons">fitness_center</i>';
                        outputEvent += '<h3>' + eventName + '</h3>';
                        outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                        outputEvent += '<h4>' + time + '</h4>';

                        if (role == "trener") {
                            coachEvent(eventId);
                        } else if (role == "spiller") {
                            playerEvent(eventId);
                        } else if (role == undefined) {
                            showNearestEvent();
                        }

                        results = i;
                        break;

                    } else if (eventDate.getTime() === sixDays.getTime()) {
                        outputEvent += '<i class="material-icons">fitness_center</i>';
                        outputEvent += '<h3>' + eventName + '</h3>';
                        outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                        outputEvent += '<h4>' + time + '</h4>';

                        if (role == "trener") {
                            coachEvent(eventId);
                        } else if (role == "spiller") {
                            playerEvent(eventId);
                        } else if (role == undefined) {
                            showNearestEvent();
                        }

                        results = i;
                        break;

                    } else if (eventDate.getTime() === sevenDays.getTime()) {
                        outputEvent += '<i class="material-icons">fitness_center</i>';
                        outputEvent += '<h3>' + eventName + '</h3>';
                        outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                        outputEvent += '<h4>' + time + '</h4>';

                        if (role == "trener") {
                            coachEvent(eventId);
                        } else if (role == "spiller") {
                            playerEvent(eventId);
                        } else if (role == undefined) {
                            showNearestEvent();
                        }

                        results = i;
                        break;

                    } else {

                        if (role == "trener") {

                            outputEvent += '<div id="noEvent">';
                            outputEvent += '<h4>' + l.noEvent + '<h4>';
                            outputEvent += '</div>';

                        } else if (role == "spiller") {

                            outputEvent += '<div id="noEvent">';
                            outputEvent += '<h4>' + l.noEvent + '<h4>';
                            outputEvent += '</div>';

                        } else if (role == undefined) {
                            showNearestEvent();
                        }
                    }

                }

                $("#list-nearest-event").html(outputEvent);

                if (role == undefined) {
                    showNearestEvent();
                } else if (role == "trener") {
                    var outputC = "";
                    outputC += '<div id="createbox">';
                    outputC += '<i class="material-icons">add_circle</i>';
                    outputC += '<p id="create" class="createbtn" onclick="showCreator()">' + l.createEvent + '<p>';
                    outputC += '</div>';
                }

                $("#list-create-btn").html(outputC);

            }
        }

    });

}

showNearestEvent();


function coachEvent(eventId) {

    var pointer = {
        __type: 'Pointer',
        className: mainClass + eventsClass,
        objectId: eventId
    }

    var eventsAnswers = Parse.Object.extend(mainClass + eventsAnswersClass);
    var Query = new Parse.Query(eventsAnswers);
    Query.equalTo("event", pointer);
    Query.find({

        success: function (objects) {

            var coming = 0;
            var notComing = 0;
            for (var j in objects) {

                var attending = objects[j].get("attending");
                if (attending == true) {
                    coming++;
                } else if (attending == false) {
                    notComing++;
                }

            }
            var answered = coming + notComing;
            var notAnswered = amountOfPlayers - answered;

            if (notAnswered < 0) {
                notAnswered = 0;
            }

            if (language == "NO") {
                var comingString = " kommer";
                var notComingString = " kommer ikke";
                var notAnsweredString = " ikke svart";
            } else {
                var comingString = " attending";
                var notComingString = " not attending";
                var notAnsweredString = " not answered";
            }

            var outputAttendance = "";
            outputAttendance += '<div class="attendanceInfo">';
            outputAttendance += '<div class="attendance1" id="checked">';
            outputAttendance += '<img class="badge" src="./src/img/checkedBadge.png">';
            outputAttendance += '<p>' + coming + ' ' + l.attending + '</p>';
            outputAttendance += '</div>';
            outputAttendance += '<div class="attendance1" id="cancel">';
            outputAttendance += '<img class="badge" src="./src/img/cancelBadge.png">';
            outputAttendance += '<p>' + notComing + ' ' + l.notAttending + '</p>';
            outputAttendance += '</div>';
            outputAttendance += '<div class="attendance1" id="warning">';
            outputAttendance += '<img class="badge" src="./src/img/warningBadge.png">';
            outputAttendance += '<p>' + notAnswered + ' ' + l.notAnswered + '</p>';
            outputAttendance += '</div>';
            outputAttendance += '</div>';

            $("#list-event-answers").html(outputAttendance);
        }
    });
}

function playerEvent(eventId) {

    var eventAnswers = Parse.Object.extend(mainClass + eventsAnswersClass);
    var answerQuery = new Parse.Query(eventAnswers);

    var eventPointer = {
        __type: 'Pointer',
        className: mainClass + eventsClass,
        objectId: eventId
    }

    answerQuery.equalTo("event", eventPointer);
    answerQuery.find({

        success: function (results) {

            var userArray = new Array();
            for (var e in results) {

                var answerId = results[e].id;
                var answerUser = results[e].get("member").id;
                var answerComment = results[e].get("comment");
                var answerAttending = results[e].get("attending");
                userArray.push(answerUser);

                if (answerUser == member.id) {
                    results = e;
                    break;
                }
            }

            var thisUser = member.id;
            var bool = _.contains(userArray, thisUser);

            var outputAnswer = "";
            outputAnswer += '<div class="attendance" id="' + eventId + '" onclick="coming(id)">';
            outputAnswer += '<img class="badge" src="./src/img/checkedBadge.png">';
            outputAnswer += '<p>' + l.attending + '</p>';
            outputAnswer += '<div class="box" id="box1" style="display: none;"></div>';
            outputAnswer += '</div>';
            outputAnswer += '<div class="attendance" id="' + eventId + '" onclick="notComing(id)">';
            outputAnswer += '<img class="badge" src="./src/img/cancelBadge.png">';
            outputAnswer += '<p>' + l.notAttending + '</p>';
            outputAnswer += '<div class="box" id="box2" style="display: none;"></div>';
            outputAnswer += '</div>';

            if (bool == true) {
                if ((answerComment == undefined) || (answerComment == null)) {
                    outputAnswer += '<textarea rows="1" cols="24" name="text" id="commentSection" placeholder="' + l.writeComment + '"></textarea>';
                } else {
                    outputAnswer += '<textarea rows="1" cols="24" name="text" id="commentSection" placeholder="' + l.writeComment + '">' + answerComment + '</textarea>';
                }
                outputAnswer += '<p id="saved"></p>';
                outputAnswer += '<button id="' + answerId + '" name="' + answerId + '" onclick="updateAttend(id, name)">' + l.update + '</button>';
                $("#list-options").html(outputAnswer);
                if (answerAttending == true) {
                    document.getElementById('box1').style.display = 'block';
                } else if (answerAttending == false) {
                    document.getElementById('box2').style.display = 'block';
                }

            } else {
                outputAnswer += '<textarea rows="1" cols="24" name="text" id="commentSection" placeholder="' + l.writeComment + '"></textarea>';
                outputAnswer += '<button id="' + eventId + '" class="submitButton" onclick="submitAttend(id)">' + l.submit + '</button>';
                $("#list-options").html(outputAnswer);
            }

        }

    });
}

var attending;

function coming() {
    attending = true;

    document.getElementById('box1').style.display = 'block';
    document.getElementById('box2').style.display = 'none';

    $("#saved").html(l.notSavedChanges);
}

function notComing(eventId) {
    attending = false;

    document.getElementById('box1').style.display = 'none';
    document.getElementById('box2').style.display = 'block';

    $("#saved").html(l.notSavedChanges);
}

$(document).delegate('#commentSection', 'change', function () {
    $("#saved").html(l.notSavedChanges);
});

function updateAttend(eventId, answerId) {

    var comment = $('textarea#commentSection').val();

    var usersAnswer = Parse.Object.extend(mainClass + eventsAnswersClass);
    var queryAnswer = new Parse.Query(usersAnswer);
    queryAnswer.equalTo("objectId", answerId);
    queryAnswer.first({
        success: function (object) {

            object.set("comment", comment);
            object.set("attending", attending);
            object.set("team", klubbID);
            object.save();

            $("#saved").html(savedText);

        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}

function submitAttend(eventId) {

    if (attending == undefined) {

        var alertMessage = l.registerAttendanceBeforeSending;
        alert(alertMessage);
    } else {

        var comment = $('textarea#commentSection').val();

        var eventPointer = {
            __type: 'Pointer',
            className: mainClass + eventsClass,
            objectId: eventId
        }

        if (member == undefined) {
            getMember();
            showNearestEvent();
        }


        var eventsAnswers = Parse.Object.extend(mainClass + eventsAnswersClass);
        var newAttendance = new eventsAnswers();
        newAttendance.set("attending", attending);
        newAttendance.set("comment", comment);
        newAttendance.set("member", member);
        newAttendance.set("event", eventPointer);
        newAttendance.set("team", klubbID)
        newAttendance.save(null, {
            success: function (newAttendance) {
                $("#saved").html(l.savedChanges);
                window.location.reload();
            },
            error: function (newPost, error) {
                console.log("Error:" + error.message);
                handleParseError();
            }
        });

    }
}

var running = false;

function showCreator() {

    if (document.getElementById("createEvent")) {
        if (running != false) {

        } else {

            var eventName = document.getElementById("eventName").value;
            var eventDescription = document.getElementById("eventDesc").value;

            var eventType;

            if (document.getElementById('training').checked) {
                eventType = "training";
            } else if (document.getElementById('other').checked) {
                eventType = "custom";
            }

            var daysArray = new Array();
            var timeArray = new Array();
            if (document.getElementById('check').checked) {

                var days = [l.mon, l.tue, l.wed, l.thu, l.fri, l.sat, l.sun];
                for (var k in days) {
                    if ($('#' + days[k]).is(":checked")) {
                        daysArray.push(true);

                        var timepicker = "#time-pick-" + days[k];

                        var dayTimepicker = $(timepicker).wickedpicker();
                        var eventTimes = dayTimepicker.wickedpicker('time');

                        var hours = eventTimes.substring(0, 2);
                        var minutes = eventTimes.substring(5, 7);

                        var ampm = eventTimes.substring(7, 9);

                        if (ampm == "PM") {
                            hours = parseInt(hours);
                            hours = hours + 12;
                        }

                        minutes = parseInt(minutes);
                        var timeFormat = hours + "." + minutes;

                        timeArray.push(timeFormat);

                    } else {
                        daysArray.push(false);
                        timeArray.push("");
                    }
                }

                var repeatingEvent = Parse.Object.extend(mainClass + repeatingEventsClass);
                var queryEvent = new Parse.Query(repeatingEvent);

                queryEvent.find({
                    success: function (results) {
                        if (results.length == 0) {
                            var createEvent = new repeatingEvent();
                            running = true;
                            createEvent.set("eventID", "training");
                            createEvent.set("weekdays", daysArray);
                            createEvent.set("startTimes", timeArray);
                            createEvent.set("comment", eventDescription);
                            createEvent.set("team", klubbID);

                            if (document.getElementById('check2').checked) {
                                createEvent.set("sendPush", true);
                            } else {
                                createEvent.set("sendPush", false);
                            }
                            createEvent.save({
                                success: function (results) {
                                    var outputCreator = "";

                                    outputCreator += '<div id="finCreate">';
                                    outputCreator += '<h4>' + l.newEventCreated + '!' + '</h4>';
                                    outputCreator += '</div>';

                                    $("#list-creator").html(outputCreator);
                                    running = false;
                                    setTimeout(
                                        function () {

                                            var outputCreator = "";

                                            $("#list-creator").html(outputCreator);

                                            showNearestEvent();

                                        }, 1500);
                                }
                            });
                        } else {
                            var updateEvent = results[0];
                            running = true;
                            updateEvent.set("eventID", "training");

                            updateEvent.set("weekdays", daysArray);
                            updateEvent.set("startTimes", timeArray);

                            if (document.getElementById('check2').checked) {
                                updateEvent.set("sendPush", true);
                            } else {
                                updateEvent.set("sendPush", false);
                            }
                            updateEvent.save({
                                success: function (results) {
                                    var outputCreator = "";

                                    outputCreator += '<div id="finCreate">';
                                    outputCreator += '<h4>' + l.newEventCreated + '!' + '</h4>';
                                    outputCreator += '</div>';

                                    $("#list-creator").html(outputCreator);

                                    running = false;

                                    setTimeout(
                                        function () {

                                            var outputCreator = "";

                                            $("#list-creator").html(outputCreator);

                                            showNearestEvent();
                                        }, 1500);
                                }
                            });
                        }
                    }
                });

            } else {
                var timepickers = $('#form-time').wickedpicker();
                var eventTime = timepickers.wickedpicker('time');

                var hours = eventTime.substring(0, 2);
                var minutes = eventTime.substring(4, 7);
                var ampm = eventTime.substring(7, 10);
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

                    var dateForPush = eventDate;
                    var pushComment = "";
                    var pushTiming = eventDate;

                    if (document.getElementById('checkPush').checked) {
                        pushComment = document.getElementById('push-comment-field').value;
                        var timepickers2 = $('#form-time-push').wickedpicker();
                        var pushT = timepickers2.wickedpicker('time');
                        var hours2 = pushT.substring(0, 2);
                        var minutes2 = pushT.substring(4, 7);

                        var ampm = pushT.substring(7, 10);

                        if (ampm == "PM") {
                            hours2 = parseInt(hours2);
                            hours2 = hours2 + 12;
                        }

                        minutes2 = parseInt(minutes2);

                        //pushTiming = dateForPush;
                        pushTiming.setHours(hours2);
                        pushTiming.setMinutes(minutes2);
                        console.log(pushTiming);
                    }


                    var newEvent = Parse.Object.extend(mainClass + eventsClass)
                    var createEvent = new newEvent();
                    //running = true;
                    createEvent.set("eventID", eventType);
                    createEvent.set("name", eventName);
                    createEvent.set("comment", eventDescription);
                    createEvent.set("team", klubbID);
                    console.log(pushTiming);
                    createEvent.set("pushTime", pushTiming);
                    createEvent.set("pushMessage", pushComment);
                    eventDate.setHours(hours);
                    eventDate.setMinutes(minutes);
                    console.log(eventDate);
                    createEvent.set("date", eventDate);
                    
                    createEvent.save({
                        success: function (event) {
                            var outputCreator = "";

                            outputCreator += '<div id="finCreate">';
                            outputCreator += '<h4>' + l.newEventCreated + '!' + '</h4>';
                            outputCreator += '</div>';

                            $("#list-creator").html(outputCreator);

                            running = false;

                            setTimeout(
                                function () {

                                    var outputCreator = "";

                                    $("#list-creator").html(outputCreator);

                                    showNearestEvent();


                                    localStorage.setItem("eventId", event.id);
                                    var date = eventDate.toUTCString();
                                    localStorage.setItem("eventDate", date);
                                    location.href = "events.html";

                                }, 1500);
                        },
                        error: function (error) {

                            console.log(error);
                        }
                    });

                }
            }


        }
    } else {

        var outputCreator = "";

        outputCreator += '<div id="createEvent">';

        outputCreator += '<button onclick="cancelEvent()">' + l.cancel + '</button>';
        outputCreator += '<h2 class="small-event-text">' + l.eventName + '</h2>';
        outputCreator += '<textarea id="eventName" placeholder="' + l.writeNameOfEvent + '"></textarea>';
        outputCreator += '<h2 class="small-event-text">' + l.eventDescription + '</h2>';
        outputCreator += '<textarea id="eventDesc" placeholder="' + l.writeDescriptionForEvent + '"></textarea>';
        outputCreator += '<form id="eventType">';
        outputCreator += '<input id="training" type="radio" name="gender" value="male" checked>' + l.practice + '<br>';
        outputCreator += '<input id="other" type="radio" name="gender" value="female">' + l.other + '<br>';
        outputCreator += '</form>';

        outputCreator += '<div class="date-switch" id="date-switch">';
        outputCreator += '<h3 id="single">' + l.oneTimeEvent + '</h3>';
        outputCreator += '<label class="switch">';
        outputCreator += '<input onclick="chooseTime()" id="check" autocomplete="off" type="checkbox">';
        outputCreator += '<div class="slider round"></div>';
        outputCreator += '</label>';
        outputCreator += '<h3 id="plural">' + l.repeating + '</h3>';
        outputCreator += '</div>';

        outputCreator += '<div id="once-date">';

        outputCreator += '<div id="once-event">';
        outputCreator += '<p id="date-pick">' + l.date + ': <input type="text" autocomplete="off" id="form-date" class="datepicker"></p>';
        outputCreator += '<p id="time-pick-once">' + l.time + ': <input type="text" autocomplete="off" id="form-time" class="timepicker"></p>';

        outputCreator += '<div id="push-box">';
        outputCreator += '<h2 id="pushText">Push:</h2>';
        outputCreator += '<div class="date-switch" id="push-switch">';
        outputCreator += '<h3 id="single">' + l.dontSend + '</h3>';
        outputCreator += '<label class="switch">';
        outputCreator += '<input onclick="pushChecked()" id="checkPush" autocomplete="off" type="checkbox">';
        outputCreator += '<div class="slider round"></div>';
        outputCreator += '</label>';
        outputCreator += '<h3 id="plural">' + l.send + '</h3>';
        outputCreator += '</div>';

        outputCreator += '</div>';

        outputCreator += '<div id="push-selected">';
        outputCreator += '<h3>' + l.pushMessage + '</h3>';
        outputCreator += '<textarea id="push-comment-field" placeholder="' + l.writePushMessage + '">' + l.standardPush + '</textarea>';
        outputCreator += '<h3>' + l.pushTime + '</h3>';
        outputCreator += '<p id="time-pick-push">' + l.time + ': <input type="text" autocomplete="off" id="form-time-push" class="timepicker"></p>';
        outputCreator += '</div>';
        outputCreator += '</div>';

        outputCreator += '</div>';
        outputCreator += '<div id="days" style="display: none;">';
        outputCreator += '<p class="day">' + l.mon + '<input class="day-checkbox" id="mon" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-mon" class="timepicker">';
        outputCreator += '<p class="day">' + l.tue + '<input class="day-checkbox" id="tue" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-tue" class="timepicker">';
        outputCreator += '<p class="day">' + l.wed + '<input class="day-checkbox" id="wed" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-wed" class="timepicker">';
        outputCreator += '<p class="day">' + l.thu + '<input class="day-checkbox" id="thu" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-thu" class="timepicker">';
        outputCreator += '<p class="day">' + l.fri + '<input class="day-checkbox" id="fri" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-fri" class="timepicker">';
        outputCreator += '<p class="day">' + l.sat + '<input class="day-checkbox" id="sat" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-sat" class="timepicker">';
        outputCreator += '<p class="day">' + l.sun + '<input class="day-checkbox" id="sun" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-sun" class="timepicker">';

        outputCreator += '<h2 id="pushText">Push:</h2>';
        outputCreator += '<div class="date-switch" id="push-switch">';
        outputCreator += '<h3 id="single">' + l.dontSend + '</h3>';
        outputCreator += '<label class="switch">';
        outputCreator += '<input onclick="chooseTime()" id="check2" autocomplete="off" type="checkbox">';
        outputCreator += '<div class="slider round"></div>';
        outputCreator += '</label>';
        outputCreator += '<h3 id="plural">' + l.send + '</h3>';
        outputCreator += '</div>';

        outputCreator += '</div>';

        outputCreator += '</div>';

        $("#list-creator").html(outputCreator);
        pushChecked();

        var timeString;
        if (language == "NO") {
            timeString = "Tid";

            $('.timepicker').wickedpicker({

                twentyFour: true,
                upArrow: 'wickedpicker__controls__control-up',
                downArrow: 'wickedpicker__controls__control-down',
                close: 'wickedpicker__close',
                hoverState: 'hover-state',
                title: timeString
            });
        } else {
            timeString = "Time";

            $('.timepicker').wickedpicker({

                twentyFour: false,
                upArrow: 'wickedpicker__controls__control-up',
                downArrow: 'wickedpicker__controls__control-down',
                close: 'wickedpicker__close',
                hoverState: 'hover-state',
                title: timeString
            });
        }
        $(function () {
            $(".datepicker").datepicker();
        });


    }
}


function cancelEvent() {
    var outputCreator = "";

    $("#list-creator").html(outputCreator);

}

function chooseTime() {

    if (document.getElementById('check').checked) {
        document.getElementById('days').style.display = 'block';
        document.getElementById('createbox').style = 'margin-top: 80px';
        document.getElementById('date-pick').style.display = 'none';
        document.getElementById('time-pick-once').style.display = 'none';
        document.getElementById('once-event').style.display = 'none';

        document.getElementById('training').checked = true;
        document.getElementById('other').disabled = true;
    } else {

        document.getElementById('days').style.display = 'none';
        document.getElementById('date-pick').style.display = 'block';
        document.getElementById('time-pick-once').style.display = 'block';
        document.getElementById('once-event').style.display = 'block';
        document.getElementById('createbox').style = 'margin-top: 30px';

        document.getElementById('other').disabled = false;


    }
}

function pushChecked() {

    if (document.getElementById('checkPush').checked) {

        document.getElementById('push-selected').style.display = 'block';

    } else {
        document.getElementById('push-selected').style.display = 'none';
    }

}
