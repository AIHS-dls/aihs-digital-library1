const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";

let role="Student";
let token="";
let resources=[];

const $ = id => document.getElementById(id);


// ROLE BUTTON
document.querySelectorAll(".role").forEach(btn=>{
 btn.onclick=()=>{
  document.querySelectorAll(".role")
  .forEach(x=>x.classList.remove("active"));

  btn.classList.add("active");
  role=btn.dataset.role;
 };
});


// LOGIN
$("loginForm").onsubmit = async function(e){

 e.preventDefault();

 $("loginMsg").innerHTML="Logging in...";

 try{

  let response = await post({
   action:"login",
   username:$("username").value.trim(),
   password:$("password").value
  });


  if(!response || !response.ok){

   $("loginMsg").innerHTML =
   response.error || "Login failed";

   return;
  }


  token=response.token;
  role=response.role;


  $("loginView").classList.add("hidden");
  $("appView").classList.remove("hidden");


  $("userInfo").innerHTML =
  response.userId+" • "+response.role;


  $("adminPanel").classList.toggle(
   "hidden",
   response.role!=="Librarian"
  );


  loadResources();


 }
 catch(error){

  console.log(error);

  $("loginMsg").innerHTML=
  error.message;

 }

};



// LOGOUT
$("logout").onclick=function(){
 location.reload();
};



// API CALL
async function post(data){

 const res = await fetch(API,{
  method:"POST",
  headers:{
   "Content-Type":"text/plain;charset=utf-8"
  },
  body:JSON.stringify(data)
 });


 const text = await res.text();

 console.log("SERVER RESPONSE:",text);


 return JSON.parse(text);

}



// LOAD RESOURCE
async function loadResources(){

 try{

 let response = await post({
  action:"list",
  token:token
 });


 console.log("RESOURCE RESPONSE:",response);


 if(!response.ok){

  throw new Error(response.error);

 }


 resources=response.resources || [];

 render();


 }
 catch(error){

 console.log(error);

 $("resources").innerHTML =
 "Error loading resources: "+error.message;

 }

}



// DISPLAY + SEARCH RESOURCES
function render(){

  let box = $("resources");

  if(!box) return;

  let searchBox = $("search");

  let query = searchBox
    ? searchBox.value.trim().toLowerCase()
    : "";

  let filtered = resources.filter(function(r){

    let text = [
      r.title,
      r.type,
      r.department,
      r.semester,
      r.subject,
      r.year
    ]
    .join(" ")
    .toLowerCase();

    return text.includes(query);

  });


  if(filtered.length === 0){

    box.innerHTML = `
      <div style="
        padding:20px;
        text-align:center;
        color:#777;
      ">
        No resources found
      </div>
    `;

    return;
  }


  box.innerHTML = filtered.map(function(r){

    return `
      <div class="card">

        <h3>
          📘 ${escapeHTML(r.title || "")}
        </h3>

        <p>
          <b>Type:</b>
          ${escapeHTML(r.type || "Other")}
        </p>

        <p>
          <b>Department:</b>
          ${escapeHTML(r.department || "-")}
        </p>

        <p>
          <b>Semester:</b>
          ${escapeHTML(r.semester || "-")}
        </p>

        <p>
          <b>Subject:</b>
          ${escapeHTML(r.subject || "-")}
        </p>

        <p>
          <b>Year:</b>
          ${escapeHTML(r.year || "-")}
        </p>

        <a
          href="${r.url}"
          target="_blank"
        >
          📖 Open Resource
        </a>

        ${
          role === "Librarian"
          ?
          `
          <button
            onclick="deleteResource('${r.id}')"
          >
            🗑 Delete
          </button>
          `
          :
          ""
        }

      </div>
    `;

  }).join("");

}


// SEARCH
if($("search")){

  $("search").addEventListener("input", function(){

    render();

  });

}




// UPLOAD
$("uploadForm").onsubmit = async function(e){

 e.preventDefault();


 let file=$("file").files[0];


 if(!file){

  $("uploadMsg").innerHTML="Select file";

  return;

 }


 $("uploadMsg").innerHTML="Uploading...";


 let data = await toBase64(file);


 let response = await post({

 action:"add",

 token:token,

 title:$("title").value,

 type:$("rtype").value,

 department:$("rdept").value,

 semester:$("rsem").value,

 subject:$("subject").value,

 year:$("year").value,

 fileName:file.name,

 mimeType:file.type,

 data:data

 });


 if(response.ok){

  $("uploadMsg").innerHTML=
  "Uploaded successfully";

  loadResources();

 }
 else{

  $("uploadMsg").innerHTML=response.error;

 }


};



// USER CREATE
$("userForm").onsubmit = async function(e){

e.preventDefault();


let response=await post({

 action:"createUser",

 token:token,

 userId:$("newId").value,

 name:$("newName").value,

 password:$("newPass").value,

 role:$("newRole").value,

 department:$("newDept").value

});


if(response.ok){

$("userMsg").innerHTML="User created";

}
else{

$("userMsg").innerHTML=response.error;

}


};



// FILE BASE64
function toBase64(file){

return new Promise((resolve,reject)=>{

let reader=new FileReader();

reader.onload=()=>{

resolve(
String(reader.result).split(",")[1]
);

};

reader.onerror=reject;

reader.readAsDataURL(file);

});

}



// SECURITY
function escapeHTML(text){

return String(text || "")
.replace(/[&<>"']/g,function(m){

return {

"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"

}[m];

});

}
