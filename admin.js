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
