// ===============================
// AIHS DIGITAL LIBRARY
// ADMIN DASHBOARD
// ===============================


const API =
"https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";



// ===============================
// CHECK ADMIN SESSION
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const user =
            localStorage.getItem("user");

        const token =
            localStorage.getItem("token");

        const role =
            localStorage.getItem("role");


        /*
         * No valid session
         */

        if(
            !user ||
            !token ||
            role !== "Librarian"
        ){

            window.location.href =
                "index.html";

            return;

        }


        /*
         * Show librarian information
         */

        const userInfo =
            document.getElementById(
                "adminUserInfo"
            );


        if(userInfo){

            userInfo.textContent =
                user + " • " + role;

        }


        /*
         * Load collection counts
         */

        loadCollectionCounts();

        loadBestUsers();
        
        loadAdminEvents();
        

    }
);



// ===============================
// BACK TO DASHBOARD
// ===============================

function backToDashboard(){

    /*
     * IMPORTANT:
     * Do NOT remove localStorage here.
     * This is only BACK, not LOGOUT.
     */

    window.location.href =
        "index.html?dashboard=1";

}



// ===============================
// OPEN ADMIN COLLECTION
// ===============================

function openCollection(page){

    window.location.href =
        page;

}



// ===============================
// OPEN ADMINISTRATION
// ===============================

function openAdministration(){

    window.location.href =
        "administration.html";

}



// ===============================
// OPEN EVENTS
// ===============================

function openEvents(){

    window.location.href =
        "events.html";

}



// ===============================
// ADMIN LOGOUT
// ===============================

function logoutAdmin(){

    /*
     * Logout ಮಾತ್ರ ಇಲ್ಲಿ.
     */

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    localStorage.removeItem("role");


    window.location.href =
        "index.html";

}



// ===============================
// LOAD COLLECTION COUNTS
// ===============================

async function loadCollectionCounts(){

    try{

        const response =
            await fetch(API, {

                method:"POST",

                headers:{
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:JSON.stringify({

                    action:"list",

                    token:
                        localStorage.getItem(
                            "token"
                        )

                })

            });


        const data =
            await response.json();


        if(!data.ok){

            console.log(
                "Count Error:",
                data.error
            );

            return;

        }


        const resources =
            data.resources || [];


        const ebooks =
            resources.filter(
                r =>
                    r.type === "E-book"
            ).length;


        const notes =
            resources.filter(
                r =>
                    r.type === "Notes"
            ).length;


        const questionpapers =
            resources.filter(
                r =>
                    r.type === "Question Paper"
            ).length;


        const journals =
            resources.filter(
                r =>
                    r.type === "Journal"
            ).length;


        const databases =
            resources.filter(
                r =>
                    r.type === "Database"
            ).length;



        const ebookCount =
            document.getElementById(
                "ebookCount"
            );

        if(ebookCount){

            ebookCount.innerHTML =
                "Manage E-Books<br><b>" +
                ebooks +
                " Books</b>";

        }



        const notesCount =
            document.getElementById(
                "notesCount"
            );

        if(notesCount){

            notesCount.innerHTML =
                "Manage Notes<br><b>" +
                notes +
                " Notes</b>";

        }



        const qpCount =
            document.getElementById(
                "qpCount"
            );

        if(qpCount){

            qpCount.innerHTML =
                "Manage Question Papers<br><b>" +
                questionpapers +
                " Papers</b>";

        }



        const journalCount =
            document.getElementById(
                "journalCount"
            );

        if(journalCount){

            journalCount.innerHTML =
                "Manage Journals<br><b>" +
                journals +
                " Journals</b>";

        }



        const databaseCount =
            document.getElementById(
                "databaseCount"
            );

        if(databaseCount){

            databaseCount.innerHTML =
                "Manage Databases<br><b>" +
                databases +
                " Databases</b>";

        }

    }
    catch(error){

        console.log(
            "Collection Count Error:",
            error
        );

    }

}


/* =====================================================
   LIBRARY EVENTS
===================================================== */


/*
 * LOAD EVENTS
 */

async function loadAdminEvents(){

    const box =
        document.getElementById("eventsList");


    if(!box){
        return;
    }


    box.innerHTML =
        "Loading Events...";


    try{

        const response =
            await fetch(API, {

                method:"POST",

                headers:{
                    "Content-Type":
                    "text/plain;charset=utf-8"
                },

                body:JSON.stringify({

                    action:"getEvents",

                    token:
                    localStorage.getItem("token")

                })

            });


        const data =
            await response.json();


        if(!data.ok){

            box.innerHTML =
                data.error ||
                "Unable to load events.";

            return;

        }


        const events =
            data.events || [];


        if(events.length === 0){

            box.innerHTML = `
                <div class="admin-empty-event">
                    No library events available.
                </div>
            `;

            return;

        }


        box.innerHTML =
            events.map(function(event){

                return `

                <div
                    class="admin-event-item"
                >

                    <div
                        class="admin-event-info"
                    >

                        <h4>
                            🎉
                            ${escapeHTML(
                                event.title || "-"
                            )}
                        </h4>

                        <div
                            class="admin-event-meta"
                        >

                            ${escapeHTML(
                                event.category ||
                                "Event"
                            )}

                            •

                            ${escapeHTML(
                                event.date || "-"
                            )}

                        </div>


                        <p>
                            ${escapeHTML(
                                event.description || ""
                            )}
                        </p>

                    </div>


                    <div
                        class="admin-event-actions"
                    >

                        <button
                            type="button"
                            onclick="editEvent('${escapeHTML(event.id || "")}')"
                        >
                            ✏️ Edit
                        </button>


                        <button
                            type="button"
                            class="event-delete-btn"
                            onclick="deleteEvent('${escapeHTML(event.id || "")}')"
                        >
                            🗑 Delete
                        </button>

                    </div>

                </div>

                `;

            }).join("");


    }
    catch(error){

        console.log(
            "ADMIN EVENTS ERROR:",
            error
        );


        box.innerHTML =
            "Unable to load events.";

    }

}


/*
 * OPEN ADD EVENT FORM
 */

function openEventForm(){

    const modal =
        document.getElementById(
            "eventModal"
        );


    const form =
        document.getElementById(
            "eventForm"
        );


    if(!modal || !form){
        return;
    }


    form.reset();


    document.getElementById(
        "eventId"
    ).value = "";


    document.getElementById(
        "eventFormTitle"
    ).textContent =
        "➕ Add Library Event";


    document.getElementById(
        "eventSaveBtn"
    ).textContent =
        "💾 Save Event";


    document.getElementById(
        "eventFormMsg"
    ).textContent = "";


    modal.classList.remove(
        "hidden"
    );

}


/*
 * CLOSE EVENT FORM
 */

function closeEventForm(){

    const modal =
        document.getElementById(
            "eventModal"
        );


    if(modal){

        modal.classList.add(
            "hidden"
        );

    }

}


/*
 * EDIT EVENT
 */

async function editEvent(id){

    try{

        const response =
            await fetch(API, {

                method:"POST",

                headers:{
                    "Content-Type":
                    "text/plain;charset=utf-8"
                },

                body:JSON.stringify({

                    action:"getEvents",

                    token:
                    localStorage.getItem("token")

                })

            });


        const data =
            await response.json();


        if(!data.ok){

            alert(
                data.error ||
                "Unable to load event."
            );

            return;

        }


        const event =
            (data.events || []).find(
                function(item){

                    return String(item.id) ===
                           String(id);

                }
            );


        if(!event){

            alert(
                "Event not found."
            );

            return;

        }


        document.getElementById(
            "eventId"
        ).value =
            event.id || "";


        document.getElementById(
            "eventTitle"
        ).value =
            event.title || "";


        document.getElementById(
            "eventCategory"
        ).value =
            event.category || "";


        document.getElementById(
            "eventDate"
        ).value =
            event.date || "";


        document.getElementById(
            "eventDescription"
        ).value =
            event.description || "";


        document.getElementById(
            "eventFormTitle"
        ).textContent =
            "✏️ Edit Library Event";


        document.getElementById(
            "eventSaveBtn"
        ).textContent =
            "💾 Update Event";


        document.getElementById(
            "eventFormMsg"
        ).textContent = "";


        document.getElementById(
            "eventModal"
        ).classList.remove(
            "hidden"
        );


    }
    catch(error){

        console.log(
            "EDIT EVENT ERROR:",
            error
        );

        alert(
            "Unable to edit event."
        );

    }

}


/*
 * SAVE / UPDATE EVENT
 */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const form =
            document.getElementById(
                "eventForm"
            );


        if(!form){
            return;
        }


        form.addEventListener(
            "submit",
            async function(e){

                e.preventDefault();


                const id =
                    document.getElementById(
                        "eventId"
                    ).value.trim();


                const title =
                    document.getElementById(
                        "eventTitle"
                    ).value.trim();


                const category =
                    document.getElementById(
                        "eventCategory"
                    ).value;


                const date =
                    document.getElementById(
                        "eventDate"
                    ).value;


                const description =
                    document.getElementById(
                        "eventDescription"
                    ).value.trim();


                const msg =
                    document.getElementById(
                        "eventFormMsg"
                    );


                const button =
                    document.getElementById(
                        "eventSaveBtn"
                    );


                msg.textContent =
                    id
                    ? "Updating Event..."
                    : "Saving Event...";


                button.disabled = true;


                try{

                    const response =
                        await fetch(API, {

                            method:"POST",

                            headers:{
                                "Content-Type":
                                "text/plain;charset=utf-8"
                            },

                            body:JSON.stringify({

                                action:
                                    id
                                    ? "updateEvent"
                                    : "addEvent",

                                token:
                                    localStorage.getItem(
                                        "token"
                                    ),

                                id:id,

                                title:title,

                                category:category,

                                date:date,

                                description:
                                    description

                            })

                        });


                    const data =
                        await response.json();


                    if(!data.ok){

                        msg.textContent =
                            data.error ||
                            "Operation failed.";

                        button.disabled =
                            false;

                        return;

                    }


                    msg.textContent =
                        id
                        ? "✅ Event updated successfully."
                        : "✅ Event added successfully.";


                    await loadAdminEvents();


                    setTimeout(
                        function(){

                            closeEventForm();

                        },
                        700
                    );


                }
                catch(error){

                    console.log(
                        "SAVE EVENT ERROR:",
                        error
                    );


                    msg.textContent =
                        "Unable to save event.";


                }


                button.disabled =
                    false;

            }
        );

    }
);


/*
 * DELETE EVENT
 */

async function deleteEvent(id){

    if(!confirm(
        "Are you sure you want to delete this event?"
    )){

        return;

    }


    try{

        const response =
            await fetch(API, {

                method:"POST",

                headers:{
                    "Content-Type":
                    "text/plain;charset=utf-8"
                },

                body:JSON.stringify({

                    action:"deleteEvent",

                    token:
                        localStorage.getItem(
                            "token"
                        ),

                    id:id

                })

            });


        const data =
            await response.json();


        if(!data.ok){

            alert(
                data.error ||
                "Delete failed."
            );

            return;

        }


        alert(
            "✅ Event deleted successfully."
        );


        await loadAdminEvents();


    }
    catch(error){

        console.log(
            "DELETE EVENT ERROR:",
            error
        );


        alert(
            "Unable to delete event."
        );

    }

}

// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(value){

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

/* =====================================================
   LIBRARY BEST USERS
===================================================== */


async function loadBestUsers(){

    const box =
        document.getElementById(
            "bestUsersList"
        );


    if(!box){
        return;
    }


    box.innerHTML =
        "Loading Best Users...";


    try{


        const response =
            await fetch(API, {

                method:"POST",

                headers:{
                    "Content-Type":
                    "text/plain;charset=utf-8"
                },

                body:JSON.stringify({

                    action:"getBestUsers",

                    token:
                    localStorage.getItem("token")

                })

            });



        const data =
            await response.json();



        if(!data.ok){

            box.innerHTML =
                data.error ||
                "Unable to load Best Users.";

            return;

        }



        const users =
            data.bestUsers || [];



        if(users.length === 0){

            box.innerHTML =
            `
            <div class="admin-empty-event">
                No Best Users available.
            </div>
            `;

            return;

        }



        let html = `

        <table class="best-users-table">

            <thead>

                <tr>

                    <th>
                        Department / Year
                    </th>


                    <th>
                        Student Names
                    </th>

                </tr>

            </thead>


            <tbody>

        `;



        users.forEach(function(user){


            html += `

            <tr>

                <td>
                    ${escapeHTML(
                        user.departmentYear || "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        user.studentNames || "-"
                    )}
                </td>

            </tr>

            `;


        });



        html += `

            </tbody>

        </table>

        `;



        box.innerHTML =
            html;



    }
    catch(error){

        console.log(
            "BEST USERS ERROR:",
            error
        );


        box.innerHTML =
            "Unable to load Best Users.";

    }

}


async function loadBestUsers(){

const box =
document.getElementById("bestUsersList");


if(!box)return;


box.innerHTML="Loading Best Users...";


const response =
await fetch(API,{

method:"POST",

headers:{
"Content-Type":
"text/plain;charset=utf-8"
},

body:JSON.stringify({

action:"getBestUsers",

token:
localStorage.getItem("token")

})

});


const data =
await response.json();


if(!data.ok){

box.innerHTML="No Best Users available.";
return;

}



if(data.bestUsers.length===0){

box.innerHTML="No Best Users available.";
return;

}



box.innerHTML =
data.bestUsers.map(u=>`

<div class="admin-event-item">


<h4>
🏆 ${u.department}
</h4>


<p>
${u.students}
</p>


<button onclick="editBestUser('${u.id}')">
✏️ Edit
</button>


<button onclick="deleteBestUser('${u.id}')">
🗑 Delete
</button>


</div>


`).join("");

}
