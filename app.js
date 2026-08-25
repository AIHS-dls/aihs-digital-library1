const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";

let role="Student";
let token="";
let resources=[];

const $ = id => document.getElementById(id);


// ===============================
// LOGIN
// ===============================

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
        response?.error || "Login failed";

      return;

    }


    token=response.token;
    role=response.role;


    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");


    $("userInfo").innerHTML =
      response.userId+" • "+response.role;


    if($("adminPanel")){

      $("adminPanel").classList.toggle(
        "hidden",
        response.role !== "Librarian"
      );

    }


    await loadResources();
    await loadBestUsers();
    await loadStaff();
    await loadEvents();

    if(response.role === "Librarian"){

  await loadUsers();

}


  }
  catch(error){

    console.log(error);

    $("loginMsg").innerHTML =
      error.message || "Login error";

  }

};

async function deleteUser(userId){

  if(!confirm("Delete this user?")){
    return;
  }

  let response = await post({
    action:"deleteUser",
    token:token,
    userId:userId
  });

  if(response.ok){

    alert("User deleted successfully");

    loadUsers();

  } else {

    alert(response.error || "Delete failed");

  }

}

function searchUsers(){

  let value = $("userSearch").value.toLowerCase();

  let boxes = document.querySelectorAll(".userBox");

    boxes.forEach(box => {

    let text = box.innerText.toLowerCase();

    if(text.includes(value)){
      box.style.display = "";
    }
    else{
      box.style.display = "none";
    }

  });

}


  async function loadStaff(){

  let response = await post({
    action:"getStaff",
    token:token
  });


  if(response.ok){

    let html="";


    response.staff.forEach(function(staff){

      html += `

      <div class="userBox">

      <h3>${staff.name}</h3>

      Designation: ${staff.designation}<br>

      Qualification: ${staff.qualification}<br>

      Phone: ${staff.phone}<br>

      Email: ${staff.email}<br>

      </div>

      <hr>

      `;

    });


    $("staffList").innerHTML = html;


  }
  else{

    $("staffList").innerHTML=response.error;

  }

}
  async function loadBestUsers(){

  let response = await post({
    action:"getBestUsers",
    token:token
  });


  if(response.ok){

    let html="";


    response.bestUsers.forEach(function(user){

      html += `

      <div class="userBox">

        <h3>🏆 ${user.rank}</h3>

        <b>${user.studentName}</b><br>

        Department: ${user.department || "-"}<br>

        Books Issued: ${user.booksIssued || 0}<br>

        Year: ${user.year || "-"}

      </div>

      `;

    });


    $("bestUsersList").innerHTML = html;


  } else {

    $("bestUsersList").innerHTML = response.error;

  }

}
    

// ===============================
// LOGOUT
// ===============================

if($("logout")){

  $("logout").onclick=function(){

    location.reload();

  };

}


// ===============================
// API CALL
// ===============================

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

  try{

    return JSON.parse(text);

  }
  catch(error){

    throw new Error(
      "Server returned invalid response: "+text
    );

  }

}


// ===============================
// LOAD RESOURCES
// ===============================

async function loadResources(){

  try{

    let response = await post({

      action:"list",
      token:token

    });

    console.log("RESOURCE RESPONSE:",response);

    if(!response.ok){

      throw new Error(
        response.error || "Could not load resources"
      );

    }

    resources=response.resources || [];

    render();

  }
  catch(error){

    console.log(error);

    if($("resources")){

      $("resources").innerHTML =
        "Error loading resources: "+error.message;

    }

  }

}


// ===============================
// DISPLAY + SEARCH
// ===============================

function render(){

  let box=$("resources");

  if(!box)return;

  let searchBox=$("search");

  let query=searchBox
    ? searchBox.value.trim().toLowerCase()
    : "";

  let filtered=resources.filter(function(r){

    let text=[

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


  // Count
  if($("resourceCount")){

    $("resourceCount").innerHTML =
      filtered.length+" resource(s)";

  }


  if(filtered.length===0){

    box.innerHTML=`

      <div style="
        padding:25px;
        text-align:center;
        color:#777;
      ">

        No resources found

      </div>

    `;

    return;

  }


  box.innerHTML=filtered.map(function(r){

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
            type="button"
            onclick="deleteResource('${r.id}')"
            style="
              background:#c62828;
              margin-top:10px;
            "
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


// ===============================
// SEARCH
// ===============================

if($("search")){

  $("search").addEventListener(
    "input",
    render
  );

}


// ===============================
// UPLOAD RESOURCE
// ===============================

if($("uploadForm")){

  $("uploadForm").onsubmit = async function(e){

    e.preventDefault();

    let file=$("file").files[0];

    if(!file){

      $("uploadMsg").innerHTML=
        "Please select a file";

      return;

    }


    $("uploadMsg").innerHTML=
      "Uploading...";


    try{

      let data=await toBase64(file);

      let response=await post({

        action:"add",

        token:token,

        title:$("title").value.trim(),

        type:$("rtype").value,

        department:$("rdept").value,

        semester:$("rsem").value,

        subject:$("subject").value.trim(),

        year:$("year").value.trim(),

        fileName:file.name,

        mimeType:file.type,

        data:data

      });


      if(response.ok){

        $("uploadMsg").innerHTML=
          "✅ Uploaded successfully";

        // Clear form
        $("uploadForm").reset();

        // Refresh resources
        await loadResources();

      }
      else{

        $("uploadMsg").innerHTML=
          response.error || "Upload failed";

      }

    }
    catch(error){

      console.log(error);

      $("uploadMsg").innerHTML=
        "Upload error: "+error.message;

    }

  };

}

$("staffForm").onsubmit = async function(e){

  e.preventDefault();


  $("staffMsg").innerHTML = "Adding Staff...";


  try{

    let response = await post({

      action:"addStaff",

      token:token,

      name:$("staffName").value.trim(),

      designation:$("staffDesignation").value.trim(),

      qualification:$("staffQualification").value.trim(),

      phone:$("staffPhone").value.trim(),

      email:$("staffEmail").value.trim()

    });


    if(response.ok){

      $("staffMsg").innerHTML =
      "Staff added successfully";


      $("staffForm").reset();


      await loadStaff();


    }
    else{

      $("staffMsg").innerHTML =
      response.error;

    }


  }
  catch(error){

    console.log(error);

    $("staffMsg").innerHTML =
    error.message;

  }

};


// ===============================
// CREATE USER
// ===============================

if($("userForm")){

  $("userForm").onsubmit=async function(e){

    e.preventDefault();

    try{

      let response=await post({

        action:"createUser",

        token:token,

        userId:$("newId").value.trim(),

        name:$("newName").value.trim(),

        password:$("newPass").value,

        role:$("newRole").value,

        department:$("newDept").value

      });


      if(response.ok){

        $("userMsg").innerHTML=
          "✅ User created successfully";

        $("userForm").reset();

      }
      else{

        $("userMsg").innerHTML=
          response.error || "Could not create user";

      }

    }
    catch(error){

      $("userMsg").innerHTML=
        error.message;

    }

  };

}


// ===============================
// DELETE RESOURCE
// ===============================

async function deleteResource(id){

  if(role !== "Librarian"){

    alert("Only Librarian can delete resources.");

    return;

  }


  if(!confirm(
    "Are you sure you want to delete this resource?"
  )){

    return;

  }


  try{

    let response=await post({

      action:"delete",

      token:token,

      id:id

    });


    if(response.ok){

      alert("✅ Resource deleted successfully");

      await loadResources();

    }
    else{

      alert(
        response.error || "Delete failed"
      );

    }

  }
  catch(error){

    console.log(error);

    alert(
      "Delete error: "+error.message
    );

  }

}


// ===============================
// FILE → BASE64
// ===============================

function toBase64(file){

  return new Promise(function(resolve,reject){

    let reader=new FileReader();

    reader.onload=function(){

      resolve(
        String(reader.result).split(",")[1]
      );

    };

    reader.onerror=reject;

    reader.readAsDataURL(file);

  });

}


// ===============================
// SECURITY
// ===============================

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
async function loadUsers(){

  console.log("LOAD USERS START");

  try{

    let response = await post({

      action:"getUsers",
      token:token

    });


    console.log("USERS RESPONSE:", response);


    if(response.ok){

      let html = "";

      response.users.forEach(function(user){

        html += `
<div class="userBox">

<b>${user.name}</b><br>
User ID: ${user.userId}<br>
Role: ${user.role}<br>
Department: ${user.department || "-"}<br>

<button 
onclick="deleteUser('${user.userId}')"
style="
background:#c62828;
color:white;
margin-top:10px;
padding:8px;
border:none;
border-radius:5px;
cursor:pointer;
">
🗑 Delete
</button>

</div>
<hr>
`;

      });


      $("usersList").innerHTML = html;


    } else {

      $("usersList").innerHTML = response.error;

    }


  } catch(error){

    console.log("USERS ERROR:", error);

    $("usersList").innerHTML = error.message;

  }

}

async function loadEvents(){

  let response = await post({
    action:"getEvents",
    token:token
  });


  if(response.ok){

    let html="";


    response.events.forEach(function(event){

      html += `

      <div class="userBox">

        <h3>🎉 ${event.title}</h3>

        <p>
        Category: ${event.category || "-"}<br>
        Date: ${event.date || "-"}<br><br>

        ${event.description || ""}
        </p>

      </div>

      `;

    });


    $("eventsList").innerHTML = html;


  } else {

    $("eventsList").innerHTML = response.error;

  }

}
