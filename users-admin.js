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

<td>-</td>

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
