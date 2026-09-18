const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let journals=[];



// ==========================
// LOAD JOURNALS
// ==========================

async function loadJournals(){


let response=await fetch(API,{

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


journals=data.resources.filter(function(r){

return r.type=="Journal";

});


displayJournals();


}

else{


document.getElementById("resourceList").innerHTML=data.error;


}


}







// ==========================
// DISPLAY
// ==========================


function displayJournals(){


let box=document.getElementById("resourceList");



if(journals.length==0){

box.innerHTML="No Journals Found";

return;

}



box.innerHTML=journals.map(function(r){



return `


<div class="card">


<h3>
📖 ${r.title}
</h3>



<p>
🔗 Website Link
</p>



<a href="${r.url}" target="_blank">

Open Journal

</a>



<br><br>



<button onclick="editJournal('${r.id}')">

✏ Edit

</button>



<button 
onclick="deleteJournal('${r.id}')"
style="background:#c62828;color:white">

🗑 Delete

</button>



</div>


`;


}).join("");



}







// ==========================
// ADD JOURNAL
// ==========================


async function uploadJournal(){



let title=document.getElementById("title").value.trim();


let link=document.getElementById("journalLink").value.trim();



if(!title || !link){

alert("Enter Journal Title and Website Link");

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


type:"Journal",


department:"",


year:"",


subject:"",


fileName:"",


mimeType:"",


data:"",


url:link


})


});



let data=await response.json();



if(data.ok){


document.getElementById("msg").innerHTML=
"✅ Journal Added Successfully";


document.getElementById("title").value="";

document.getElementById("journalLink").value="";


loadJournals();


}

else{


document.getElementById("msg").innerHTML=data.error;


}


}








// ==========================
// DELETE
// ==========================


async function deleteJournal(id){


if(!confirm("Delete this Journal?"))

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

alert("✅ Journal Deleted");

loadJournals();

}

else{

alert(data.error);

}


}







// ==========================
// EDIT
// ==========================


function editJournal(id){


let r=journals.find(function(x){

return x.id==id;

});



if(!r)
return;



document.getElementById("title").value=r.title;


document.getElementById("journalLink").value=r.url;



alert("Edit details and click Add Journal");


}







function backAdministration(){

window.location.href="collections.html";

}





window.onload=function(){

loadJournals();

};
