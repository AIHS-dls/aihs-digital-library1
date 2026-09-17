const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let resources=[];


// LOAD RESOURCES

async function loadResources(){


try{


let response = await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"list",

token:localStorage.getItem("token")

})

});



let data = await response.json();



if(data.ok){


resources=data.resources;


updateCounts();


}

else{

console.log(data.error);

}



}

catch(error){

console.log(error);

}


}




function updateCounts(){


let ebook =
resources.filter(r=>r.type==="E-book").length;


let notes =
resources.filter(r=>r.type==="Notes").length;


let qp =
resources.filter(r=>r.type==="Question Paper").length;


let journal =
resources.filter(r=>r.type==="Journal").length;


let database =
resources.filter(r=>r.type==="Database").length;




document.getElementById("ebookCount").innerHTML =
ebook+" Resources";


document.getElementById("notesCount").innerHTML =
notes+" Resources";


document.getElementById("qpCount").innerHTML =
qp+" Resources";


document.getElementById("journalCount").innerHTML =
journal+" Resources";


document.getElementById("databaseCount").innerHTML =
database+" Resources";



}




function openCollection(page){

window.location.href=page;

}



function backAdmin(){

window.location.href="administration.html";

}




window.onload=function(){

loadResources();

};
