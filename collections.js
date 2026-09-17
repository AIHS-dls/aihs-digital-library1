const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let resources=[];

let uploading = false;


// ===============================
// LOAD RESOURCES
// ===============================

async function loadResources(){


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

return r.type!="Database";

});


displayResources();


}


}





// ===============================
// DISPLAY
// ===============================


function displayResources(){


let box=document.getElementById("resourceList");


if(resources.length===0){

box.innerHTML="No Resources Found";

return;

}



box.innerHTML=resources.map(function(r){


return `


<div class="card">


<h3>
📘 ${r.title}
</h3>


<p>
Type: ${r.type}
</p>


<p>
Department: ${r.department || "-"}
</p>


<p>
Year: ${r.year || "-"}
</p>


<p>
Subject: ${r.subject || "-"}
</p>



<a href="${r.url}" target="_blank">

Open PDF

</a>


<br><br>


<button onclick="editResource('${r.id}')">

✏ Edit

</button>


<button 
onclick="deleteResource('${r.id}')"
style="background:#c62828;color:white">

🗑 Delete

</button>



</div>


`;


}).join("");

}




// ===============================
// DELETE
// ===============================


async function deleteResource(id){


if(!confirm("Delete this resource?")){

return;

}



let response=await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"delete",

id:id

})

});


let data=await response.json();



if(data.ok){


alert("Resource Deleted");


loadResources();


}

else{


alert(data.error);


}


}




// ===============================
// EDIT
// ===============================


function editResource(id){


let resource=resources.find(function(r){

return r.id==id;

});


if(!resource){

return;

}



document.getElementById("title").value=
resource.title;


document.getElementById("type").value=
resource.type;


document.getElementById("department").value=
resource.department;


document.getElementById("year").value=
resource.year;


document.getElementById("subject").value=
resource.subject;



alert(
"Edit details and upload new file"
);


}




// ===============================
// UPLOAD
// ===============================


async function uploadResource(){


if(uploading){

alert("Upload already in progress...");

return;

}


let file=document.getElementById("file").files[0];


if(!file){

alert("Select File");

return;

}


uploading=true;


let button=document.querySelector(".upload-btn");

if(button){

button.disabled=true;

button.innerHTML="Uploading...";

}



document.getElementById("msg").innerHTML=
"⏳ Uploading Resource...";



try{


let base64=await new Promise((resolve,reject)=>{


let reader=new FileReader();


reader.onload=function(){

resolve(
reader.result.split(",")[1]
);

};


reader.onerror=reject;


reader.readAsDataURL(file);


});





let response=await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},


body:JSON.stringify({

action:"add",

token: localStorage.getItem("token"),

title:
document.getElementById("title").value.trim(),


type:
document.getElementById("type").value,


department:
document.getElementById("department").value,


year:
document.getElementById("year").value,


subject:
document.getElementById("subject").value.trim(),


fileName:file.name,


mimeType:file.type,


data:base64


})

});



let data=await response.json();



if(data.ok){


document.getElementById("msg").innerHTML=
"✅ Resource Uploaded Successfully";


document.getElementById("title").value="";

document.getElementById("subject").value="";

document.getElementById("file").value="";


await loadResources();


}
else{


document.getElementById("msg").innerHTML=
"❌ "+data.error;


}



}

catch(error){


console.log(error);


document.getElementById("msg").innerHTML=
"Upload Error";


}



finally{


uploading=false;


if(button){

button.disabled=false;

button.innerHTML="📤 Upload Resource";

}


}


}
