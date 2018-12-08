Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var mainClass = "data_umCaWls7lR_";
var membersClass = "Members";
var eventsClass = "Events";
var eventsAnswersClass = "Events_Answers";
var teamClass = "Teams";

var teams = Parse.Object.extend(teamClass);
var query = new Parse.Query(teams);

var teamArray = new Array();
query.equalTo("objectId", klubbID);
query.find({
    success: function (results) {
        var team = results[0];
        var teamName = team.get("Name");
        teamArray.push(teamName);
    }
});

var periodText;
var name;
var attendedText;
var notAttendedText;
var notAnsweredText;
var attendedPercentageText;
var notAttendedPercentageText;

var monthNames;
var daysOfTheWeek;

var upgradeText;

if (language == "NO") {
    attendedText = "Deltatt";
    notAttendedText = "Ikke deltatt";
    notAnsweredText = "Ingen svar registrert";
    attendedPercentageText = "Oppmøte i prosent";
    notAttendedPercentageText = "Fravær i prosent";
    periodText = "Periode";
    name = "Navn";

    monthNames = [
                    "Jan", "Feb", "Mar",
                    "Apr", "Mai", "Jun", "Jul",
                    "Aug", "Sep", "Okt",
                    "Nov", "Des"
                ];

    daysOfTheWeek = ["Tor", "Fre", "Lør", "Søn", "Man", "Tir", "Ons"];
    
    upgradeText = "Oppgrader";
} else {
    name = "Name";
    attendedText = "Attended";
    notAttendedText = "Not attended";
    notAnsweredText = "No answers registered";
    attendedPercentageText = "Attended in percent";
    notAttendedPercentageText = "Not attended in percent";
    periodText = "Period";

    monthNames = [
                    "Jan", "Feb", "Mar",
                    "Apr", "May", "Jun", "Jul",
                    "Aug", "Sep", "Oct",
                    "Nov", "Dec"
                ];

    daysOfTheWeek = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
    
    upgradeText = "Upgrade";
}

function downloadCsv() {
    console.log(playersAttendance);
    if (subscription == "premium") {
        var day = toDate.getDate();
        var monthIndex = toDate.getMonth();
        var daysIndex = toDate.getMonth();
        var year = toDate.getFullYear();

        if (day < 10) {
            var to = monthNames[monthIndex] + " " + "0" + day + " " + year;
        } else {
            var to = monthNames[monthIndex] + " " + day + " " + year;
        }

        var day2 = fromDate.getDate();
        var monthIndex2 = fromDate.getMonth();
        var daysIndex2 = fromDate.getMonth();
        var year2 = fromDate.getFullYear();

        if (day2 < 10) {
            var from = monthNames[monthIndex2] + " " + "0" + day2 + " " + year2;
        } else {
            var from = monthNames[monthIndex2] + " " + day2 + " " + year2;
        }


        var data = [
        teamArray,
        [periodText + ': ' + from + ' - ' + to],
        practiceCount,
        [],
        [name, attendedText, notAttendedText, notAnsweredText, attendedPercentageText, notAttendedPercentageText]
    ];

        for (var i in playersAttendance) {
            data.push(playersAttendance[i]);
        }


        // Building the CSV from the Data two-dimensional array
        // Each column is separated by ";" and new line "\n" for next row
        var csvContent = '';
        data.forEach(function (infoArray, index) {
            dataString = infoArray.join(';');
            csvContent += index < data.length ? dataString + '\n' : dataString;
        });

        // The download function takes a CSV string, the filename and mimeType as parameters
        // Scroll/look down at the bottom of this snippet to see how download is called
        var download = function (content, fileName, mimeType) {
            var a = document.createElement('a');
            mimeType = mimeType || 'application/octet-stream';

            if (navigator.msSaveBlob) { // IE10
                navigator.msSaveBlob(new Blob([content], {
                    type: mimeType
                }), fileName);
            } else if (URL && 'download' in a) { //html5 A[download]
                a.href = URL.createObjectURL(new Blob([content], {
                    type: mimeType
                }));
                a.setAttribute('download', fileName);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
            }
        }


        var BOM = "\uFEFF";
        download(BOM + csvContent, 'attendance-stats.csv', 'text/csv;encoding:utf-8');

    } else {
        var imgOutput = "";
        imgOutput += '<div id="img" class="noAction">';
        if (language == "NO") {
            imgOutput += '<img src="./src/img/premium_Information_NO.png">';
        } else {
            imgOutput += '<img src="./src/img/premium_Information_EN.png">';

        }
        imgOutput += '<a href="payments.html">' + upgradeText + '!</a>';
        imgOutput += '</div>';
        $("#showBenefits").html(imgOutput);
        
        document.getElementById('showBenefits').style.display = 'block';

    }
}

$(document).click(function (event) {
    if (!$(event.target).closest('.noAction').length) {
        if ($('.noAction').is(":visible")) {
            document.getElementById('showBenefits').style.display = 'none';
        }
    }
});
