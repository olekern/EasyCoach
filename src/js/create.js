function show() {
    if (document.getElementById('days').style.display == 'none') {
        document.getElementById('days').style.display = 'block';
        document.getElementById('date-pick').style.display = 'none';
    }
    return false;
}

function hide() {
    if (document.getElementById('days').style.display == 'block') {
        document.getElementById('days').style.display = 'none';
        document.getElementById('date-pick').style.display = 'block';
    }
    return false;
}

Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var mainClass = "data_umCaWls7lR_";
var membersClass = "Members";
var surveysClass = "Surveys";
var surveyClass = "Survey";


var questionText;
var text;
var rating;
var picker;
var yesnocomment;
var datetime;
var textOnly;
var withComment;
var addComment;

var answertype;
var alternative;
var addAlternativeText;
var writeAlternative;
var yes;
var no;
if (language == "NO") {
    questionText = "Spørsmål";
    text = "Tekst";
    rating = "Rating";
    picker = "Velger";
    yesnocomment = "Ja/nei med kommentar";
    datetime = "Dato/klokkeslett";
    addComment = "Her kan utøverne legge en  kommentar";
    withComment = "Med kommentar";

    answertype = "Svartype";
    alternative = "Alternativ";
    addAlternativeText = "Legg til alternativ";
    writeAlternative = "Skriv inn alternativ";
    yes = "Ja";
    no = "Nei";
    textOnly = "Skrives kun med tekst slik som her";
} else {
    questionText = "Question";
    text = "Text";
    rating = "Rating";
    picker = "Picker";
    yesnocomment = "Yes/no with a comment"
    datetime = "Date/time";
    addComment = "Let the athletes write a comment."
    withComment = "With a comment";

    answertype = "Answer type";
    alternative = "Alternative";
    addAlternativeText = "Add alternative";
    writeAlternative = "Write the alternative";
    yes = "Yes";
    no = "No";

    textOnly = "Only text input";
}

var survDate;
var weekdays = new Array();

function checkLogin() {
    if (Parse.User.current) {
        $("#brukernavn").html(Parse.User.current().get("name"));
    } else {
        $("#brukernavn").html("");
    }
}
checkLogin();


var outputQuestion = "";
var number = 0;
var pickernr = 0;

createQuest();

function chooseTime() {

    if (document.getElementById('check').checked) {
        show();

        date = undefined;

    } else {
        hide();
    }
}

$("#form-date").datepicker({
    onSelect: function (date) {
        date = $(this).datepicker('getDate');
        survDate = date;

    }
});


function createQuest() {
    number++;
    chooseTime();

    pickernr = 0;
    outputAlt = "";
    outputQuestion = "";

    outputQuestion += '<div class="questionDiv" id="question' + number + '>';
    outputQuestion += '<p id="k"></p>';
    outputQuestion += '<h3>' + questionText + ' ' + number + '</h3>';
    outputQuestion += '<form name="choose">';
    outputQuestion += '<textarea rows="1" cols="30" class="question-title" id="question' + number + '" name="text" placeholder="' + questionText + '"></textarea>';
    outputQuestion += '<div class="choose-type">';
    outputQuestion += '<p>' + answertype + '</p>';
    outputQuestion += '<select id="sel' + number + '" name="' + number + '" onchange="selectChosen(name)">';
    outputQuestion += '<option id="' + number + '" value="TEXT">' + text + '</option>';
    outputQuestion += '<option id="' + number + '" value="SLIDER">' + rating + '</option>';
    outputQuestion += '<option id="' + number + '" value="COMMENT">' + yesnocomment + '</option>';
    outputQuestion += '<option id="' + number + '" value="PICKER">' + picker + '</option>';
    outputQuestion += '<option id="' + number + '" value="DATE">' + datetime + '</option>';
    outputQuestion += '</select>';
    outputQuestion += '</p>';
    outputQuestion += '</div>';

    outputQuestion += '<ul id="list-quest' + number + '" class="list-question">';
    outputQuestion += '</ul>';
    outputQuestion += '</form>';
    outputQuestion += '</div>';
    $("#list-create-doc").append(outputQuestion);
    selectChosen(number);
}

function deleteAll() {
    outputQuestion = "";
    $("#list-create-doc").html(outputQuestion);
    number = 0;
}

function selectChosen(nr) {
    var id = "sel" + nr;

    var questionType = document.getElementById(id);
    var type = questionType.options[questionType.selectedIndex].value;

    if (type == "TEXT") {
        var outputQuest1 = "";

        function textChosen(nr) {
            outputQuest1 = "";

            outputQuest1 += '<div class="textbox" id="txt">';
            outputQuest1 += '<textarea rows="1" cols="30" placeholder="' + textOnly + '"></textarea>';
            outputQuest1 += '</div>';

            var whereAdd = "#list-quest" + nr;
            $(whereAdd).html(outputQuest1);
        }
        textChosen(nr);
    } else if (type == "SLIDER") {

        var outputQuest2 = "";

        function ratingChosen(nr) {
            outputQuest2 = "";

            outputQuest2 += '<div class="rating" id="' + nr + '" onclick="showRatCom(id)">';
            outputQuest2 += '<p class="comment-check">' + withComment + '<input id="commentCheck' + nr + '" class="day-checkbox" type="checkbox"></p>';

            outputQuest2 += '<div class="choose-nr">';
            outputQuest2 += '<form>';
            outputQuest2 += '<input class="day-checkbox" id="onetofive' + nr + '" value="1" type="radio" name="gender" checked>1-5<br>';
            outputQuest2 += '<input class="day-checkbox" id="onetoten' + nr + '" type="radio" name="gender" >1-10<br>';
            outputQuest2 += '<input class="day-checkbox" id="onetotwelve' + nr + '" type="radio" name="gender">1-12<br>';
            outputQuest2 += '</form>';
            outputQuest2 += '</div>';
            outputQuest2 += '</div>';

            outputQuest2 += '<ul id="list-rating' + nr + '">';
            outputQuest2 += '</ul>';

            var whereAdd = "#list-quest" + nr;
            $(whereAdd).html(outputQuest2);

        }

        ratingChosen(nr);
        showRatCom(nr);

    } else if (type == "COMMENT") {

        var outputQuest3 = "";

        function yesnoChosen(nr) {
            outputQuest3 = "";

            outputQuest3 += '<div class="yesno">';
            outputQuest3 += '<div id="' + nr + '" onclick="yesChosen(id)">';
            outputQuest3 += '<div class="date-switch" id="yesnoSwitch">';
            outputQuest3 += '<h3 id="single">' + no + '</h3>';
            outputQuest3 += '<label class="switch">';
            outputQuest3 += '<input id="yesnoCheck' + nr + '" autocomplete="off" type="checkbox">';
            outputQuest3 += '<div class="slider round"></div>';
            outputQuest3 += '</label>';
            outputQuest3 += '<h3 id="plural">' + yes + '</h3>';
            outputQuest3 += '</div>';
            outputQuest3 += '</div>';
            outputQuest3 += '<ul id="list-text' + nr + '">';
            outputQuest3 += '</ul>';
            outputQuest3 += '</div>';

            var whereAdd = "#list-quest" + nr;
            $(whereAdd).html(outputQuest3);
        }
        yesnoChosen(nr);

    } else if (type == "PICKER") {
        var outputQuest4 = "";

        function pickerChosen(nr) {
            
            pickernr = 0;
            outputQuest4 = "";

            outputQuest4 += '<div class="add-alternativ">';
            outputQuest4 += '<div class="add-alt" id="' + nr + '" onclick="addAlternative(id)">';
            outputQuest4 += '<i class="material-icons">add_circle</i>';
            outputQuest4 += '<p>' + addAlternativeText + '</p>';
            outputQuest4 += '</div>';

            outputQuest4 += '<ul id="list-alt' + nr + '">';
            outputQuest4 += '</ul>';

            outputQuest4 += '<select>';
            outputQuest4 += '<option id="' + number + '" name="TEXT">' + alternative + ' 1</option>';
            outputQuest4 += '<option id="' + number + '" name="SLIDER" >' + alternative + ' 2</option>';
            outputQuest4 += '<option id="' + number + '" name="COMMENT" >Etc.</option>';
            outputQuest4 += '</select>';
            outputQuest4 += '</div>';

            var whereAdd = "#list-quest" + nr;
            $(whereAdd).html(outputQuest4);

            addAlternative(nr);
        }
        pickerChosen(nr);
    } else if (type == "DATE") {
        var outputQuest5 = "";

        function dateChosen(nr) {
            outputQuest5 = "";

            outputQuest5 += '<div id="' + nr + '"  class="date-time" onclick="addTime(id)">';
            outputQuest5 += '<form>';
            outputQuest5 += '<input class="day-checkbox" value="time-rad' + nr + '" type="radio" class="time-rad" name="gender" id="time-rad' + nr + '" checked>Klokkeslett<br>';
            outputQuest5 += '<input class="day-checkbox" value="date-rad' + nr + '" type="radio" name="gender" id="date-rad' + nr + '">Dato<br>';
            outputQuest5 += '</form>';
            outputQuest5 += '</div>';

            outputQuest5 += '<ul id="list-time' + nr + '">';
            outputQuest5 += '</ul>';

            var whereAdd = "#list-quest" + nr;
            $(whereAdd).html(outputQuest5);

            addTime(nr);
        }

        dateChosen(nr);

    }
}

var outputRating = "";
var outputComment = "";

function showRatCom(nr) {
    outputRating = "";
    if (document.getElementById('onetofive' + nr).checked) {

        outputRating += '<div id="rangeSlider">';
        outputRating += '<p>1';
        outputRating += '<input type="range" name="ageInputName" id="ageInputId" value="1" min="1" max="5" oninput="ageOutputId.value = ageInputId.value">';
        outputRating += '5';
        outputRating += '</p>';
        outputRating += '<output name="ageOutputName" class="output-number" id="ageOutputId">1</output>';
        outputRating += '</div>';

    } else if (document.getElementById('onetoten' + nr).checked) {

        outputRating += '<div id="rangeSlider">';
        outputRating += '<p>1';
        outputRating += '<input type="range" name="ageInputName" id="ageInputId" value="1" min="1" max="10" oninput="ageOutputId.value = ageInputId.value">';
        outputRating += '10';
        outputRating += '</p>';
        outputRating += '<output name="ageOutputName" class="output-number" id="ageOutputId">1</output>';
        outputRating += '</div>';

    } else if (document.getElementById('onetotwelve' + nr).checked) {

        outputRating += '<div id="rangeSlider">';
        outputRating += '<p>1';
        outputRating += '<input type="range" name="ageInputName" id="ageInputId" value="1" min="1" max="12" oninput="ageOutputId.value = ageInputId.value">';
        outputRating += '12';
        outputRating += '</p>';
        outputRating += '<output name="ageOutputName" class="output-number" id="ageOutputId">1</output>';
        outputRating += '</div>';

    }

    var comcheck = "commentCheck" + nr;
    if (document.getElementById(comcheck).checked) {
        outputRating += '<textarea rows="1" cols="30" class="ratingText" placeholder="' + addComment + '"></textarea>';
    }
    var whereAdd = "#list-rating" + nr;
    $(whereAdd).html(outputRating);
}

var outputTextArea = "";

function yesChosen(nr) {
    outputTextArea = "";
    var whereAdd = "#list-text" + nr;
    if (document.getElementById('yesnoCheck' + nr).checked) {
        outputTextArea += '<textarea rows="1" cols="30" class="yesText" placeholder="' + addComment + '"></textarea>';

        $(whereAdd).html(outputTextArea);
    } else {
        $(whereAdd).html(outputTextArea);
    }
}

function addAlternative(nr) {
    
    pickernr++;
    var outputAlt = "";

    outputAlt += '<div class="alt">';
    outputAlt += '<textarea rows="1" cols="30" class="alternativ' + nr + '" id="alternativ' + nr + pickernr + '" placeholder="Skriv inn alternativ"></textarea>';
    outputAlt += '</div>';

    var addAlt = "#list-alt" + nr;
    $(addAlt).append(outputAlt);
    

}


var outputTime = "";

function addTime(nr) {
    var outputTime = "";

    if (document.getElementById('time-rad' + nr).checked) {

        outputTime = '<p id="time-pick">Tid: <input type="text" name="timepicker" class="timepicker"></p>';

    } else if (document.getElementById('date-rad' + nr).checked) {

        outputTime += '<p id="date-pick">Dato: <input type="text" autocomplete="off" class="datepicker"></p>';
    }

    var whereAdd = "#list-time" + nr;
    $(whereAdd).html(outputTime);

    $(function () {
        $(".datepicker").datepicker();
    });

    $('.timepicker').wickedpicker({

        twentyFour: true,
        upArrow: 'wickedpicker__controls__control-up',
        downArrow: 'wickedpicker__controls__control-down',
        close: 'wickedpicker__close',
        hoverState: 'hover-state',
        title: 'Tid'
    });
}

function sendForm() {
    console.log("Form");
    weekdays.length = 0;

    if (document.getElementById('check').checked) {

        if (document.getElementById('mon').checked) {
            weekdays.push(true);
        } else {
            weekdays.push(false);
        }
        if (document.getElementById('tue').checked) {
            weekdays.push(true);
        } else {
            weekdays.push(false);
        }
        if (document.getElementById('wed').checked) {
            weekdays.push(true);
        } else {
            weekdays.push(false);
        }
        if (document.getElementById('thu').checked) {
            weekdays.push(true);
        } else {
            weekdays.push(false);
        }
        if (document.getElementById('fri').checked) {
            weekdays.push(true);
        } else {
            weekdays.push(false);
        }
        if (document.getElementById('sat').checked) {
            weekdays.push(true);
        } else {
            weekdays.push(false);
        }
        if (document.getElementById('sun').checked) {
            weekdays.push(true);
        } else {
            weekdays.push(false);
        }
    } else {
        weekdays = [false, false, false, false, false, false, false];
    }


    var name = document.getElementById('title').value;

    var questionTypes = new Array();
    var questions = new Array();
    var questionTypeInfo = new Array();
    for (var i = 1; i <= number; i++) {
        var id = "sel" + i;
        var id2 = "question" + i;

        var question = document.getElementById(id2).value;
        var questionType = document.getElementById(id);
        var type = questionType.options[questionType.selectedIndex].value;

        questions.push(question);

        if (type == "SLIDER") {

            if (document.getElementById('commentCheck' + i).checked) {
                questionTypes.push("SLIDERCOMMENT");
            } else {
                questionTypes.push(type);
            }
        } else {
            questionTypes.push(type);
        }

        if (type == "PICKER") {
            var altclass = '.alternativ' + i;
            var altlength = $(altclass).length;
            var typeAdd = "";

            for (var j = 1; j <= altlength; j++) {
                var altid = 'alternativ' + i + j;
                var altvalue = document.getElementById(altid).value;

                if (j != altlength) {
                    typeAdd += altvalue + ";";
                } else {
                    typeAdd += altvalue;
                }
            }

            questionTypeInfo.push(typeAdd);

        } else if (type == "SLIDER") {

            if (document.getElementById('onetofive' + i).checked) {
                questionTypeInfo.push("5");
            } else if (document.getElementById('onetoten' + i).checked) {
                questionTypeInfo.push("10");
            } else if (document.getElementById('onetotwelve' + i).checked) {
                questionTypeInfo.push("12");
            }

        } else if (type == "DATE") {

            if (document.querySelector('input[value=time-rad' + i + ']').checked) {
                questionTypeInfo.push("TIME");
            } else if (document.querySelector('input[value=date-rad' + i + ']').checked) {
                questionTypeInfo.push("DAY");
            }
        } else {
            questionTypeInfo.push("");
        }
    }
    var active = true;
    var expirationDays = 365;

    var createForm = Parse.Object.extend(mainClass + surveyClass);
    var formCreate = new createForm();

    formCreate.set("active", active);
    formCreate.set("expirationDays", expirationDays);
    formCreate.set("weekdays", weekdays);
    formCreate.set("name", name);
    formCreate.set("questions", questions);
    formCreate.set("questionTypeInfo", questionTypeInfo);
    formCreate.set("date", survDate);
    formCreate.set("questionTypes", questionTypes);
    formCreate.set("team", klubbID);
    
    formCreate.save(null, {
        success: function (formCreate) {

            var todayDate = new Date();

            survDate.setHours(23);
            survDate.setMinutes(59);
            survDate.setSeconds(59);

            todayDate.setHours(23);
            todayDate.setMinutes(59);
            todayDate.setSeconds(59);
            todayDate.setMilliseconds(0);

            if (survDate.getTime() === todayDate.getTime()) {
                var survId = formCreate;

                var setForm = Parse.Object.extend(mainClass + surveysClass);
                var formSet = new setForm();

                formSet.set("day", survDate);
                formSet.set("survey", survId);
                formSet.set("team", klubbID);
                formSet.save(null, {
                    success: function () {
                        window.location = "answers.html";
                    }
                });

            } else {
                window.location = "answers.html";
            }

        },
        error: function (error) {
            console.log("Noe feilet:" + error.message);
        }

    });

}
