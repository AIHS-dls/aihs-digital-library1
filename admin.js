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
// LOAD ADMIN COLLECTION COUNTS
// ===============================

const API =
"https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


async function loadCollectionCounts(){

try{


const response = await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"list",

token:localStorage.getItem("token")

})

});


const data = await response.json();


if(!data.ok){
console.log("Count Error",data.error);
return;
}



let resources=data.resources || [];



let ebooks =
resources.filter(r=>r.type==="E-book").length;


let notes =
resources.filter(r=>r.type==="Notes").length;


let questionpapers =
resources.filter(r=>r.type==="Question Paper").length;


let journals =
resources.filter(r=>r.type==="Journal").length;


let databases =
resources.filter(r=>r.type==="Database").length;



document.getElementById("ebookCount").innerHTML =
"Manage E-Books<br><b>"+ebooks+" Books</b>";


document.getElementById("notesCount").innerHTML =
"Manage Notes<br><b>"+notes+" Notes</b>";


document.getElementById("qpCount").innerHTML =
"Manage Question Papers<br><b>"+questionpapers+" Papers</b>";


document.getElementById("journalCount").innerHTML =
"Manage Journals<br><b>"+journals+" Journals</b>";


document.getElementById("databaseCount").innerHTML =
"Manage Databases<br><b>"+databases+" Databases</b>";



}

catch(error){

console.log(error);

}


}


document.addEventListener(
"DOMContentLoaded",
function(){

loadCollectionCounts();

}
);
