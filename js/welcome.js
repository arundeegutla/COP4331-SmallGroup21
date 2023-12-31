const urlBase = 'http://smallgroup21.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

$(window).on( "load", function() {
    readCookie();
    $('#get-started').click(function () {
        $("#modal-container").css("display", "table");
        $('#modal-container').removeAttr('class').addClass("two");
        $('body').addClass('modal-active');
        $('.xbackground').show();
    });
    $('#close-modal, #close-xicon').click(function () {
        $('#modal-container').addClass('out');
        $("#modal-container").css("display", "none");
        $('body').removeClass('modal-active');
        $('.xbackground').hide();
    });
    $('#radio-1').click(function(){
        $('#modal').removeClass('right-panel-active');
    });
    $('#radio-2').click(function(){
        $('#modal').addClass('right-panel-active');
    });

    $('#login-form').submit(function(){
        userLogin();
    });
});

const showToolTip = (id, text="Required") => {
    $(id+"~.tooltiptext").css("visibility", "visible");
    $(id+"~.tooltiptext").text(text);
    $(id).focus(function(){
        $(id+"~.tooltiptext").css("visibility", "hidden");
    });
}

function createNewUser() {
    userId = -1;
    firstName = $("#fname").val();
    lastName = $("#lname").val();
    let username = $("#new-uname").val();
    let password = $("#new-pswd").val();

    var ok = true;
    if(firstName === ""){
        showToolTip('#fname');
        ok = false;
    }
    if(lastName === ""){
        showToolTip('#lname');
        ok = false;
    }
    if(username === ""){
        showToolTip('#new-uname');
        ok = false;
    }
    if(password === ""){
        showToolTip('#new-pswd');
        ok = false;
    }

    if(!ok) return;

    let newUserInfoPayload = JSON.stringify({
        FirstName: firstName,
        LastName: lastName,
        Username: username,
        Passwd: password
    });

    let url = urlBase + '/AddUser.' + extension;
    let returnValue = document.getElementById("signup-result");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.ID;
                if (userId < 1) {
                    returnValue.innerHTML = "Cannot create user";
                    return;
                }
                saveCookie();
                readCookie();
                returnValue.innerHTML = "Hi, " + firstName + " " + lastName + "!";
                // document.getElementById("signup-form").submit();
            }
        };
        xhr.send(newUserInfoPayload);
    }
    catch (err) {
        returnValue.innerHTML = err.message;
    }
}


function userLogin() {
    userId = -1;
    firstName = "";
    lastName = "";
    
    let login = $('#username').val();
    let password = $('#cur-password').val();
    
    var ok = true;
    if(login === ""){
        showToolTip('#username');
        ok = false;
    }
    if(password === ""){
        showToolTip('#cur-password');
        ok = false;
    }
    
    if(!ok) return;

    let jsonPayload = JSON.stringify({
        Username: login,
        Passwd: password
    });
    
    let url = urlBase + '/Login.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.ID;
                if (userId < 1) {
                    document.getElementById("login-result").innerHTML = "User/Password combination incorrect";
                    return;
                }
                firstName = jsonObject.FirstName;
                lastName = jsonObject.LastName;
                saveCookie();
                readCookie();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("login-result").innerHTML = err.message;
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }
    
    if (userId >= 0) {
        window.location.href = "contacts.html";
    } else {
        $(".loader").css("display", "none");
    }
}