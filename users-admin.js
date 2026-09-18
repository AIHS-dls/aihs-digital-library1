// =====================================
// AIHS DIGITAL LIBRARY
// USER MANAGEMENT
// =====================================


const API =
"https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let users=[];



// LOAD USERS

async function loadUsers(){

try{


const response = await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"getUsers",

token:localStorage.getItem("token")

})

});


const data = await response.json();


if(!data.ok){

console.log(data.error);

return;

}


users=data.users || [];


displayUsers();



}

catch(err){

console.log(err);

}


}



// DISPLAY USERS


function displayUsers(){


let students =
users.filter(u=>u.role==="Student");


let staff =
users.filter(u=>u.role==="Staff");



document.getElementById("studentList").innerHTML =

students.map(u=>`

<tr>

<td>${u.name}</td>

<td>${u.department}</td>

<td>${u.year || "-"}</td>

<td>

<button class="edit-btn"
onclick="editUser('${u.userId}')">
Edit
</button>


<button class="delete-btn"
onclick="deleteUser('${u.userId}')">
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
onclick="editUser('${u.userId}')">
Edit
</button>


<button class="delete-btn"
onclick="deleteUser('${u.userId}')">
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


let userId =
document.getElementById("userId").value.trim();


let password =
document.getElementById("password").value.trim();


let name =
document.getElementById("userName").value.trim();


let department =
document.getElementById("department").value.trim();


let year =
document.getElementById("year").value;



if(!userId || !password || !name || !department){

alert("Please fill all details");

return;

}



try{


const response = await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"createUser",

token:localStorage.getItem("token"),

userId:userId,

name:name,

password:password,

role:type,

department:department,

year:year

})

});



const data = await response.json();



if(data.ok){


alert(
"User Added Successfully\n\nUser ID: "
+ userId +
"\nPassword: "
+ password
);



document.getElementById("userId").value="";

document.getElementById("password").value="";

document.getElementById("userName").value="";

document.getElementById("department").value="";

document.getElementById("year").value="";


// Refresh list
loadUsers();


}


else{


alert(data.error);


}



}

catch(error){


console.log(error);

alert("User Add Error");


}


}



// DELETE USER


async function deleteUser(userId){


if(!confirm("Delete User?")) return;



await fetch(API,{

method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"deleteUser",

userId:userId,

token:localStorage.getItem("token")

})

});



loadUsers();


}




// EDIT USER


function editUser(id){


let user =
users.find(u=>u.userId==id);


if(!user)return;


document.getElementById("userName").value =
user.name;


document.getElementById("department").value =
user.department;


alert("Edit details and update.");

}




// PAGE LOAD


document.addEventListener(
"DOMContentLoaded",
function(){

loadUsers();

});


