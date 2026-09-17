const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let ebooks=[];


// ===============================
// LOAD E-BOOKS
// ===============================

async function loadEbooks(){


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


ebooks=data.resources.filter(function(r){

return r.type=="E-book";

});


displayEbooks();


}

else{

document.getElementById("ebookList").innerHTML=
data.error;

}


}




// ===============================
// DISPLAY
// ===============================


function displayEbooks(list=ebooks){


let box=document.getElementById("ebookList");


if(list.length===0){

box.innerHTML=
"No E-Books Found";

return;

}



box.innerHTML=list.map(function(r){


return `


<div class="card">


<h3>
📘 ${r.title}
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

📖 Open PDF

</a>


<br><br>


<button onclick="editEbook('${r.id}')">

✏ Edit

</button>



<button 
onclick="deleteEbook('${r.id}')"
style="background:#c62828;color:white">

🗑 Delete

</button>


</div>


`;


}).join("");

}



// ===============================
// SEARCH
// ===============================


function searchBooks(){


let value=document
.getElementById("searchBook")
.value
.toLowerCase();



let result=ebooks.filter(function(r){


return (

r.title.toLowerCase()
.includes(value)

);


});


displayEbooks(result);


}




// ===============================
// UPLOAD
// ===============================


async function uploadEbook(){


let file=document
.getElementById("file")
.files[0];


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


type:"E-book",


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
"✅ E-Book Uploaded Successfully";


document.getElementById("title").value="";

document.getElementById("subject").value="";

document.getElementById("file").value="";


loadEbooks();


}

else{


document.getElementById("msg").innerHTML=
"❌ "+data.error;


}



};


reader.readAsDataURL(file);


}



// ===============================
// DELETE
// ===============================


async function deleteEbook(id){


if(!confirm("Delete this E-Book?"))
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

alert("✅ Deleted");

loadEbooks();

}

else{

alert(data.error);

}


}




// ===============================
// EDIT
// ===============================


function editEbook(id){


let book=ebooks.find(function(r){

return r.id==id;

});


if(!book)
return;



document.getElementById("title").value=
book.title;


document.getElementById("subject").value=
book.subject;


document.getElementById("department").value=
book.department;


document.getElementById("year").value=
book.year;


window.scrollTo({

top:0,

behavior:"smooth"

});


alert(
"Edit details and upload new PDF"
);


}




function backCollections(){

window.location.href="collections.html";

}



window.onload=function(){

loadEbooks();

};
