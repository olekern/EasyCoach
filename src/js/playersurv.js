Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

            var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
            var Surveys = Parse.Object.extend("data_" + klubbID + "_Surveys");
            
            var oldSurv = new Array();
            var survName = new Array();
            var survQuestions = new Array();
            var survType = new Array();

            function getAnswers() {
                var Query = new Parse.Query(Surveys);
                Query.descending("day");
                Query.include("survey");

                var monthNames = [
                    "Jan", "Feb", "Mar",
                    "Apr", "May", "Jun", "Jul",
                    "Aug", "Sep", "Oct",
                    "Nov", "Dec"
                ];

                var daysOfTheWeek = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

                var date = new Date();
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var daysIndex = date.getMonth();
                var year = date.getFullYear();

                if (day < 10) {
                    var idag = monthNames[monthIndex] + " " + "0" + day + " " + year;
                } else {
                    var idag = monthNames[monthIndex] + " " + day + " " + year;
                }
                
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
                
                console.log(idag);

                Query.find({
                        success: function(objects) {
                                
                                var j = 0;
                                var survId = new Array();
                                var id = new Array();
                                var output = "";
                                var outputSurv = "";
                            for (var i = 0; i < objects.length; i++) {
                                
                                var surveyDate = objects[i].get("day");
                                
                                if(surveyDate <= date){ 
                                    
                                    var day2 = surveyDate.getDate();
                                    var monthIndex2 = surveyDate.getMonth();
                                    var daysIndex2 = surveyDate.getMonth();
                                    var year2 = surveyDate.getFullYear();

                                    if (day < 10) {
                                        var dateOfSurv = monthNames[monthIndex2] + " " + "0" + day2 + " " + year2;
                                    } else {
                                        var dateOfSurv = monthNames[monthIndex2] + " " + day2 + " " + year2;
                                    }

                                    surveyDate.setHours(23);
                                    surveyDate.setMinutes(59);
                                    surveyDate.setSeconds(59);
                                    
                                    var showDate = "";
                                    if(idag == dateOfSurv){
                                        showDate = "I dag";
                                    }else{
                                        showDate = dateOfSurv;
                                    }

                                    oldSurv[j] = objects[i];
                                    survId[j] = objects[i].id;
                                    survName[j] = objects[i].get("survey").get("name");
                                    survQuestions[j] = objects[i].get("survey").get("questions");
                                    survType[j] = objects[i].get("survey").get("questionTypeInfo");
                                    var h = 0;
                                    
                                    outputSurv += '<div id="surv">';
                                    outputSurv += '<h3 id="' + j +'" onclick="chooseSurv(id);">' + survName[j] + '</h3>';
                                    outputSurv += '<h4>' + showDate +'</h4>';
                                    outputSurv += '</div>';
                                    
                                    
                                    $("#list-surv").html(outputSurv);
                                    
                                    j++;
                                }
                                
                            }
                            
                        },
                        error: function(error) {
                            console.log("Query error:" + error.message);
                        }

                    });


            }

            
            function chooseSurv(number, name){
                
                var j = number;
                var question = new Array();
                question = survQuestions[j];
                
                var questionType = new Array();
                questionType = survType[j];
                
                var outputans = "";
                var outputnone = "";
                
                $("#draw-charts").html(outputnone);
                
                var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
                var query = new Parse.Query(SurveyAnswer);
                query.descending("createdAt");
                query.include("author");
                query.include("survey");
                query.equalTo("survey", oldSurv[j]);
                query.find({
                    success: function(results) {
                        
                            google.charts.load('current', {
                              callback: function () {
                                for(var u = 0; u<question.length; u++){
                                    if(questionType[u]/1){
                                        
                                        var questions = question[u];
                                        
                                  var container = document.getElementById('draw-charts').appendChild(document.createElement('div'));

                                  var data = new google.visualization.DataTable();
                                data.addColumn('string');
                                data.addColumn('number');
                                
                                    for(var k in results){
                                        
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
                                    width:700,
                                    colors: ['#3f88c5'],
                                };
                                  var chart = new google.visualization.BarChart(container);
                                  chart.draw(data, options);
                                }
                                }
                              },
                              packages: ['corechart']
                            });
                                    
                            for(var u = 0; u<question.length; u++){
                                
                                var questions = question[u];
                                outputans += '<div id="ansbox">';
                                if(questionType[u]/1){
                                }else if((questionType[u] == "NO") || (questionType[u] == "YES")){
                                    console.log("AF");
                                    for(var k in results){
                                    
                                    var answer = results[k].get("data")[u];
                                    var author = results[k].get("author");
                                    var name = author.get("name");
                                    outputans += '<h4>' + name + '</h4>';
                                        
                                    if(answer[4] == 'YES±'){
                                    var yes = answer.split("±").pop();
                                    outputans += '<p>Ja</p>';
                                    outputans += '<p>' + yes + '</p>';
                                    }else if(answer[3] == 'NO±){
                                    var no = answer.split("±").pop();
                                    outputans += '<p>Nei</p>';
                                    outputans += '<p>' + no + '</p>';
                                    }
                                    outputans += '</div>';   
                                }
                                    
                                } else{
                                
                                outputans += '<h2>' + questions + '</h2>';
                                
                                for(var k in results){
                                    
                                    var answer = results[k].get("data")[u];
                                    var author = results[k].get("author");
                                    var name = author.get("name");
                                    outputans += '<h4>' + name + '</h4>';
                                    outputans += '<p>' + answer + '</p>';
                                    outputans += '</div>';   
                                }
                                
                            }
                        
                            $("#list-answ").html(outputans);
                        
                        }
                    
                    }
                        
                    });
                           
                           }

            getAnswers();
