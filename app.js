const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";

window.onload=function(){

loadPublicResources();

loadPublicEvents();

loadPublicBestUsers();

}

let role="Student";
let token="";
let resources=[];

const $ = id => document.getElementById(id);


// ===============================
// LOGIN
// ===============================

let loginForm = $("loginForm");

if(loginForm){

loginForm.onsubmit = async function(e){

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
    
    localStorage.setItem("user", response.userId);
    localStorage.setItem("token", response.token);
    localStorage.setItem("role", response.role);
  
$("loginView").classList.add("hidden");

$("appView").classList.remove("hidden");

 $("publicHome").classList.add("hidden");

    history.pushState(null,null,location.href);

window.onpopstate=function(){

history.pushState(null,null,location.href);

};


  if(
    response.role === "Student" ||
    response.role === "Staff"
){

    $("studentDashboard")
        .classList.remove("hidden");


    if($("adminPanel")){

        $("adminPanel")
            .classList.add("hidden");

    }

}  

    $("userInfo").innerHTML =
      response.userId+" • "+response.role;


    if($("adminPanel")){

      $("adminPanel").classList.toggle(
        "hidden",
        response.role !== "Librarian"
      );

    }

if(response.role === "Librarian"){

    window.location.href = "administration.html";

    return;

}
else{

    await loadStudentDashboard();

}


}
catch(error){

    console.log(error);

    $("loginMsg").innerHTML =
      error.message || "Login error";

}

};

}
 

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

  try{

    let response = await post({
      action:"getBestUsers",
      token:token
    });

    if(!response.ok){

      let errorText =
        response.error || "Unable to load Best Users.";

      if($("bestUsersList")){
        $("bestUsersList").innerHTML = errorText;
      }

      if($("studentBestUsers")){
        $("studentBestUsers").innerHTML = errorText;
      }

      return;
    }

    let users = response.bestUsers || [];

    if(users.length === 0){

      let emptyText = "No Best Users available.";

      if($("bestUsersList")){
        $("bestUsersList").innerHTML = emptyText;
      }

      if($("studentBestUsers")){
        $("studentBestUsers").innerHTML = emptyText;
      }

      return;
    }

    /* ==========================================
       LIBRARIAN BEST USERS
       ========================================== */

    if($("bestUsersList")){

      $("bestUsersList").innerHTML =
        users.map(function(user){

          return `

          <div class="userBox">

            <h3>🏆 ${escapeHTML(user.rank || "")}</h3>

            <b>${escapeHTML(user.studentName || "")}</b><br>

            Department:
            ${escapeHTML(user.department || "-")}<br>

            Books Issued:
            ${escapeHTML(user.booksIssued || 0)}<br>

            Year:
            ${escapeHTML(user.year || "-")}

          </div>

          `;

        }).join("");

    }


    /* ==========================================
       STUDENT / STAFF DASHBOARD
       ========================================== */

    if($("studentBestUsers")){

      $("studentBestUsers").innerHTML =
        users.map(function(user){

          return `

          <div class="best-user-item">

            <span class="best-user-name">
              🏆 ${escapeHTML(user.studentName || "-")}
            </span>

            <span class="best-user-count">
              ${escapeHTML(user.booksIssued || 0)} Books
            </span>

          </div>

          `;

        }).join("");

    }

  }
  catch(error){

    console.log("BEST USERS ERROR:", error);

    if($("bestUsersList")){
      $("bestUsersList").innerHTML =
        "Unable to load Best Users.";
    }

    if($("studentBestUsers")){
      $("studentBestUsers").innerHTML =
        "Unable to load Best Users.";
    }

  }

}

// ===============================
// LOGOUT
// ===============================

if($("logout")){

    $("logout").onclick=function(){

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        localStorage.removeItem("role");

        token = "";

        role = "";

        window.location.href =
            "index.html";

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
      token:localStorage.getItem("token")

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


  // ===============================
  // COUNT
  // ===============================

  if($("resourceCount")){

    $("resourceCount").innerHTML =
      filtered.length + " resource(s)";

  }


  // ===============================
  // NO RESULTS
  // ===============================

  if(filtered.length === 0){

    box.innerHTML = `

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


  // ===============================
  // DISPLAY
  // ===============================

  box.innerHTML = filtered.map(function(r){

    return `

      <div
      class="card public-resource-card"
      data-type="${escapeHTML(r.type || "")}"
      >

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
    $("uploadForm").querySelector("button").disabled=true;


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

$("uploadMsg").innerHTML =
"✅ Resource uploaded successfully";

$("uploadForm").querySelector("button").disabled=false;

$("uploadForm").reset();

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

// ===============================
// DRIVE IMAGE CONVERTER
// ===============================

function convertDriveImage(url){

    if(!url){
        return "";
    }


    url = String(url).trim();


    // Already direct image
    if(url.includes("googleusercontent.com")){
        return url;
    }


    // Extract Drive File ID
    let match = url.match(/[-\w]{25,}/);


    if(match){

        return "https://drive.google.com/thumbnail?id="
        + match[0]
        + "&sz=w1000";

    }


    return url;

}

async function loadEvents(){

  try{

    let response = await post({
      action:"getEvents",
      token:token
    });

    if(!response.ok){

      let errorText =
        response.error || "Unable to load events.";

      if($("eventsList")){
        $("eventsList").innerHTML = errorText;
      }

      if($("studentEvents")){
        $("studentEvents").innerHTML = errorText;
      }

      return;
    }

    let events = response.events || [];


    /* ==========================================
       NO EVENTS
       ========================================== */

    if(events.length === 0){

      let emptyText = "No upcoming events.";

      if($("eventsList")){
        $("eventsList").innerHTML = emptyText;
      }

      if($("studentEvents")){
        $("studentEvents").innerHTML = emptyText;
      }

      return;

    }


    /* ==========================================
       LIBRARIAN EVENTS
       ========================================== */

    if($("eventsList")){

      $("eventsList").innerHTML =
        events.map(function(event){

          return `

          <div class="userBox">

            <h3>
              🎉 ${escapeHTML(event.title || "")}
            </h3>

            <p>

              Category:
              ${escapeHTML(event.category || "-")}
              <br>

              Date:
              ${escapeHTML(event.date || "-")}
              <br><br>

              ${escapeHTML(event.description || "")}

            </p>

          </div>

          `;

        }).join("");

    }


    /* ==========================================
       STUDENT / STAFF DASHBOARD
       ========================================== */

    if($("studentEvents")){

      $("studentEvents").innerHTML =
        events.map(function(event){

          return `

          <div class="library-event-item">

            <div class="library-event-title">
              🎉 ${escapeHTML(event.title || "")}
            </div>

            <div class="library-event-date">

              ${escapeHTML(event.category || "Event")}
              •
              ${escapeHTML(event.date || "-")}

            </div>

          </div>

          `;

        }).join("");

    }

  }
  catch(error){

    console.log("EVENT ERROR:", error);

    if($("eventsList")){
      $("eventsList").innerHTML =
        "Unable to load events.";
    }

    if($("studentEvents")){
      $("studentEvents").innerHTML =
        "Unable to load events.";
    }

  }

}

function showSection(id){

  let sections = document.querySelectorAll(".dashboard-section");

  sections.forEach(function(section){
    section.classList.add("hidden");
  });


  let selected = document.getElementById(id);

  if(selected){
    selected.classList.remove("hidden");
  }

}

let pendingSection = "";

// ===============================
// SHOW LOGIN POPUP
// ===============================

function showLogin(){

    const loginView =
        document.getElementById("loginView");


    if(!loginView){

        console.error(
            "Login popup (#loginView) not found"
        );

        return;

    }


    loginView.classList.remove("hidden");

    document.body.classList.add(
        "login-open"
    );

}

async function loadPublicResources(){

let box=document.getElementById("publicResources");


try{

let response=await post({
action:"list"
});


if(response.ok){

let resources=response.resources.slice(0,6);


box.innerHTML=resources.map(r=>`

<div class="latest-item">

📘 <b>${escapeHTML(r.title)}</b>
-
${escapeHTML(r.type)}

</div>

`).join("");

}


else{

box.innerHTML="No resources available";

}


}
catch(error){

box.innerHTML="Unable to load resources";

}

}


function filterCategory(type){

let searchBox=document.getElementById("publicSearch");

if(searchBox){

searchBox.value=type;

}

loadPublicResources();

}

function filterMenu(type){

    let resourceBox =
        document.getElementById("resourceBox");


    if(resourceBox){

        resourceBox.classList.remove("hidden");

    }


    let cards =
        document.querySelectorAll("#resources .card");


    let visibleCount = 0;


    cards.forEach(function(card){

        let category =
            card.dataset.type;


        if(category === type){

            card.style.display =
                "block";

            visibleCount++;

        }
        else{

            card.style.display =
                "none";

        }

    });


    if($("resourceCount")){

        $("resourceCount").innerHTML =
            visibleCount +
            " resource(s)";

    }


    if(resourceBox){

        resourceBox.scrollIntoView({

            behavior:"smooth"

        });

    }

}

// ===============================
// CLOSE LOGIN POPUP
// ===============================

function closeLogin(){

    const loginView =
        document.getElementById("loginView");


    if(loginView){

        loginView.classList.add("hidden");

    }


    document.body.classList.remove(
        "login-open"
    );

}


// ===============================
// CLOSE WHEN CLICKING OUTSIDE
// ===============================

const loginView =
    document.getElementById("loginView");


if(loginView){

    loginView.addEventListener(
        "click",
        function(e){

            if(e.target === this){

                closeLogin();

            }

        }
    );

}


// ===============================
// CLOSE WITH ESCAPE KEY
// ===============================

document.addEventListener(
    "keydown",
    function(e){

        if(e.key === "Escape"){

            closeLogin();

        }

    }
);

// ===============================
// OPEN PROTECTED COLLECTION
// ===============================

function openProtected(type) {

    const savedUser =
        localStorage.getItem("user");

    const savedToken =
        localStorage.getItem("token");

    const savedRole =
        localStorage.getItem("role");


    // ===============================
    // NOT LOGGED IN
    // ===============================

    if (!savedUser || !savedToken || !savedRole) {

        // Remember which section was clicked
        window.pendingSection = type;


        // Open Login Popup directly
        const loginView =
            document.getElementById("loginView");


        if (loginView) {

            loginView.classList.remove("hidden");

        } else {

            console.log(
                "ERROR: loginView element not found"
            );

        }

        return;
    }


    // ===============================
    // LOGGED IN
    // ===============================

    const pages = {

        ebooks:
            "ebooks.html",

        questionpapers:
            "questionpapers.html",

        notes:
            "notes.html",

        journals:
            "journals.html",

        databases:
            "databases.html",

        latest:
            "collections.html"

    };


    // ===============================
    // OPEN SELECTED PAGE
    // ===============================

    if (pages[type]) {

        window.location.href =
            pages[type];

        return;

    }


    console.log(
        "Unknown protected section:",
        type
    );

}

async function loadStudentDashboard(){

    /*
     * Make sure dashboard is visible
     */

    let dashboard =
        document.getElementById(
            "studentDashboard"
        );


    if(dashboard){

        dashboard.classList.remove(
            "hidden"
        );

    }


    /*
     * LOAD RESOURCES
     */

    try{

        let response =
            await post({

                action:"list",

                token:token

            });


        if(response.ok){

            resources =
                response.resources || [];


    // ===============================
// LATEST RESOURCES
// ONE FROM EACH CATEGORY
// ===============================

let latestBox =
    document.getElementById(
        "studentLatestResources"
    );


if(latestBox){

    let latest = [];

    let types = [

        "E-book",
        "Notes",
        "Question Paper",
        "Journal",
        "Database"

    ];


    types.forEach(function(type){

        let item =
            resources.find(function(r){

                return r.type === type;

            });


        if(item){

            latest.push(item);

        }

    });


    if(latest.length === 0){

        latestBox.innerHTML =
            "<p>No resources available.</p>";

    }
    else{

        latestBox.innerHTML =
            latest.map(function(r){

                return `

                <div
                class="card"
                data-type="${escapeHTML(
                    r.type || ""
                )}"
                >

                <h3>
                📘 ${escapeHTML(
                    r.title || ""
                )}
                </h3>


                <p>
                <b>Type:</b>
                ${escapeHTML(
                    r.type || "-"
                )}
                </p>


                <p>
                <b>Department:</b>
                ${escapeHTML(
                    r.department || "-"
                )}
                </p>


                <p>
                <b>Year:</b>
                ${escapeHTML(
                    r.year || "-"
                )}
                </p>


                <p>
                <b>Subject:</b>
                ${escapeHTML(
                    r.subject || "-"
                )}
                </p>


                <a
                href="${r.url}"
                target="_blank"
                >

                📖 Open Resource

                </a>


                </div>

                `;

            }).join("");

    }

}

            /*
             * Render all resources
             */

            render();

        }
        else{

            console.log(
                response.error
            );

        }

    }
    catch(error){

        console.log(
            "STUDENT RESOURCE ERROR:",
            error
        );

    }

      
/*
 * LOAD BEST USERS
 */

try{

    await loadBestUsers();

}
catch(error){

    console.log(
        "STUDENT BEST USERS ERROR:",
        error
    );

}


/*
 * LOAD EVENTS
 */

try{

    await loadEvents();

}
catch(error){

    console.log(
        "STUDENT EVENTS ERROR:",
        error
    );

}

}
  
function openBooks(){

    if(!localStorage.getItem("user")){

        showLogin();

        return;

    }

    window.location.href="ebooks.html";

}

function openAdminPage(page){

window.location.href = page;

}

// ===============================
// RESTORE LOGIN SESSION
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    async function(){

        let savedUser =
            localStorage.getItem("user");


        let savedToken =
            localStorage.getItem("token");


        let savedRole =
            localStorage.getItem("role");


        if(
            !savedUser ||
            !savedToken ||
            !savedRole
        ){

            return;

        }


        /*
         * Restore variables
         */

        token = savedToken;

        role = savedRole;


        /*
         * Hide public home
         */

        if($("publicHome")){

            $("publicHome")
                .classList.add("hidden");

        }


        /*
         * Hide login
         */

        if($("loginView")){

            $("loginView")
                .classList.add("hidden");

        }


        /*
         * Show application
         */

        if($("appView")){

            $("appView")
                .classList.remove("hidden");

        }


        /*
         * User information
         */

        if($("userInfo")){

            $("userInfo").innerHTML =
                savedUser +
                " • " +
                savedRole;

        }


        /*
         * STUDENT / STAFF
         */

        if(
            savedRole === "Student" ||
            savedRole === "Staff"
        ){

            if($("studentDashboard")){

                $("studentDashboard")
                    .classList.remove("hidden");

            }


            if($("adminPanel")){

                $("adminPanel")
                    .classList.add("hidden");

            }


            await loadStudentDashboard();

        }


        /*
         * LIBRARIAN
         */

       if(savedRole === "Librarian"){

    window.location.href =
        "administration.html";

    return;

}

    }
);


// ===============================
// PUBLIC LIBRARY EVENTS
// ===============================

async function loadPublicEvents(){

    const box =
        document.getElementById(
            "publicEvents"
        );


    if(!box){

        return;

    }


    try{

        const response =
            await post({
                action: "getEvents"
            });


        console.log(
            "Public Events:",
            response
        );


        if(!response || !response.ok){

            box.innerHTML = `
                <div class="professional-empty">
                    No library events available.
                </div>
            `;

            console.error(
                "Events loading failed:",
                response
            );

            return;

        }


        const events =
            response.events || [];


        if(events.length === 0){

            box.innerHTML = `
                <div class="professional-empty">
                    No library events available.
                </div>
            `;

            return;

        }


        box.innerHTML =
            events.map(
                function(event,index){

                    return `

                    <div class="professional-event-card">

                        <div class="event-professional-top">

                            <div class="event-number">
                                ${String(index + 1).padStart(2,"0")}
                            </div>

                            <div>

                                <span class="event-professional-category">
                                    ${escapeHTML(
                                        event.category || "EVENT"
                                    )}
                                </span>

                                <h3>
                                    ${escapeHTML(
                                        event.title || "Library Event"
                                    )}
                                </h3>

                            </div>

                        </div>


                        <div class="professional-event-date">

                            📅

                            <span>
                                ${escapeHTML(
                                    event.date || ""
                                )}
                            </span>

                        </div>

                      
${
event.image1 || event.image2 || event.image3
?
`
<div class="event-slider"
id="slider-${index}">

${
[
event.image1,
event.image2,
event.image3
]
.filter(function(img){

return img &&
img !== "undefined" &&
img !== "";

})
.map(function(img,i){

return `

<img
src="${convertDriveImage(img)}"
class="event-slide"
style="
display:${i===0?"block":"none"};
width:100%;
max-width:500px;
border-radius:12px;
margin-top:15px;
"
/>

`;

}).join("")

}

</div>
`
:
`
<small>
No event images
</small>
`
}

<p class="professional-event-description">
${escapeHTML(
    event.description || ""
)}
</p>


                    </div>

                    `;

                }
            ).join("");
      
      startEventSliders();

    }

    catch(error){

        console.error(
            "Public Events Error:",
            error
        );


        box.innerHTML = `
            <div class="professional-empty">
                Unable to load library events.
            </div>
        `;

    }

}

function startEventSliders(){

    document
    .querySelectorAll(".event-slider")
    .forEach(function(slider){


        let images =
            slider.querySelectorAll("img");


        if(images.length <= 1){
            return;
        }


        let current = 0;


        setInterval(function(){


            images[current]
            .style.display="none";


            current =
            (current + 1)
            % images.length;


            images[current]
            .style.display="block";


        },3000);


    });

}

// ===============================
// PUBLIC BEST USERS
// ===============================

async function loadPublicBestUsers(){

    try{

        const response =
            await post({
                action: "getBestUsers"
            });


        console.log(
            "Public Best Users:",
            response
        );


        if(!response || !response.ok){

            console.error(
                "Best Users loading failed:",
                response
            );

            return;

        }


        const users =
            response.bestUsers || [];


        const box =
            document.getElementById(
                "publicBestUsers"
            );


        if(!box){

            return;

        }


        /*
         * Department names
         */

        const departments = {

            BPT:
                "Physiotherapy",

            BMLT:
                "Medical Laboratory Technology",

            BMIT:
                "Medical Imaging Technology",

            MHA:
                "Master of Hospital Administration"

        };


        /*
         * Find Best User for department
         */

        function findUser(department){

            return users.find(function(user){

                const value =
                    String(
                        user.department || ""
                    )
                    .trim()
                    .toUpperCase();


                return value ===
                    department;

            });

        }


        /*
         * Create exactly 4 cards
         */

        const departmentCodes = [
            "BPT",
            "BMLT",
            "BMIT",
            "MHA"
        ];


        box.innerHTML =
            departmentCodes.map(
                function(department, index){

                    const user =
                        findUser(department);


                    const studentName =
                        user &&
                        user.studentNames
                            ? user.studentNames
                            : "—";


                    const year =
                        user &&
                        user.year
                            ? user.year
                            : "—";


                    return `

                    <div class="professional-user-card">

                        <div class="user-professional-top">

                            <div class="user-rank">
                                ${String(index + 1).padStart(2,"0")}
                            </div>

                            <div>

                                <h3 class="user-professional-name">
                                    ${escapeHTML(department)}
                                </h3>

                                <p class="user-professional-label">
                                    ${escapeHTML(
                                        departments[department]
                                    )}
                                </p>

                            </div>

                        </div>


                        <div class="user-professional-details">

                            <div class="user-detail-box">

                                <span class="user-detail-label">
                                    Best User
                                </span>

                                <span class="user-detail-value">
                                    ${escapeHTML(studentName)}
                                </span>

                            </div>


                            <div class="user-detail-box">

                                <span class="user-detail-label">
                                    Year
                                </span>

                                <span class="user-detail-value">
                                    ${escapeHTML(year)}
                                </span>

                            </div>

                        </div>

                    </div>

                    `;

                }
            ).join("");

    }

    catch(error){

        console.error(
            "Best Users Error:",
            error
        );

    }

}
