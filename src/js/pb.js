Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse'; 

function getPB() {
                var outputImg = "";
                var user = Parse.User.current();
                var userImg = "";
                var noUserImg = "";
                if (user.get("profileImage_small")) {
                    var brukerPB = user.get("profileImage_small");
                    var PBUrl = brukerPB.url();
                    userImg = "<img src='" + PBUrl + "'>";
                } else{
                    noUserImg = '<img src="./src/img/User_Small.png">';
                }
                outputImg += "<div id=\"userPB\">";
                outputImg += userImg;
                outputImg += noUserImg;
                outputImg += "</div>"
                $("#list-pb").html(outputImg);
                $("#profile-pb").html(outputImg);
}

getPB();
