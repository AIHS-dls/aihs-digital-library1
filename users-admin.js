// =====================================
// AIHS DIGITAL LIBRARY
// USER MANAGEMENT
// =====================================


const API =
"https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let users = [];



// =====================================
// LOAD USERS
// =====================================

async function loadUsers(){


try{


const response = await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"listUsers",

token:localStorage.getItem("token")

})

});


const data = await response.json();



if(!data.ok){

console.log(data.error);

return;

}



users = data.users || [];



displayUsers();



}

catch(error){

console.log(error);

}


}




// =====================================
// DISPLAY USERS
// =====================================


function displayUsers(){


let students =
users.filter(
u=>u.type==="Student"
);


let staff =
users.filter(
u=>u.type==="Staff"
);



document.getElementById("studentList").innerHTML =

students.map(u=>`

<tr>

<td>${u.name}</td>

<td>${u.department}</td>

<td>${u.year || "-"}</td>

<td>

<button class="edit-btn"
onclick="editUser('${u.id}')">

Edit

</button>


<button class="delete-btn"
onclick="deleteUser('${u.id}')">

Delete

</button>


</td>


</tr>


`).join("");





document.getElementById("staffList").innerHTML =


staff.map(u=>`

<tr>

<td>${u.name}</td>

<td>${u.department}</td>

<td>


<button class="edit-btn"
onclick="editUser('${u.id}')">

Edit

</button>


<button class="delete-btn"
onclick="deleteUser('${u.id}')">

Delete

</button>


</td>

</tr>


`).join("");



}





// =====================================
// ADD USER
// =====================================


async function addUser(){


let type =
document.getElementById("userType").value;


let name =
document.getElementById("userName").value.trim();


let department =
document.getElementById("department").value.trim();


let year =
document.getElementById("year").value.trim();



if(!name || !department){

alert("Enter Name and Department");

return;

}



await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"addUser",

token:localStorage.getItem("token"),

type:type,

name:name,

department:department,

year:year


})

});



alert("User Added Successfully");



document.getElementById("userName").value="";
document.getElementById("department").value="";
document.getElementById("year").value="";



loadUsers();


}





// =====================================
// DELETE USER
// =====================================


async function deleteUser(id){


if(!confirm("Delete User?")){

return;

}



await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"deleteUser",

id:id,

token:localStorage.getItem("token")

})

});



loadUsers();


}





// =====================================
// EDIT USER
// =====================================


function editUser(id){


let user =
users.find(u=>u.id==id);


if(!user)return;



document.getElementById("userName").value=user.name;

document.getElementById("department").value=user.department;

document.getElementById("year").value=user.year || "";



alert("Edit details and click Save User");


}





// =====================================
// PAGE LOAD
// =====================================


document.addEventListener(
"DOMContentLoaded",
function(){

loadUsers();

});
