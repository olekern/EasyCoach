Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

function signUp() {
            var name = document.signup.elements[0].value;
            var mail = document.signup.elements[1].value;
            var pass = document.signup.elements[2].value;

            var user = new Parse.User();
            user.set("name", name);
            user.set("email", mail);
            user.set("username", mail)
            user.set("password", pass);

            user.signUp(null, {
                    success: function(user) {
                        console.log("New user signed up successfully!");
                        window.location = "club.html";
                        function logIn() {
            var email = mail;
            var passord = pass;
            
    

            Parse.User.logIn(email, passord, {
                    success: function() {
                        console.log("Innlogging  suksessfull");
                        window.location = "newsFeed.html";
                    },
                    error: function() {
                        console.log("Innlogging feilet:" + error.message);
                    }
                })
            return false;
        }
                    },
                    error: function(user, error) {
                        console.log("Error: " + error.code + "" + error.message);
                        alert("Her skjedde det visst en liten feil: " + error.message);
                    }
                });
            return false;
        }
        