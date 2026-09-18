const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let databases=[];




// ==========================
// LOAD DATABASES
// ==========================

async function loadDatabases(){


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



let data=await response.json();



if(data.ok){


databases=data.resources.filter(function(r){

return r.type=="Database";

});


displayDatabases();


}

else{


document.getElementById("resourceList").innerHTML=data.error;


}


}







// ==========================
// DISPLAY
// ==========================


function displayDatabases(){


let box=document.getElementById("resourceList");



if(databases.length==0){

box.innerHTML="No Databases Found";

return;

}




box.innerHTML=databases.map(function(r){


return `


<div class="card">


<h3>
💻 ${r.title}
</h3>



<p>
🔗 Database Website
</p>



<a href="${r.url}" target="_blank">

Open Database

</a>



<br><br>



<button onclick="editDatabase('${r.id}')">

✏ Edit

</button>



<button 
onclick="deleteDatabase('${r.id}')"
style="background:#c62828;color:white">

🗑 Delete

</button>



</div>


`;



}).join("");



}







// ==========================
// ADD DATABASE
// ==========================


async function uploadDatabase(){



let title=document.getElementById("title").value.trim();


let link=document.getElementById("databaseLink").value.trim();




if(!title || !link){

alert("Enter Database Name and Website Link");

return;

}




let response=await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"add",

token:localStorage.getItem("token"),


title:title,


type:"Database",


department:"",

semester:"",

subject:"",

year:"",


url:link,


fileName:"",


mimeType:"",


data:""


})


});



let data=await response.json();



if(data.ok){


document.getElementById("msg").innerHTML=
"✅ Database Added Successfully";


document.getElementById("title").value="";

document.getElementById("databaseLink").value="";



loadDatabases();


}

else{


document.getElementById("msg").innerHTML=data.error;


}



}








// ==========================
// DELETE
// ==========================


async function deleteDatabase(id){


if(!confirm("Delete this Database?"))

return;



let response=await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"delete",

id:id,

token:localStorage.getItem("token")

})

});



let data=await response.json();



if(data.ok){


alert("✅ Database Deleted");


loadDatabases();


}

else{


alert(data.error);


}


}







// ==========================
// EDIT
// ==========================


function editDatabase(id){



let r=databases.find(function(x){

return x.id==id;

});



if(!r)
return;



document.getElementById("title").value=r.title;


document.getElementById("databaseLink").value=r.url;



alert("Edit details and click Add Database");


}








function backAdministration(){

window.location.href="collections.html";

}





window.onload=function(){

loadDatabases();

};
