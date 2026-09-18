// ===============================
// AIHS DIGITAL LIBRARY
// ADMIN DASHBOARD
// ===============================


// ===============================
// OPEN ADMINISTRATION
// ===============================

function openAdministration() {

    window.location.href = "administration.html";

}


// ===============================
// OPEN LIBRARY EVENTS
// ===============================

function openEvents() {

    window.location.href = "events.html";

}


// ===============================
// OPEN COLLECTION ADMIN PAGE
// ===============================

function openCollection(page) {

    window.location.href = page;

}


// ===============================
// ADMIN LOGOUT
// ===============================

function logoutAdmin() {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "index.html";

}


// ===============================
// ADMIN SEARCH
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const search = document.getElementById("adminSearch");

    if (!search) {
        return;
    }


    search.addEventListener("input", function () {

        const value = this.value.trim().toLowerCase();

        console.log("Admin Search:", value);

        // Search functionality will be connected
        // to Resources + Users + Events later.

    });

});

// ===============================
// LOAD COLLECTION COUNTS
// ===============================

document.addEventListener("DOMContentLoaded", function(){

    let ebooks = JSON.parse(localStorage.getItem("ebooks")) || [];
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let questionpapers = JSON.parse(localStorage.getItem("questionpapers")) || [];
    let journals = JSON.parse(localStorage.getItem("journals")) || [];
    let databases = JSON.parse(localStorage.getItem("databases")) || [];


    let ebookCount = document.getElementById("ebookCount");
    let notesCount = document.getElementById("notesCount");
    let qpCount = document.getElementById("qpCount");
    let journalCount = document.getElementById("journalCount");
    let databaseCount = document.getElementById("databaseCount");


    if(ebookCount){
        ebookCount.innerHTML =
        "Manage E-Books<br><b>"+ebooks.length+"</b> Books";
    }


    if(notesCount){
        notesCount.innerHTML =
        "Manage Notes<br><b>"+notes.length+"</b> Notes";
    }


    if(qpCount){
        qpCount.innerHTML =
        "Manage Question Papers<br><b>"+questionpapers.length+"</b> Papers";
    }


    if(journalCount){
        journalCount.innerHTML =
        "Manage Journals<br><b>"+journals.length+"</b> Journals";
    }


    if(databaseCount){
        databaseCount.innerHTML =
        "Manage Databases<br><b>"+databases.length+"</b> Databases";
    }


});
