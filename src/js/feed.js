Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var mainClass = "data_umCaWls7lR_";
var postsClass = "Posts";
var commentsClass = "Comments";
var groupsClass = "Groups";

function show() {
    if (document.getElementById('comments').style.display == 'none') {
        document.getElementById('comments').style.display = 'block';
    }
    return false;
}

function hide() {
    if (document.getElementById('comments').style.display == 'block') {
        document.getElementById('comments').style.display = 'none';
    }
    return false;
}

function handleParseError(err) {
    switch (err.code) {
        case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut();
            location.href = "registration.html";
            break;
    }
}
var currentUserName = Parse.User.current().get("name");
var currentUserId = Parse.User.current().id;

function chooseGroup() {

    var groupSpecification;
    if (language == "NO") {
        groupSpecification = "Spesifiser gruppe for at kun enkelte brukere skal kunne se innlegget";
    } else {
        groupSpecification = "Specify group to limit who can see the post";
    }

    var outputGroup = "";
    outputGroup += '<div id="groupSet">';
    outputGroup += '<i id="group" class="material-icons">group</i>';
    outputGroup += '<i id="info" class="material-icons">info</i>';
    outputGroup += '<div id="group-info">';
    outputGroup += '<p>' + groupSpecification + '</p>';
    outputGroup += '</div>';
    outputGroup += '<select class="select-members" id="selectmemb" multiple="multiple">';

    var groups = Parse.Object.extend(mainClass + postsClass);
    var queryGroups = new Parse.Query(groups);
    queryGroups.include("members.user");
    queryGroups.equalTo("team", klubbID);
    queryGroups.find({
        success: function (results) {
            for (var j in results) {
                var groupId = results[j].id;
                var groupName = results[j].get("name");
                var members = results[j].get("members");
                var userArray = new Array();
                for (var t in members) {
                    var userId = members[t].get("user").id;
                    userArray.push(userId);
                }

                if (_.contains(userArray, currentUserId)) {
                    outputGroup += '<option value="' + groupId + '">' + groupName + '</option>';
                }
            }

            outputGroup += '</select>';
            outputGroup += '</div>';

            $("#list-group").html(outputGroup);
            $('select').multipleSelect();
        }, error: function(error) {
        }

    });
}
chooseGroup();

var post1 = Parse.Object.extend("Post");
var Post = mainClass + postsClass;

function Submit() {

    document.getElementById('submit-btn').style.cssText = "display: none;";

    var newPost = new post1();
    var text = document.post.elements[0].value;
    var bilde = document.getElementById("post-file");
    var bildePath = document.getElementById("post-file").value;

    var noContent;

    if (language == "NO") {
        noContent = "Du må skrive noe før du publiserer";
    } else {
        noContent = "The post does not have any content";
    }

    if (text == "" && bildePath == "") {
        document.getElementById('submit-btn').style.cssText = "display: block;";

        alert(noContent);
    } else {

        var bildeNavn = bildePath.split("\\").pop();
        var chosengroups = $('#selectmemb').val();
        var pointers = _.map(chosengroups, function (memberId) {
            var pointer = new Parse.Object("data_" + klubbID + "_Groups");
            pointer.id = memberId;
            return pointer;
        });
        newPost.set("content", text);
        newPost.set("author", Parse.User.current());
        newPost.set("clubId", klubbID);
        newPost.set("audiences", pointers);
        newPost.set("team", klubbID)
        document.getElementById("postbtn").value = "";
        if (bilde.files.length > 0) {
            var file = bilde.files[0];

            var reader = new FileReader();
            reader.onloadend = function () {
                var base64 = reader.result;
                console.log(base64);
                var newFile = new Parse.File("img.txt", {
                    base64: base64
                });

                newFile.save({
                    success: function () {
                        console.log("YAYA");
                    },
                    error: function (file, error) {
                        console.log("Files Save Error:" + error.message);
                    }
                }).then(function (theFile) {
                    newPost.set("Image", theFile);
                    newPost.save({
                        success: function () {
                            getPosts(0);
                            document.getElementById("post-file").value = "";
                            location.href = "home.html";
                        },
                        error: function (error) {
                            console.log("Post Save with File Error:" + error.message);
                            handleParseError();
                        }
                    });
                });
            }
            reader.readAsDataURL(file);

        } else {
            newPost.save(null, {
                success: function (newPost) {
                    getPosts(0);
                    document.getElementById("post-file").value = "";
                    location.href = "home.html";
                },
                error: function (newPost, error) {
                    console.log("Error:" + error.message);
                    handleParseError();
                }
            });
        }
    }


}

var counting = 0;

function getPosts(loopCount) {

    if (loopCount == undefined) {
        loopCount = counting;
    }
    var limit = 10;
    var query = new Parse.Query(Post);
    query.descending("createdAt");
    query.limit(limit);
    query.skip(limit * loopCount);
    query.include("author");
    query.include("comments");
    query.include("comments.author");
    query.include("likes");
    query.find().then(function () {}, function (err) {
        handleParseError(err);
    });
    query.equalTo("team", klubbID);
    query.find({
        success: function (results) {
            var commentid = new Array();
            for (var i in results) {
                var output = "";
                results[i].toJSON();
                var postId = results[i].id;
                var content = results[i].get("content");
                var author = results[i].get("author");
                var authorid = author.id;
                var name = "Anonymous";
                var postID = results[i];
                var posts = postID.id;
                var realPost = posts;
                var date = results[i].get("createdAt");
                var dato = date.toString();
                var datoen = dato.substring(4, 15);
                if (author != null) {
                    name = author.get("name");
                }
                var pB = "";
                var userPB = "";
                if (author.get("profileImage_small")) {
                    var bilde = author.get("profileImage_small");
                    var url1 = bilde.url();
                    pB = '<img class="pb1" src="' + url1 + '">';
                } else {
                    userPB = '<img class="pb1" src="./src/img/User_Small.png">';
                }
                var img = "";
                if (results[i].get("Image")) {
                    var file = results[i].get("Image");
                    var url = file.url();
                    img = "<img src='" + url + "'>";
                }

                var confirmation = "yes";
                var group = results[i].get("audiences");
                var groupName = new Array();
                if (group != undefined) {
                    if (group.length != 0) {
                        confirmation = "no";
                        for (var k in group) {
                            var groupMembers = group[k].get("members");
                            var gname = group[k].get("name");
                            var pushname = " " + gname;
                            if (gname != undefined) {
                                groupName.push(pushname);
                            }
                            for (var j in groupMembers) {
                                var memberId = groupMembers[j].get("user").id;
                                var userId = Parse.User.current().id;
                                if (userId == memberId) {
                                    confirmation = "yes";
                                }
                            }
                        }
                    }
                }
                if (confirmation == "yes") {
                    if (content == undefined) {
                        content = "";
                    }

                    var likeText;
                    var likesText;
                    var commentText;
                    var commentsText;
                    var writeCommentText;
                    var publishText;
                    if (language == "NO") {
                        likeText = "Likerklikk";
                        likesText = "Likerklikk";
                        commentText = "Kommentar";
                        commentsText = "Kommentarer";
                        writeCommentText = "Skriv en kommentar";
                        publishText = "Publiser";
                    } else {
                        likeText = "Like";
                        likesText = "Likes";
                        commentText = "Comment";
                        commentsText = "Comments";
                        writeCommentText = "Write a comment";
                        publishText = "Publish";
                    }

                    output += "<div id=\"feedPost\">";
                    output += "<div id=\"feedCell\">";
                    output += "<div id=\"post\">";
                    output += "<div id=\"profilBilde\">";
                    output += pB;
                    output += userPB;
                    output += "</div>"
                    output += "<h4>" + name + "</h4>";
                    output += "<h5>" + datoen + "</h5>";
                    output += '<h6>' + groupName + '</h6>';
                    if ((authorid == Parse.User.current().id) || (role == "trener")) {
                        output += '<i class="material-icons" id="' + postId + '" onclick="deletePost(id)">clear</i>';
                    }
                    output += "<p>" + content + "</p>";
                    output += img;
                    output += "</div>";
                    var likes = results[i].get("likes");
                    output += "<div id=\"like-comment\">";
                    output += '<div id="like' + realPost + '">';
                    if ($.inArray(currentUserId, likes) !== -1) {
                        output += '<i class="material-icons" id="' + realPost + '" onclick="dislike(id);" style="color: #cf2424">thumb_up</i>';
                    } else {
                        output += '<i class="material-icons" id="' + realPost + '" onclick="like(id);" style="color: #000">thumb_up</i>';
                    }
                    output += "</div>";
                    if (likes != null) {
                        if (likes.length == 1) {
                            output += "<h4>" + likes.length + " " + likeText + "</h4>";
                        } else {
                            output += "<h4>" + likes.length + " " + likesText + "</h4>";
                        }
                    } else if (likes == undefined) {
                        output += '<h4>0 ' + likeText + '</h4>';
                    } else if (likes == 0) {
                        output += '<h4>0 ' + likesText + '</h4>';
                    }
                    /*
                    var User = Parse.Object.extend("User");
                    var query3 = new Parse.Query(User);
                    output += '<span>likeName</span>';
                    query3.containedIn("objectId", likes);
                    query3.find({
                            success: function(results) {
                                for (var i in results) {
                                    if (results[i] != null) {
                                        var liked = results[i];
                                        var likeName = liked.get("name");
                                        if (liked != null) {
                                        }
                                        output += '<span>likeName</span>';
                                        
                                    }
                                }
                            
                            }
                            
                        });
                        */
                    commentid = results[i].get("comments");
                    if (commentid != null) {
                        if (commentid.length == 1) {
                            output += '<p onclick="return show();">' + commentid.length + " " + commentText + '</p>';
                        } else {
                            output += '<p onclick="return show();">' + commentid.length + " " + commentsText + '</p>';
                        }
                    } else if (commentid == undefined) {
                        output += '<p>0 ' + commentsText + '</p>';
                    } else if (commentid == 0) {
                        output += '<p>0 ' + commentsText + '</p>';
                    }
                    output += "</div>";
                    output += "</div>";
                    output += '<div id="all-comments">';
                    output += '<div id="commentSection">';
                    output += '<i class="fa fa-comment-o" id="commentIcon" aria-hidden="true"></i>';
                    output += '<textarea rows="1" cols="40 name="text" id="text' + i + '" placeholder="' + writeCommentText + '"></textarea>';
                    output += '<div class="cmt-btn">';
                    output += '<button type="button" name="' + realPost + '" id="' + i + '" onclick="submitComment(id, name)">' + publishText + '</button>';
                    output += '</div>';
                    output += '</div>';
                    commentid = results[i].get("comments");
                    var m;
                    if (commentid != null) {
                        for (var k in commentid) {
                            if (commentid[k] != null) {
                                var ct = commentid[k];
                                var ctxt = ct.get("text");
                                var ctauth = ct.get("author");
                                var ctname = ctauth.get("name");
                                var ctdate = ct.get("createdAt");
                                var ctdato = ctdate.toString();
                                var ctdatoen = ctdato.substring(4, 15);
                                var pB = "";
                                var userPB = "";
                                if (ctauth.get("profileImage_small")) {
                                    var bilde = ctauth.get("profileImage_small");
                                    var url1 = bilde.url();
                                    pB = '<img src="' + url1 + '">';
                                } else {
                                    userPB = '<img src="./src/img/User_Small.png">';
                                }
                                output += '<div class="comments" id="comments' + k + '">';
                                output += "<div id=\"profilBildeC\">";
                                output += pB;
                                output += userPB;
                                output += "</div>"
                                output += "<div id=\"commentTextC\">"
                                output += "<h4>" + ctname + "</h4>";
                                output += "<h5>" + ctdatoen + "</h5>";
                                output += "<p>" + ctxt + "</p>";
                                output += "</div>"
                                output += "</div>"
                            }
                        }
                    }

                }
                output += "</div>";
                output += "</div>";
                $("#list-posts").append(output);
            }
            counting++;
        },
        error: function (error) {
            console.log("Query error:" + error.message);
            handleParseError();
        }
    });
}

function like(id) {
    /*
    var likeButton = document.getElementById("like" + id);
    likeButton.style.color = '#cf2424';
    */
    var query = new Parse.Query(Post);
    query.descending("createdAt");
    query.include("author");
    query.equalTo("team", klubbID);
    query.find().then(function () {}, function (err) {
        handleParseError(err);
    });
    query.find({
        success: function (results) {
            var user = Parse.User.current();
            var userId = user.id;
            for (var i = 0; i < results.length; i++) {
                var post = results[i].id;
                if (post === id) {
                    results[i].addUnique("likes", userId);
                    results[i].save(null, {
                        success: function (newPost) {
                            getPosts(0);
                            location.reload();
                        },
                        error: function (newPost, error) {
                            console.log("Error:" + error.message);
                            handleParseError();
                        }
                    });
                }
            }
        }
    });
}

function dislike(id) {
    /*
    document.getElementById(id).style.color = '#000';
    */
    var query = new Parse.Query(Post);
    query.descending("createdAt");
    query.include("author");
    query.find().then(function () {}, function (err) {
        handleParseError(err);
    });
    query.equalTo("team", klubbID);
    query.find({
        success: function (results) {
            var user = Parse.User.current();
            var userId = user.id;
            for (var i = 0; i < results.length; i++) {
                var post = results[i].id;
                if (post === id) {

                    results[i].remove("likes", userId);
                    results[i].save(null, {
                        success: function (newPost) {
                            getPosts(0);
                            location.reload();
                        },
                        error: function (newPost, error) {
                            console.log("Error:" + error.message);
                            handleParseError();
                        }
                    });
                }
            }
        }
    });
}

function submitComment(number, postID) {

    document.getElementById(number).style.cssText = "display: none;";

    var Comment = Parse.Object.extend("data_" + klubbID + "_Comments");
    var commenting = new Comment();
    var postComment = document.getElementById("text" + number).value;

    if (postComment != "") {
        commenting.set("text", postComment);
        commenting.set("author", Parse.User.current());
        commenting.set("team", klubbID);
        commenting.save({
            success: function (commenting) {
                var objectID = commenting.id;

                var post = Parse.Object.extend("data_" + klubbID + "_Posts");
                var Query = new Parse.Query(post);
                Query.find({
                    success: function (objects) {
                        for (var j = 0; j < objects.length; j++) {
                            var post = objects[j].id;
                            if (post == postID) {
                                objects[j].addUnique("comments", commenting);
                                objects[j].save({
                                    success: function () {
                                        getPosts(0);
                                        location.href = "home.html";
                                    }
                                });
                            }
                        }
                    },
                    error: function (error) {
                        console.log("Query error:" + error.message);
                        handleParseError();
                    }
                });
            },
            error: function (error) {
                console.log("Ikkje bra");
                handleParseError();
            }
        });
    } else {
        var noContent;

        if (language == "NO") {
            noContent = "Du må skrive noe før du publiserer";
        } else {
            noContent = "Write something before you publish it"
        }

        alert(noContent);
        document.getElementById(number).style.cssText = "display: block;";
    }
}
getPosts(0);

function deletePost(postid) {

    var post = Parse.Object.extend("data_" + klubbID + "_Posts");
    var queryp = new Parse.Query(post);
    queryp.equalTo("objectId", postid);
    queryp.find({
        success: function (result) {
            for (var j in result) {
                result[j].destroy({
                    success: function (result) {
                        getPosts(0);
                    },
                    error: function (result, error) {}
                });
            }
        }
    });
}
