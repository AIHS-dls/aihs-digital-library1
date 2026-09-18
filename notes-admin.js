const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let resources=[];


// ==========================
// LOAD NOTES
// ==========================

async function loadNotes(){


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


resources=data.resources.filter(function(r){

return r.type=="Notes";

});


displayNotes();


}

else{

document.getElementById("resourceList").innerHTML=
data.error;

}


}





// ==========================
// DISPLAY NOTES
// ==========================


function displayNotes(){


let box=document.getElementById("resourceList");


if(resources.length===0){

box.innerHTML="No Notes Found";

return;

}



box.innerHTML=resources.map(function(r){


return `


<div class="card">


<h3>
📝 ${r.title}
</h3>


<p>
Department : ${r.department || "-"}
</p>


<p>
Year : ${r.year || "-"}
</p>


<p>
Subject : ${r.subject || "-"}
</p>



<a href="${r.url}" target="_blank">

📖 Open Notes

</a>


<br><br>



<button onclick="editNotes('${r.id}')">

✏ Edit

</button>



<button 
onclick="deleteNotes('${r.id}')"
style="background:#c62828;color:white">

🗑 Delete

</button>



</div>


`;


}).join("");

}





// ==========================
// DELETE
// ==========================


async function deleteNotes(id){


if(!confirm("Delete this Note?"))
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

alert("✅ Note Deleted");

loadNotes();

}

else{

alert(data.error);

}


}





// ==========================
// EDIT
// ==========================


function editNotes(id){


let r=resources.find(function(x){

return x.id==id;

});


if(!r)
return;



document.getElementById("title").value=r.title;

document.getElementById("department").value=r.department;

document.getElementById("year").value=r.year;

document.getElementById("subject").value=r.subject;


alert("Edit details and upload new file");


}





// ==========================
// UPLOAD NOTES
// ==========================


async function uploadNotes(){


let file=document.getElementById("file").files[0];


if(!file){

alert("Select PDF File");

return;

}



document.getElementById("msg").innerHTML=
"Uploading...";



let reader=new FileReader();


reader.onload=async function(){


let base64=
reader.result.split(",")[1];



let response=await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"add",

token:localStorage.getItem("token"),


title:
document.getElementById("title").value,


type:"Notes",


department:
document.getElementById("department").value,


year:
document.getElementById("year").value,


subject:
document.getElementById("subject").value,


fileName:file.name,


mimeType:file.type,


data:base64


})

});



let data=await response.json();



if(data.ok){


document.getElementById("msg").innerHTML=
"✅ Notes Uploaded Successfully";


loadNotes();


}

else{


document.getElementById("msg").innerHTML=
data.error;


}


};



reader.readAsDataURL(file);


}





function backAdministration(){

window.location.href="collections.html";

}




window.onload=function(){

loadNotes();

};
