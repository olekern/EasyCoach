Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var firstNameText;
var surnameText;
var nameText;
var phoneText;
var emailText;
var birthdateText;
var addressText;
var parentText;

var checkContent;
var notPremium;
if (language == "NO") {

    firstNameText = "Fornavn";
    surnameText = "Etternavn";
    nameText = "Navn";
    phoneText = "Mobil";
    emailText = "E-mail";
    birthdateText = "Fødselsdato";
    addressText = "Adresse";
    parentText = "Forelder";

    checkContent = "Sjekk at alle data stemmer før du importerer utøverne inn i laget";
    notPremium = "Du har nådd det maksimale antallet medlemmer du kan ha i et Basic lag. Gå til lagsiden og oppgrader til Premium for å legge til et ubegrenset antall medlemmer i laget.";

} else {

    firstNameText = "First name";
    surnameText = "Surname";
    nameText = "Name";
    phoneText = "Phone";
    emailText = "E-mail";
    birthdateText = "Birthdate";
    addressText = "Address";
    parentText = "Parent";

    checkContent = "Check that all of the data is correct before importing the athletes into the team";
    notPremium = "You have reached the maximum amount of members for a Basic team. Go to the team page to upgrade to Premium and be able to add an unlimited amount of members to your team.";
}

var membsInTeam = 0;

function getMembersInTeam() {
    var kickOut;
    var changeRole;
    var coach;
    if (language == "NO") {
        kickOut = "Spark ut";
        changeRole = "Endre rolle";
        coach = "Trener";
    } else {
        kickOut = "Kick out";
        changeRole = "Change role";
        coach = "Coach";
    }

    var Query = new Parse.Query(team);
    Query.include("user");
    Query.limit(10000);
    Query.equalTo("team", klubbID);
    Query.find({
        success: function (objects, results) {
            var output = "";


            for (var i = 0; i < objects.length; i++) {
                
                var member = objects[i];
                var memberRole = member.get("role");
                if ((memberRole == "trener")||(memberRole == "admin")||(memberRole == "spiller")) {
                    membsInTeam ++;
                }
            }

        },
        error: function (error) {
            console.log("Query error:" + error.message);
        }

    });


}
getMembersInTeam();


var cancel = false;

function Upload(confirmed) {
    console.log(membsInTeam);
    console.log(subscription);

    var query = new Parse.Query(mainClass + membersClass);

    var fileInput = document.getElementById('fileInput');

    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;

    if (regex.test(fileInput.value.toLowerCase())) {


        var parameters = []

        if (document.getElementById('firstName').checked) {
            parameters.push('firstname');
        }
        if (document.getElementById('surName').checked) {
            parameters.push('surname');
        }
        if (document.getElementById('phone-nr').checked) {
            parameters.push('phone');
        }
        if (document.getElementById('e-mail').checked) {
            parameters.push('email');
        }

        if (document.getElementById('birth-date').checked) {
            parameters.push('birthdate');
        }
        if (document.getElementById('addresses').checked) {
            parameters.push('address');
        }
        if (document.getElementById('parent1name').checked) {
            parameters.push('parent1name');
        }
        if (document.getElementById('parent1phone').checked) {
            parameters.push('parent1phone');
        }
        if (document.getElementById('parent1email').checked) {
            parameters.push('parent1email');
        }
        if (document.getElementById('parent2name').checked) {
            parameters.push('parent2name');
        }
        if (document.getElementById('parent2phone').checked) {
            parameters.push('parent2phone');
        }
        if (document.getElementById('parent2email').checked) {
            parameters.push('parent2email');
        }



        var reader = new FileReader();
        reader.onload = function () {

            var data = reader.result;
            var data1 = data;

            var array = data1.split('\r\n');
            var newArray = [];
            for (var i in array) {
                var member = array[i];
                var newMember = member.split(';');
                if (newMember != '') {
                    newArray.push(newMember);
                }

            }

            var outputTable = "";

            outputTable += '<h2 id="check-content">' + checkContent + '</h2>';
            outputTable += '<table>';
            outputTable += '<tr class="firstrow">';

            for (var m in parameters) {
                if (parameters[m] == 'firstname') {
                    outputTable += '<th>' + firstNameText + '</th>';
                }
                if (parameters[m] == 'surname') {
                    outputTable += '<th>' + surnameText + '</th>';
                }
                if (parameters[m] == 'phone') {
                    outputTable += '<th>' + phoneText + '</th>';
                }
                if (parameters[m] == 'email') {
                    outputTable += '<th>' + emailText + '</th>';
                }
                if (parameters[m] == 'birthdate') {
                    outputTable += '<th>' + birthdateText + '</th>';
                }
                if (parameters[m] == 'address') {
                    outputTable += '<th>' + addressText + '</th>';
                }
                if (parameters[m] == 'parent1name') {
                    outputTable += '<th>' + parentText + '1 ' + nameText + '</th>';
                }
                if (parameters[m] == 'parent1phone') {
                    outputTable += '<th>' + parentText + '1 ' + phoneText + '</th>';
                }
                if (parameters[m] == 'parent1email') {
                    outputTable += '<th>' + parentText + '1 ' + emailText + '</th>';
                }
                if (parameters[m] == 'parent2name') {
                    outputTable += '<th>' + parentText + '2 ' + nameText + '</th>';
                }
                if (parameters[m] == 'parent2phone') {
                    outputTable += '<th>' + parentText + '2 ' + phoneText + '</th>';
                }
                if (parameters[m] == 'parent2email') {
                    outputTable += '<th>' + parentText + '2 ' + emailText + '</th>';
                }
            }

            outputTable += '</tr>';
            for (var k in newArray) {

                var player = newArray[k];

                outputTable += '<tr class="otherrows">';
                var name = "";
                var phone = "";
                var email = "";
                var birthdate = "";
                var address = "";
                var parent1Name = "";
                var parent1Phone = "";
                var parent1Email = "";
                var parent2Name = "";
                var parent2Phone = "";
                var parent2Email = "";
                for (var j in player) {
                    if (parameters[j] == 'firstname') {
                        name = player[j];
                        outputTable += '<div id="name-box">';
                        outputTable += '<th id="first-name-box">' + name + '</th>';
                        outputTable += '</div>';
                    }
                    if (parameters[j] == 'surname') {
                        name = name + ' ' + player[j];
                        $("#name-box").html('');
                        outputTable += '<th>' + player[j] + '</th>';
                    }
                    if (parameters[j] == 'phone') {
                        phone = player[j];
                        outputTable += '<th>' + phone + '</th>';
                    }
                    if (parameters[j] == 'email') {
                        email = player[j];
                        outputTable += '<th>' + email + '</th>';
                    }
                    if (parameters[j] == 'birthdate') {
                        birthdate = player[j];
                        outputTable += '<th>' + birthdate + '</th>';
                    }
                    if (parameters[j] == 'address') {
                        address = player[j];
                        outputTable += '<th>' + address + '</th>';
                    }
                    if (parameters[j] == 'parent1name') {
                        parent1Name = player[j];
                        outputTable += '<th>' + parent1Name + '</th>';
                    }
                    if (parameters[j] == 'parent1phone') {
                        parent1Phone = player[j];
                        outputTable += '<th>' + parent1Phone + '</th>';
                    }
                    if (parameters[j] == 'parent1email') {
                        parent1Email = player[j];
                        outputTable += '<th>' + parent1Email + '</th>';
                    }
                    if (parameters[j] == 'parent2name') {
                        parent2Name = player[j];
                        outputTable += '<th>' + parent2Name + '</th>';
                    }
                    if (parameters[j] == 'parent2phone') {
                        parent2Phone = player[j];
                        outputTable += '<th>' + parent2Phone + '</th>';
                    }
                    if (parameters[j] == 'parent2email') {
                        parent2Email = player[j];
                        outputTable += '<th>' + parent2Email + '</th>';
                    }
                }

                outputTable += '</tr>';

                if (confirmed == "true") {
                    //alert("MAKE");

                    if ((name == " ") || (name == "") || (name == undefined)) {} else {

                        if ((subscription == "premium") || (membsInTeam < 25)) {

                            Parse.Cloud.run("registerMember", {
                                role: "spiller",
                                name: name,
                                phone: phone,
                                mail: email,
                                birthdate: birthdate,
                                address: address,
                                parent1Name: parent1Name,
                                parent1Phone: parent1Phone,
                                parent1Email: parent1Email,
                                parent2Name: parent2Name,
                                parent2Phone: parent2Phone,
                                parent2Email: parent2Email,
                                clubID: klubbID
                            }).then(function (response) {

                            });

                        } else {
                            cancel = true;
                            alert(notPremium);
                        }

                    }

                }

            }

            outputTable += '</table>';

            $("#display-table").html(outputTable);

            setTimeout(
                function () {
                    if (confirmed == "true") {
                        if (cancel == false) {
                            alert("Import finished");

                            location.href = "team.html";
                        } else if (cancel == true) {
                            location.href = "team.html";
                        }
                    }
                }, 1500);

        };
        reader.readAsText(fileInput.files[0]);


    } else {
        alert("Only CSV files are supported");
    }

}
