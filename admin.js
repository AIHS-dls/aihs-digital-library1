// ===============================
// ADMIN DASHBOARD
// ===============================


function openAdministration(){

    window.location.href="administration.html";

}



function openEvents(){

    window.location.href="events.html";

}




function logoutAdmin(){

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    window.location.href="index.html";

}



// ===============================
// ADMIN SEARCH
// ===============================


document.addEventListener("DOMContentLoaded",function(){


let search=document.getElementById("adminSearch");


if(search){


search.addEventListener("input",function(){


let value=this.value.toLowerCase();


console.log(
"Searching:",
value
);


// Next step:
// Books + Users + Events API search connect ಮಾಡೋಣ


});


}



});
