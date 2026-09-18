let users=[];


function addUser(){


let type =
document.getElementById("userType").value;


let name =
document.getElementById("userName").value;


let dept =
document.getElementById("department").value;


let year =
document.getElementById("year").value;



if(!name || !dept){

alert("Please enter Name and Department");

return;

}



users.push({

type:type,
name:name,
department:dept,
year:year

});



displayUsers();



document.getElementById("userName").value="";
document.getElementById("department").value="";
document.getElementById("year").value="";


}




function displayUsers(){


let students =
document.getElementById("studentList");


let staff =
document.getElementById("staffList");



students.innerHTML="";
staff.innerHTML="";



users.forEach((u,index)=>{


if(u.type==="Student"){


students.innerHTML += `

<tr>

<td>${u.name}</td>

<td>${u.department}</td>

<td>${u.year}</td>

<td>

<button onclick="deleteUser(${index})">
Delete
</button>

</td>

</tr>

`;

}


else{


staff.innerHTML +=`

<tr>

<td>${u.name}</td>

<td>${u.department}</td>

<td>

<button onclick="deleteUser(${index})">
Delete
</button>

</td>

</tr>

`;

}


});


}





function deleteUser(index){

users.splice(index,1);

displayUsers();

}
