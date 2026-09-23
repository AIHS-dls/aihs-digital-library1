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


/* =====================================================
   LOAD EVENTS
===================================================== */

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


const text = await response.text();

console.log(
    "ADMIN EVENTS RAW RESPONSE:",
    text
);

const data = JSON.parse(text);

if(!data.ok){

    console.log(
        "EVENT ERROR:",
        data.error
    );

    box.innerHTML =
        data.error ||
        "Unable to load events.";

    return;

}
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

                <div class="admin-event-item">

                    <div class="admin-event-info">

                        <h4>
                            🎉
                            ${escapeHTML(
                                event.title || "-"
                            )}
                        </h4>


                        <div class="admin-event-meta">

                            ${escapeHTML(
                                event.category ||
                                "Library Event"
                            )}

                            •

                            ${escapeHTML(
                                formatEventDateAdmin(
                                    event.date
                                )
                            )}

                        </div>


                        <p>
                            ${escapeHTML(
                                event.description || ""
                            )}
                        </p>

                      ${
    event.image1 ||
    event.image2 ||
    event.image3
    ?
    `

    <div class="event-images">

        ${
            event.image1
            ?
            `
            <img 
                src="${convertDriveImage(event.image1)}"
                class="event-image"
                loading="lazy"
            >
            `
            :
            ""
        }


        ${
            event.image2
            ?
            `
            <img 
                src="${convertDriveImage(event.image2)}"
                class="event-image"
                loading="lazy"
            >
            `
            :
            ""
        }


        ${
            event.image3
            ?
            `
            <img 
                src="${convertDriveImage(event.image3)}"
                class="event-image"
                loading="lazy"
            >
            `
            :
            ""
        }


    </div>

    `
    :
    `
    <small
        style="
            color:#94a3b8;
        "
    >
        No event images
    </small>
    `
}
                       
                    </div>


                    <div class="admin-event-actions">

                        <button
                            type="button"
                            onclick="editEvent('${escapeHTML(
                                event.id || ""
                            )}')"
                        >
                            ✏️ Edit
                        </button>


                        <button
                            type="button"
                            class="event-delete-btn"
                            onclick="deleteEvent('${escapeHTML(
                                event.id || ""
                            )}')"
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



/* =====================================================
   OPEN ADD EVENT FORM
===================================================== */

function openEventForm(){

    const modal =
        document.getElementById("eventModal");


    const form =
        document.getElementById("eventForm");


    if(!modal || !form){
        return;
    }


    form.reset();


    document.getElementById(
        "eventId"
    ).value = "";


    document.getElementById(
        "eventModalTitle"
    ).textContent =
        "➕ Add Library Event";


    document.getElementById(
        "eventSaveBtn"
    ).textContent =
        "💾 Save Event";


    document.getElementById(
        "eventFormMsg"
    ).textContent = "";


    modal.classList.remove("hidden");

}



/* =====================================================
   CLOSE EVENT FORM
===================================================== */

function closeEventForm(){

    const modal =
        document.getElementById("eventModal");


    if(modal){

        modal.classList.add("hidden");

    }

}



/* =====================================================
   READ / COMPRESS EVENT IMAGE
===================================================== */

function readEventImage(file){

    return new Promise(function(resolve, reject){

        if(!file){

            resolve("");

            return;

        }


        const reader =
            new FileReader();


        reader.onload = function(){

            const img =
                new Image();


            img.onload = function(){

                const maxWidth = 1600;


                let width =
                    img.width;


                let height =
                    img.height;


                if(width > maxWidth){

                    height =
                        height *
                        maxWidth /
                        width;

                    width =
                        maxWidth;

                }


                const canvas =
                    document.createElement("canvas");


                canvas.width =
                    width;


                canvas.height =
                    height;


                const ctx =
                    canvas.getContext("2d");


                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );


                resolve(
                    canvas.toDataURL(
                        "image/jpeg",
                        0.78
                    )
                );

            };


            img.onerror = function(){

                reject(
                    new Error("Invalid image")
                );

            };


            img.src =
                reader.result;

        };


        reader.onerror = function(){

            reject(
                new Error(
                    "Unable to read image"
                )
            );

        };


        reader.readAsDataURL(file);

    });

}



/* =====================================================
   EDIT EVENT
===================================================== */

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

            alert("Event not found.");

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
            formatDateForInput(
                event.date
            );


        document.getElementById(
            "eventDescription"
        ).value =
            event.description || "";


        /*
           Browser does not allow
           pre-filling file inputs.
        */

        document.getElementById(
            "eventImage1"
        ).value = "";


        document.getElementById(
            "eventImage2"
        ).value = "";


        document.getElementById(
            "eventImage3"
        ).value = "";


        document.getElementById(
            "eventModalTitle"
        ).textContent =
            "✏️ Edit Library Event";


        document.getElementById(
            "eventSaveBtn"
        ).textContent =
            "💾 Update Event";


        document.getElementById(
            "eventFormMsg"
        ).textContent =
            "Existing images will remain unless replaced.";


        document.getElementById(
            "eventModal"
        ).classList.remove("hidden");

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



/* =====================================================
   SAVE / UPDATE EVENT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const form =
            document.getElementById("eventForm");


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
                    ).value.trim();


                const date =
                    document.getElementById(
                        "eventDate"
                    ).value;


                const description =
                    document.getElementById(
                        "eventDescription"
                    ).value.trim();


                const imageFile1 =
                    document.getElementById(
                        "eventImage1"
                    ).files[0];


                const imageFile2 =
                    document.getElementById(
                        "eventImage2"
                    ).files[0];


                const imageFile3 =
                    document.getElementById(
                        "eventImage3"
                    ).files[0];


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
                    ?
                    "Preparing event..."
                    :
                    "Preparing images...";


                button.disabled = true;


                try{

                    /*
                       Compress selected images.
                    */

                    const image1 =
                        await readEventImage(
                            imageFile1
                        );


                    const image2 =
                        await readEventImage(
                            imageFile2
                        );


                    const image3 =
                        await readEventImage(
                            imageFile3
                        );


                    msg.textContent =
                        id
                        ?
                        "Updating Event..."
                        :
                        "Saving Event...";


                    const payload = {

                        action:
                            id
                            ?
                            "updateEvent"
                            :
                            "addEvent",

                        token:
                            localStorage.getItem(
                                "token"
                            ),

                        id:
                            id,

                        title:
                            title,

                        category:
                            category,

                        date:
                            date,

                        description:
                            description,

                        image1:
                            image1,

                        image2:
                            image2,

                        image3:
                            image3

                    };


                    const response =
                        await fetch(API, {

                            method:"POST",

                            headers:{
                                "Content-Type":
                                "text/plain;charset=utf-8"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )

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
                        ?
                        "✅ Event updated successfully."
                        :
                        "✅ Event added successfully.";


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
                        error.message ||
                        "Unable to save event.";

                }


                button.disabled =
                    false;

            }
        );

    }
);



/* =====================================================
   DELETE EVENT
===================================================== */

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
                    localStorage.getItem("token"),

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



/* =====================================================
   EVENT DATE HELPERS
===================================================== */

function formatDateForInput(value){

    if(!value){
        return "";
    }


    const date =
        new Date(value);


    if(
        isNaN(
            date.getTime()
        )
    ){

        return String(value)
            .substring(0,16);

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2,"0");


    const day =
        String(
            date.getDate()
        ).padStart(2,"0");


    const hours =
        String(
            date.getHours()
        ).padStart(2,"0");


    const minutes =
        String(
            date.getMinutes()
        ).padStart(2,"0");


    return (
        year +
        "-" +
        month +
        "-" +
        day +
        "T" +
        hours +
        ":" +
        minutes
    );

}


function formatEventDateAdmin(value){

    if(!value){
        return "-";
    }


    const date =
        new Date(value);


    if(
        isNaN(
            date.getTime()
        )
    ){

        return String(value);

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day:"2-digit",
            month:"long",
            year:"numeric"
        }
    );

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

// =====================================================
// LIBRARY BEST USERS
// LOAD + LIST + EDIT + DELETE
// =====================================================

let bestUsersData = [];


async function loadBestUsers(){

    const box =
        document.getElementById("bestUsersList");


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


        /*
         * Backend returns:
         *
         * id
         * department
         * year
         * studentNames
         * createdAt
         */

        bestUsersData =
            data.bestUsers || [];


        if(
            !Array.isArray(bestUsersData) ||
            bestUsersData.length === 0
        ){

            box.innerHTML = `
                <div class="admin-empty-event">
                    No Best Users available.
                </div>
            `;

            return;

        }


        let html = `

            <div class="best-users-table-wrapper">

                <table class="best-users-table">

                    <thead>

                        <tr>

                            <th>
                                SL
                            </th>

                            <th>
                                Department / Year
                            </th>

                            <th>
                                Student Names
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

        `;


        bestUsersData.forEach(
            function(user,index){

                html += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>


                        <td>

                            <strong>
                                ${escapeHTML(
                                    user.department || "-"
                                )}
                            </strong>

                            <br>

                            <small>
                                ${escapeHTML(
                                    user.year || "-"
                                )}
                            </small>

                        </td>


                        <td>
                            ${escapeHTML(
                                user.studentNames || "-"
                            )}
                        </td>


                        <td>

                            <button
                                type="button"
                                onclick="editBestUser('${escapeHTML(
                                    user.id || ""
                                )}')"
                            >
                                ✏️ Edit
                            </button>


                            <button
                                type="button"
                                onclick="deleteBestUser('${escapeHTML(
                                    user.id || ""
                                )}')"
                            >
                                🗑 Delete
                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        html += `

                    </tbody>

                </table>

            </div>

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



// =====================================================
// OPEN ADD BEST USER FORM
// =====================================================

function openBestUserForm(){

    const modal =
        document.getElementById(
            "bestUserModal"
        );


    const form =
        document.getElementById(
            "bestUserForm"
        );


    if(form){

        form.reset();

    }


    const id =
        document.getElementById(
            "bestUserId"
        );


    if(id){

        id.value = "";

    }


    const title =
        document.getElementById(
            "bestUserModalTitle"
        );


    if(title){

        title.textContent =
            "➕ Add Best User";

    }


    const button =
        document.getElementById(
            "bestUserSaveBtn"
        );


    if(button){

        button.textContent =
            "💾 Save Best User";

    }


    const msg =
        document.getElementById(
            "bestUserFormMsg"
        );


    if(msg){

        msg.textContent = "";

    }


    if(modal){

        modal.classList.remove(
            "hidden"
        );

    }

}



// =====================================================
// CLOSE BEST USER FORM
// =====================================================

function closeBestUserForm(){

    const modal =
        document.getElementById(
            "bestUserModal"
        );


    if(modal){

        modal.classList.add(
            "hidden"
        );

    }

}



// =====================================================
// EDIT BEST USER
// =====================================================

function editBestUser(id){

    const user =
        bestUsersData.find(
            function(item){

                return String(item.id) ===
                       String(id);

            }
        );


    if(!user){

        alert(
            "Best User not found."
        );

        return;

    }


    const modal =
        document.getElementById(
            "bestUserModal"
        );


    const idInput =
        document.getElementById(
            "bestUserId"
        );


    const departmentInput =
        document.getElementById(
            "bestUserDepartment"
        );


    const yearInput =
        document.getElementById(
            "bestUserYear"
        );


    const namesInput =
        document.getElementById(
            "bestUserNames"
        );


    if(idInput){

        idInput.value =
            user.id || "";

    }


    if(departmentInput){

        departmentInput.value =
            user.department || "";

    }


    if(yearInput){

        yearInput.value =
            user.year || "";

    }


    if(namesInput){

        namesInput.value =
            user.studentNames || "";

    }


    const title =
        document.getElementById(
            "bestUserModalTitle"
        );


    if(title){

        title.textContent =
            "✏️ Edit Best User";

    }


    const button =
        document.getElementById(
            "bestUserSaveBtn"
        );


    if(button){

        button.textContent =
            "💾 Update Best User";

    }


    const msg =
        document.getElementById(
            "bestUserFormMsg"
        );


    if(msg){

        msg.textContent = "";

    }


    if(modal){

        modal.classList.remove(
            "hidden"
        );

    }

}



// =====================================================
// SAVE / UPDATE BEST USER
// =====================================================

async function saveBestUser(){

    const id =
        document.getElementById(
            "bestUserId"
        )?.value.trim() || "";


    const department =
        document.getElementById(
            "bestUserDepartment"
        )?.value.trim() || "";


    const year =
        document.getElementById(
            "bestUserYear"
        )?.value.trim() || "";


    const studentNames =
        document.getElementById(
            "bestUserNames"
        )?.value.trim() || "";


    const msg =
        document.getElementById(
            "bestUserFormMsg"
        );


    if(!department){

        if(msg){

            msg.textContent =
                "Please select Department.";

        }

        return;

    }


    if(!year){

        if(msg){

            msg.textContent =
                "Please select Year.";

        }

        return;

    }


    if(!studentNames){

        if(msg){

            msg.textContent =
                "Please enter Student Names.";

        }

        return;

    }


    const button =
        document.getElementById(
            "bestUserSaveBtn"
        );


    if(button){

        button.disabled =
            true;

        button.textContent =
            id
            ? "Updating..."
            : "Saving...";

    }


    try{

        const payload = {

            action:
                id
                ? "updateBestUser"
                : "addBestUser",

            token:
                localStorage.getItem(
                    "token"
                ),

            department:
                department,

            year:
                year,

            studentNames:
                studentNames

        };


        if(id){

            payload.id =
                id;

        }


        const response =
            await fetch(API, {

                method:"POST",

                headers:{
                    "Content-Type":
                    "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(
                        payload
                    )

            });


        const data =
            await response.json();


        if(!data.ok){

            if(msg){

                msg.textContent =
                    data.error ||
                    "Operation failed.";

            }

            return;

        }


        if(msg){

            msg.textContent =
                id
                ? "✅ Best User updated successfully."
                : "✅ Best User added successfully.";

        }


        await loadBestUsers();


        setTimeout(
            function(){

                closeBestUserForm();

            },
            600
        );


    }
    catch(error){

        console.log(
            "SAVE BEST USER ERROR:",
            error
        );


        if(msg){

            msg.textContent =
                "Unable to save Best User.";

        }

    }
    finally{

        if(button){

            button.disabled =
                false;

            button.textContent =
                id
                ? "💾 Update Best User"
                : "💾 Save Best User";

        }

    }

}

// =====================================================
// BEST USER FORM SUBMIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const form =
            document.getElementById(
                "bestUserForm"
            );

        if(!form){
            return;
        }

        form.addEventListener(
            "submit",
            function(e){

                e.preventDefault();

                saveBestUser();

            }
        );

    }
);


// =====================================================
// DELETE BEST USER
// =====================================================

async function deleteBestUser(id){

    if(!id){

        alert(
            "Best User ID not found."
        );

        return;

    }


    const user =
        bestUsersData.find(
            function(item){

                return String(item.id) ===
                       String(id);

            }
        );


    const studentNames =
        user?.studentNames ||
        "this Best User";


    const confirmed =
        confirm(
            "Are you sure you want to delete " +
            studentNames +
            "?"
        );


    if(!confirmed){

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

                    action:
                        "deleteBestUser",

                    token:
                        localStorage.getItem(
                            "token"
                        ),

                    id:
                        id

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
            "✅ Best User deleted successfully."
        );


        await loadBestUsers();


    }
    catch(error){

        console.log(
            "DELETE BEST USER ERROR:",
            error
        );


        alert(
            "Unable to delete Best User."
        );

    }

}
