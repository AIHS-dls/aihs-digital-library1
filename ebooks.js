const API="ನಿಮ್ಮ Apps Script URL";


let allBooks=[];


// Load all E-books

async function loadAllBooks(){

let response = await fetch(API,{
method:"POST",
headers:{
"Content-Type":"text/plain;charset=utf-8"
},
body:JSON.stringify({

action:"list"

})

});


let data=await response.json();


if(data.ok){

allBooks=data.resources.filter(function(r){

return r.type==="E-book";

});

}

}



async function openDept(dept){


if(allBooks.length===0){

await loadAllBooks();

}


let box=document.getElementById("booksList");


box.innerHTML=`

<h2>📚 ${dept} E-Books</h2>


<h3>Select Year</h3>

<button onclick="showBooks('${dept}','1')">
1st Year
</button>

<button onclick="showBooks('${dept}','2')">
2nd Year
</button>

<button onclick="showBooks('${dept}','3')">
3rd Year
</button>

<button onclick="showBooks('${dept}','4')">
4th Year
</button>


<div id="bookResult"></div>

`;

}




function showBooks(dept,year){


let books=allBooks.filter(function(book){

return book.department===dept &&
book.year==year;

});


let box=document.getElementById("bookResult");


if(books.length===0){

box.innerHTML="<h3>No Books Found</h3>";

return;

}



box.innerHTML=books.map(function(book){

return `

<div class="card">

<h3>

<a href="${book.url}" target="_blank">

📘 ${book.title}

</a>

</h3>

</div>

`;

}).join("");

}
