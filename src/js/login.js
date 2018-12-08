Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse'; 
        
        function logIn() {
            var name = document.login.elements[0].value;
            var pass = document.login.elements[1].value;
            

            var loginError = "";

            Parse.User.logIn(name, pass, {
                    success: function() {
                        window.location = "home.html";
                    },
                    error: function(error) {
                        console.log("Innlogging feilet:" + error.message);
                        alert('Something went wrong. Please check that both your email and password are correct.');
                    }
                });
            return false;
        }