const urlBase = 'http://smallgroup21.xyz/LAMPAPI';
const extension = 'php';


let userId = 0;
let firstName = "";
let lastName = "";
var contacts;
var contactsMap;


$(document).ready(function () {
    readCookie();
    searchContact();
    $('#log-out-btn').click(function () {
        logout();
    });

    $('.mini-contact').click(function () {
        alert($(this).attr('id'));
    });

    $("#search-contact").on('change keydown paste input', function () {
        searchContact($("#search-contact").val());
    });

    $('#refresh-background').click(function () {
        window.location.href = "contacts.html";
    });

    $('#add-contact-submit').click(function () {
        addContact();
    });

    $(".add-container").click(function () {
        $(".home .container .profile-container").css({ "display": "block" });
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
    let newContact = document.getElementById("contacts");

    var contactFirstName = document.getElementById("firstNameField").value;
    var contacLastName = document.getElementById("lastNameField").value;
    var contactEmail = document.getElementById("emailField").value;
    var contatPhone = document.getElementById("phoneField").value;


    if (contacLastName === "" || contacLastName === "" || contactEmail === "" || contatPhone === "") return;

    let newUserInfoPayload = JSON.stringify({
        FirstName: contactFirstName,
        LastName: contacLastName,
        PhoneNum: contatPhone,
        Email: contactEmail,
        UserID: userId
    });

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                searchContact();
            }
        };
        xhr.send(newUserInfoPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function getColor() {
    // Generate random HSL values with lower saturation and a darker lightness
    const hue = Math.floor(Math.random() * 360); // Hue component (0-359)
    const saturation = Math.floor(Math.random() * 50) + 50; // Saturation component (50-100)
    const lightness = Math.floor(Math.random() * 20) + 40; // Lightness component (40-60)

    // Convert HSL to a CSS color string
    const pastelColor = `hsl(${hue},${saturation}%,${lightness}%)`;

    return pastelColor;
}

function displayContact(conttact_id) {

    // for (const [key, value] of contactsMap.entries()) {
    //     console.log(key, value);
    // }
    var cur_contact = contactsMap.get(conttact_id);
    var contact_FirstName = cur_contact.FirstName[0].toUpperCase() + cur_contact.FirstName.substring(1);
    var contact_LastName = cur_contact.LastName[0].toUpperCase() + cur_contact.LastName.substring(1);
    var contact_Email = cur_contact.FirstName;
    var contact_Phone = cur_contact.FirstName;


    $('.profile-img').css({ "background-color": getColor() });
    $('.initials').text(contact_FirstName[0] + "" + contact_LastName[0]);

    $("#profile-name").text(contact_FirstName + " " + contact_LastName);
    $("#profile-email").text(contact_Email);
    $("#profile-phone-num").text(contact_Phone);

}

function refreshContacts() {

    contactsMap = new Map();
    var list = document.getElementById("contacts");

    list.innerHTML = '<div class="searchbar-behind-box">';
    for (var contact of contacts) {
        let mini = document.createElement('li');
        mini.className = "mini-contact";
        mini.setAttribute('id', contact.ID);
        contactsMap.set(contact.ID, contact);
        let aTag = document.createElement('a');
        aTag.innerHTML = contact.FirstName + " " + contact.LastName;
        mini.appendChild(aTag);
        if (true) mini.innerHTML += '<div class="icons"><div class="icon"><span class="fa-solid fa-star"></span></div></div>';
        list.appendChild(mini);
    }
    list.innerHTML += '<div class="searchbar-behind-box"></div>';

    $('.mini-contact').click(function () {
        displayContact($(this).attr("id"));
    });
}

function searchContact(srch) {
    contacts = [];

    $('#search-loader').css({ "display": "flex" });


    let tmp = {
        search: srch,
        UserID: userId
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
function showProfileContainer() {
    document.getElementById('profileContainer').style.display = "block";
}

function hideProfileContainer() {
    document.getElementById('profileContainer').style.display = "none";
}
