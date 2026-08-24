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

    // Librarian ಮಾತ್ರ Admin panel ನೋಡಬಹುದು
    if($("adminPanel")){

      $("adminPanel").classList.toggle(
        "hidden",
        response.role !== "Librarian"
      );

    }

    await loadResources();

  }
  catch(error){

    console.log(error);

    $("loginMsg").innerHTML =
      error.message || "Login error";

  }

};


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

function loadUsers(){

  google.script.run
  .withSuccessHandler(function(res){

    if(res.ok){

      let html = "";

      res.users.forEach(function(user){

        html += `
        <div class="userBox">

          <b>${user.name}</b><br>
          User ID: ${user.userId}<br>
          Role: ${user.role}<br>
          Department: ${user.department || "-"}<br>

        </div>
        <hr>
        `;

      });

      document.getElementById("usersList").innerHTML = html;

    } else {

      document.getElementById("usersList").innerHTML = res.error;

    }

  })
  .getUsersFromWeb(token);

}
