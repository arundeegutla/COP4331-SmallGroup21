const urlBase = 'http://smallgroup21.xyz/LAMPAPI';
const extension = 'php';


let userId = 0;
let firstName = "";
let lastName = "";
var contacts;


$(document).ready(function () {
    readCookie();
    searchContact();
    $('#log-out-btn').click(function () {
        logout();
    });

    $('.mini-contact').click(function(){
        alert($(this).attr('id'));
    });

    $("#search-contact").on('change keydown paste input', function(){
        searchContact();
    });

    $('#refresh-background').click(function(){
        window.location.href = "contacts.html";
    });
});



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

    if (userId < 0) {
        window.location.href = "index.html";
        return;
    }
    $('#user-name').text(firstName + " " + lastName);
    $(".loader").css("display", "none");
}


function logout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ,lastName= ,userId=-1;expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addContact() {
    let newColor = document.getElementById("colorText").value;
    document.getElementById("colorAddResult").innerHTML = "";

    let tmp = { color: newColor, userId, userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddColor.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("colorAddResult").innerHTML = "Color has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("colorAddResult").innerHTML = err.message;
    }

}

function refreshContacts(){

    var list = document.getElementById("contacts");
    list.innerHTML = '<li id="1" class="mini-contact"><a>John Smith</a><div class="icons"><div class="icon"><span class="fa-solid fa-phone"></span></div></div></li><li id="1" class="mini-contact"><a>John Smith</a><div class="icons"><div class="icon"><span class="fa-solid fa-star"></span></div></div></li>';
    
    for(var contact of contacts){
        let mini = document.createElement('li');
        mini.className = "mini-contact";
        let aTag = document.createElement('a');
        aTag.innerHTML = contact.FirstName + " " + contact.LastName;
        mini.appendChild(aTag);
        list.appendChild(mini);
    }
    for(var contact of contacts){
        let mini = document.createElement('li');
        mini.className = "mini-contact";
        let aTag = document.createElement('a');
        aTag.innerHTML = contact.FirstName + " " + contact.LastName;
        mini.appendChild(aTag);
        list.appendChild(mini);
    }
}

function searchContact() {
    contacts = [];
    let srch = $("#search-contact").val();

    let tmp = { 
        search: srch, 
        UserID: 7 
    };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                contacts = jsonObject.results;
                refreshContacts();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }

}
