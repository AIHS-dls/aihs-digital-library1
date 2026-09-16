const API="YOUR_APPS_SCRIPT_URL";


function openDept(dept){

let box=document.getElementById("booksList");


box.innerHTML=`

<h2>📚 ${dept} E-Books</h2>

<button onclick="loadBooks('${dept}','1')">
1st Year
</button>

<button onclick="loadBooks('${dept}','2')">
2nd Year
</button>

<button onclick="loadBooks('${dept}','3')">
3rd Year
</button>

<button onclick="loadBooks('${dept}','4')">
4th Year
</button>


<div id="bookResult"></div>

`;

}



async function loadBooks(dept,year){


let response = await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"list",

type:"E-book",

department:dept,

year:year

})

});


let data=await response.json();



let box=document.getElementById("bookResult");


if(data.ok){


box.innerHTML=data.resources.map(r=>`

<div class="card">


<h3>

<a href="${r.url}" target="_blank">

📘 ${r.title}

</a>

</h3>


</div>


`).join("");


}

else{


box.innerHTML="No Books Found";


}



}
