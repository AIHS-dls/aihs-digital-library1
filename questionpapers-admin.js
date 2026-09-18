const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let resources=[];



// ==========================
// LOAD QUESTION PAPERS
// ==========================

async function loadQuestionPapers(){


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

return r.type=="Question Paper";

});


displayQuestionPapers();


}

else{


document.getElementById("resourceList").innerHTML=data.error;


}


}





// ==========================
// DISPLAY
// ==========================


function displayQuestionPapers(){


let box=document.getElementById("resourceList");



if(resources.length===0){

box.innerHTML="No Question Papers Found";

return;

}



box.innerHTML=resources.map(function(r){



return `


<div class="card">


<h3>
📄 ${r.title}
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

📖 Open Question Paper

</a>



<br><br>




<button onclick="editQuestionPaper('${r.id}')">

✏ Edit

</button>



<button
onclick="deleteQuestionPaper('${r.id}')"
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


async function deleteQuestionPaper(id){


if(!confirm("Delete this Question Paper?"))
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


alert("✅ Question Paper Deleted");

loadQuestionPapers();


}

else{


alert(data.error);


}


}







// ==========================
// EDIT
// ==========================


function editQuestionPaper(id){


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
// UPLOAD
// ==========================


async function uploadQuestionPaper(){


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


type:"Question Paper",


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
"✅ Question Paper Uploaded Successfully";


loadQuestionPapers();


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

loadQuestionPapers();

};
