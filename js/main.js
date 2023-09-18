const urlBase = 'http://smallgroup21.xyz/LAMPAPI';
const extension = 'php';


let userId = 0;
let firstName = "";
let lastName = "";
var contacts, contactsMap, colorMap, cur_contact_id = -1;

$(document).ready(function () {
    readCookie();
    colorMap = new Map();
    $('#log-out-btn').click(function () {
        logout();
    });
    
    $('#refresh-background').click(function () {
        window.location.href = "contacts.html";
    });
    
    $('#add-contact').click(function () {
        $("#add-first-name-field").val("");
        $("#add-last-name-field").val("");
        $("#add-email-field").val("");
        $("#add-phone-field").val("");
        $("#contact-modal").css("display", "table");
        $('#contact-modal').addClass("two");
        $('body').addClass('modal-active');
        $('.xbackground').show();
    });
    
    $('#add-contact-submit').click(function(){addContact()});
    $('.xbackground, .xicon').click(function(){closeAllModals()});
    $("#search-contact").on('change paste input', function(){
        searchContact($("#search-contact").val())
    });
    $('#get-all-contacts-btn').click(function(){
        $("#search-contact").val("");
        searchContact('get:all')
    });
});

const closeAllModals = () => {
    $('#contact-modal').removeClass('two');
    $("#contact-modal").css("display", "none");
    $('#edit-modal').removeClass('two');
    $("#edit-modal").css("display", "none");
    $('body').removeClass('modal-active');
    $('.xbackground').hide();
}


const readCookie = () => {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") firstName = tokens[1];
        else if (tokens[0] == "lastName") lastName = tokens[1];
        else if (tokens[0] == "userId") userId = parseInt(tokens[1].trim());
    }
    if (userId < 0) {
        window.location.href = "index.html";
        return;
    }
    $('#user-name').text("Hi, " + firstName + " " + lastName);
    $(".loader").css("display", "none");
}

const logout = () => {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ,lastName= ,userId=-1;expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}


const addContact = () => {

    var contactFirstName = $("#add-first-name-field").val();
    var contacLastName = $("#add-last-name-field").val();
    var contactEmail = $("#add-email-field").val();
    var contatPhone = $("#add-phone-field").val();

    if (contacLastName === "" || contacLastName === "" || contactEmail === "" || contatPhone === "") return;
    closeAllModals();
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
                searchContact(contactFirstName);
            }
        };
        xhr.send(newUserInfoPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

const prefillCurContact = () => {
    var cur_contact = contactsMap.get(cur_contact_id);
    $('#edit-first-name-field').val(cur_contact.FirstName);
    $('#edit-last-name-field').val(cur_contact.LastName);
    $('#edit-email-field').val(cur_contact.Email);
    $('#edit-phone-field').val(cur_contact.PhoneNum);
}

const editContactCheck = () => {

    var contactFirstName = $("#edit-first-name-field").val();
    var contacLastName = $("#edit-last-name-field").val();
    var contactEmail = $("#edit-email-field").val();
    var contatPhone = $("#edit-phone-field").val();

    if (contacLastName === "" || contacLastName === "" || contactEmail === "" || contatPhone === "") return;

    var contact = {
        FirstName: contactFirstName,
        LastName: contacLastName,
        Email: contactEmail,
        PhoneNum: contatPhone,
        ID: cur_contact_id
    };   

    closeAllModals();
    editContact(contact);
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

const displayContact = (contact_id) => {

    $('#' + cur_contact_id).removeClass('active');
    cur_contact_id = contact_id;
    $('#' + cur_contact_id).addClass('active');

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

const refreshContacts = () => {

    const getColor = () => {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 50; // You can adjust this value as needed
        const lightness = 30 + Math.random() * 20; // Lightness between 30 and 50
        const darkColor = `hsl(${hue},${saturation}%,${lightness}%)`;
      
        return darkColor;
    }

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

        if(cur_contact_id == -1)
            displayContact(contact.ID);
    }
    list.innerHTML += '<div class="searchbar-behind-box"></div>';
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

const searchContact = (srch) => {
    contacts = [];
    if(srch === "" || srch === "" || srch == undefined || srch.length < 1){
        refreshContacts();
        $('#search-status').text('Search Contacts');
        return;
    }

    if(srch === 'get:all') srch = '';
    let searchUser = JSON.stringify({ 
        search: srch, UserID: userId 
    });

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                contacts = jsonObject.results;
                if(contacts === undefined) contacts = [];
                contacts.sort(function(a, b){
                    if(a.FirstName === b.FirstName)
                        return a.LastName > b.LastName;
                    return a.FirstName > b.FirstName;
                });
                if(contacts.length < 1) {
                    $('#search-status').text('No results for ' + srch);
                } else {
                    $('#search-status').text('Search Contacts');
                }
                refreshContacts();
            }
        };
        xhr.send(searchUser);
    }
    catch (err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }
}