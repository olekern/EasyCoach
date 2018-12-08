Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var mainClass = "data_umCaWls7lR_";
var membersClass = "Members";
var surveysClass = "Surveys";
var surveysAnswersClass = "Surveys_Answers";
var eventsClass = "Events";

var eventsArray = new Array();

function findEvents() {
    var events = Parse.Object.extend(mainClass + eventsClass);
    var queryEvents = new Parse.Query(events);
    queryEvents.limit(10000);
    queryEvents.equalTo("team", klubbID);
    queryEvents.find({
        success: function (objects) {

            for (var k in objects) {

                var eventDate = objects[k].get("date");
                var eventName = objects[k].get("name");
                var eventType = "event";
                if (eventName == undefined) {
                    eventName = "Practice";
                }
                var eventId = objects[k].id;

                var activity = {
                    date: eventDate,
                    title: eventName,
                    id: eventId,
                    description: eventType
                };

                eventsArray.push(activity);
            }
            findSurveys();
        }
    });

}
findEvents();

function findSurveys() {
    var reports = Parse.Object.extend(mainClass + surveysClass);
    var query = new Parse.Query(reports);
    query.descending("createdAt");
    query.include("survey");
    query.limit(10000)
    query.equalTo("team", klubbID);
    query.find({
        success: function (results) {
            for (var i in results) {
                var surveyId;
                var surveyDate;
                var surveyName;
                var eventType = "survey";
                var yesNo;
                if (results[i].id != undefined) {
                    surveyId = results[i].id;
                } else {
                    yesNo = "No";
                }

                if (results[i].get("day") != undefined) {
                    surveyDate = results[i].get("day");
                } else {
                    yesNo = "No";
                }

                if (results[i].get("survey") != undefined) {
                    surveyName = results[i].get("survey").get("name");

                } else {
                    yesNo = "No";
                }


                var activity = {
                    date: surveyDate,
                    title: surveyName,
                    id: surveyId,
                    description: eventType
                };

                if (yesNo != "No") {
                    eventsArray.push(activity);
                }

            }
            createCalendar();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function createCalendar() {
    $('#list-calendar').fullCalendar({
        // put your options and callbacks here
        height: 600,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        },
        events: eventsArray,
        eventClick: function (calEvent, jsEvent, view) {

            var eventId = calEvent.id;
            var eventTitle = calEvent.title;
            var eventType = calEvent.description;
            var eventDate = calEvent.date;
            if (eventType == "survey") {
                localStorage.setItem("surveyId", eventId);
                location.href = "answers.html";
            } else if (eventType == "event") {
                localStorage.setItem("eventId", eventId);
                var date = eventDate.toUTCString();
                localStorage.setItem("eventDate", date);
                location.href = "events.html";
            }

        }
    })
}


function chooseSurv(surveyId, surveyTitle) {
    //	document.getElementById('simpleSurv').style.display = 'block';
    var outputans = "";
    var outputnone = "";

    var out = "";
    out += '<h1>' + surveyTitle + '</h1>';
    $("#listing").html(out);

    $("#draw-charts").html(outputnone);

    var SurveyAnswer = Parse.Object.extend(mainClass + surveysAnswersClass);
    var query = new Parse.Query(SurveyAnswer);
    query.descending("createdAt");
    query.include("author");
    query.include("survey");
    query.equalTo("survey", surveyId);
    query.equalTo("team", klubbID);
    query.find({
        success: function (results) {
            google.charts.load('current', {
                callback: function () {
                    for (var u = 0; u < question.length; u++) {
                        if (questionType[u] / 1) {

                            var questions = question[u];

                            var container = document.getElementById('draw-charts').appendChild(document.createElement('div'));

                            var data = new google.visualization.DataTable();
                            data.addColumn('string');
                            data.addColumn('number');

                            for (var k in results) {

                                var answer = results[k].get("data")[u];
                                var answerNumber = Number(answer);
                                var author = results[k].get("author");
                                var name = author.get("name");

                                data.addRows([
                                          [name, answerNumber]
                                        ]);
                            }

                            var options = {
                                title: questions,
                                width: 700,
                                colors: ['#3f88c5'],
                            };
                            var chart = new google.visualization.BarChart(container);
                            chart.draw(data, options);
                        }
                    }
                },
                packages: ['corechart']
            });

            for (var u = 0; u < question.length; u++) {

                var questions = question[u];
                outputans += '<div class="ansbox">';
                if (questionType[u] / 1) {} else if ((questionType[u] == "NO") || (questionType[u] == "YES")) {

                    outputans += '<h2>' + questions + '</h2>';

                    for (var k in results) {
                        var answer = results[k].get("data")[u];
                        var author = results[k].get("author");
                        var name = author.get("name");

                        var userSurvId = results[k].id;

                        outputans += '<h4 id="' + userSurvId + '" onclick="playerSurv(id)">' + name + '</h4>';
                        if (answer[0] == 'Y') {
                            var yes = answer.split("±").pop();
                            outputans += '<p>Ja</p>';
                            outputans += '<p>' + yes + '</p>';
                        } else {
                            var no = answer.split("±").pop();
                            outputans += '<p>Nei</p>';
                            outputans += '<p>' + no + '</p>';
                        }
                        outputans += '</div>';
                    }
                } else {

                    outputans += '<h2>' + questions + '</h2>';

                    for (var k in results) {

                        var answer = results[k].get("data")[u];
                        var author = results[k].get("author");
                        var name = author.get("name");

                        var userSurvId = results[k].id;

                        outputans += '<h4 id="' + userSurvId + '" onclick="playerSurv(id)">' + name + '</h4>';
                        outputans += '<p>' + answer + '</p>';
                        outputans += '</div>';
                    }

                }

                $("#list-answ").html(outputans);

            }
        }

    });

}
$(document).click(function (event) {
    if (!$(event.target).closest('#survey-box').length) {
        if ($('#survey-box').is(":visible")) {
            var output = "";

            $("#simpleSurv").html(output);

            document.getElementById('simpleSurv').style.display = 'none';
        }
    }
})
