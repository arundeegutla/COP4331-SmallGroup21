const urlBase = 'http://smallgroup21.xyz/LAMPAPI';
const extension = 'php';


let userId = 0;
let firstName = "";
let lastName = "";
var contacts;
var contactsMap;
var colorMap;
var cur_contact_id = -1;

$(document).ready(function () {
    readCookie();
    searchContact();
    colorMap = new Map();
    $('#log-out-btn').click(function () {
        logout();
    });

    $('.mini-contact').click(function () {
        alert($(this).attr('id'));
    });

    $("#search-contact").on('change paste input', function () {
        searchContact($("#search-contact").val());
    });

    $('#refresh-background').click(function () {
        window.location.href = "contacts.html";
    });

    $('#add-contact-submit').click(function () {
        addContact();
        $('#contact-modal').removeClass('two');
        $("#contact-modal").css("display", "none");
        $('body').removeClass('modal-active');
        $('.xbackground').hide();
    });


    $('#edit-contact-submit').click(function(){
        editContactCheck();
    });


    $(".add-container").click(function () {
        $(".home .container .profile-container").css({ "display": "block" });
    });

    $('#add-contact').click(function () {
        $("#contact-modal").css("display", "table");
        $('#contact-modal').addClass("two");
        $('body').addClass('modal-active');
        $('.xbackground').show();
    });

    $('#close-modal').click(function () {
        $('#contact-modal').removeClass('two');
        $("#contact-modal").css("display", "none");
        $('body').removeClass('modal-active');
        $('.xbackground').hide();
    });

    $('#close-edit-modal').click(function () {
        $('#edit-modal').removeClass('two');
        $("#edit-modal").css("display", "none");
        $('body').removeClass('modal-active');
        $('.xbackground').hide();
    });

    $('#get-all-contacts-btn').click(function(){
        searchContact('get:all');
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
    $('#user-name').text("Hi, " + firstName + " " + lastName);
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
                let jsonObject = JSON.parse(xhr.responseText);
                searchContact(contactFirstName);
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

const displayContact = (contact_id) => {

    cur_contact_id = contact_id;

    var cur_contact = contactsMap.get(contact_id);
    var contact_FirstName = cur_contact.FirstName[0].toUpperCase() + cur_contact.FirstName.substring(1);
    var contact_LastName = cur_contact.LastName[0].toUpperCase() + cur_contact.LastName.substring(1);
    var contact_Email = cur_contact.Email;
    var contact_Phone = cur_contact.PhoneNum;


    $('.profile-img').css({ "background-color": colorMap.get(contact_id) });
    $('.initials').text(contact_FirstName[0] + "" + contact_LastName[0]);

    $("#profile-name").text(contact_FirstName + " " + contact_LastName);
    $("#profile-email").text(contact_Email);
    $("#profile-phone-num").text(contact_Phone);

    $('#edit-contact-btn').click(function (){
        $("#edit-modal").css("display", "table");
        $('#edit-modal').addClass("two");
        $('body').addClass('modal-active');
        $('.xbackground').show();
        prefillCurContact();
    });

    $('.no-profile').css({'display':'none'});
    $('.profile').css({'display':'block'});

}

const prefillCurContact = () => {
    var cur_contact = contactsMap.get(cur_contact_id);
    $('#first-name-edit-field').val(cur_contact.FirstName);
    $('#last-name-edit-field').val(cur_contact.LastName);
    $('#email-edit-field').val(cur_contact.Email);
    $('#phone-edit-field').val(cur_contact.PhoneNum);
}


const editContactCheck = () => {


    var contactFirstName = document.getElementById("first-name-edit-field").value;
    var contacLastName = document.getElementById("last-name-edit-field").value;
    var contactEmail = document.getElementById("email-edit-field").value;
    var contatPhone = document.getElementById("phone-edit-field").value;

    if (contacLastName === "" || contacLastName === "" || contactEmail === "" || contatPhone === "") return;

    var contact = {
        FirstName: contactFirstName,
        LastName: contacLastName,
        Email: contactEmail,
        PhoneNum: contatPhone,
        ID: cur_contact_id
    };

    editContact(contact);

    $('#edit-modal').removeClass('two');
    $("#edit-modal").css("display", "none");
    $('body').removeClass('modal-active');
    $('.xbackground').hide();

}

const editContact = (contact_json) => {
    let url = urlBase + '/UpdateContact.' + extension;
    let EditContactInfoPayload = JSON.stringify(contact_json);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200){
                searchContact(contact_json.FirstName);
            }
        };
        xhr.send(EditContactInfoPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function refreshContacts() {

    cur_contact_id = -1;
    contactsMap = new Map();
    var list = document.getElementById("contacts");

    list.innerHTML = '<div class="searchbar-behind-box">';
    for (const contact of contacts) {    
        let mini = document.createElement('li');
        mini.className = "mini-contact";
        mini.setAttribute('id', contact.ID);
        contactsMap.set(contact.ID, contact);

        if(!colorMap.has(contact.ID))
            colorMap.set(contact.ID, getColor());

        let aTag = document.createElement('a');
        aTag.innerHTML = contact.FirstName + " " + contact.LastName;
        mini.appendChild(aTag);
        if (false) mini.innerHTML += '<div class="icons"><div class="icon"><span class="fa-solid fa-star"></span></div></div>';
        list.appendChild(mini);
        if(cur_contact_id == -1){
            displayContact(contact.ID);
        }
    }
    list.innerHTML += '<div class="searchbar-behind-box"></div>';

    if(contactsMap.size < 1) {
        $('.no-contacts-box').css({"display": "flex"});
        $('#contacts').css({"display": "none"});
        $('.no-profile').css({'display':'flex'});
        $('.profile').css({'display':'none'});
    } else {
        $('.no-contacts-box').css({"display": "none"});
        $('#contacts').css({"display": "block"});
    }

    $('.mini-contact').click(function () {
        displayContact($(this).attr("id"));
    });


}

function searchContact(srch) {
    
    console.log("srch: {" + srch + "}");
    contacts = [];
    if(srch === "" || srch === "" || srch == undefined || srch.length < 1){
        refreshContacts();
        return;
    }

    if(srch === 'get:all') srch = '';

    let tmp = { search: srch, UserID: userId };
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
                contacts.sort(function(a, b){
                    if(a.FirstName === b.FirstName)
                        return a.LastName > b.LastName;
                    return a.FirstName > b.FirstName;
                });
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
