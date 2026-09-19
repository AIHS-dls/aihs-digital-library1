const API =
"https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let notes = [];


// ===============================
// CHECK LIBRARIAN
// ===============================

function isLibrarian(){

    return (
        localStorage.getItem("role") === "Librarian"
    );

}


// ===============================
// API CALL
// ===============================

async function post(data){

    const response =
        await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type":
                "text/plain;charset=utf-8"
            },

            body: JSON.stringify(data)

        });


    const text =
        await response.text();


    try{

        return JSON.parse(text);

    }
    catch(error){

        console.log(
            "SERVER RESPONSE:",
            text
        );

        throw new Error(
            "Invalid server response"
        );

    }

}


// ===============================
// LOAD NOTES
// ===============================

async function loadNotes(){

    const box =
        document.getElementById(
            "notesList"
        );


    if(box){

        box.innerHTML =
            "Loading Notes...";

    }


    try{

        const data =
            await post({

                action: "list",

                token:
                localStorage.getItem("token")

            });


        if(!data.ok){

            if(box){

                box.innerHTML =
                    data.error ||
                    "Unable to load Notes";

            }

            return;

        }


        notes =
            (data.resources || [])
            .filter(function(resource){

                return (
                    resource.type === "Notes"
                );

            });


        displayNotes();

    }
    catch(error){

        console.log(
            "NOTES LOAD ERROR:",
            error
        );


        if(box){

            box.innerHTML =
                "Unable to load Notes";

        }

    }

}


// ===============================
// DISPLAY NOTES
// ===============================

function displayNotes(list = notes){

    const box =
        document.getElementById(
            "notesList"
        );


    if(!box){

        return;

    }


    if(list.length === 0){

        box.innerHTML = `

            <div class="card">

                <h3>
                    📝 No Notes Found
                </h3>

                <p>
                    Try another search.
                </p>

            </div>

        `;

        return;

    }


    box.innerHTML =
        list.map(function(resource){

            let adminButtons = "";


            if(isLibrarian()){

                adminButtons = `

                    <div style="margin-top:15px;">

                        <button
                            type="button"
                            onclick="editNotes('${resource.id}')"
                        >
                            ✏ Edit
                        </button>


                        <button
                            type="button"
                            onclick="deleteNotes('${resource.id}')"
                            style="
                                background:#c62828;
                                color:white;
                            "
                        >
                            🗑 Delete
                        </button>

                    </div>

                `;

            }


            return `

                <div class="card">

                    <h3>
                        📝 ${escapeHTML(
                            resource.title ||
                            "Untitled Notes"
                        )}
                    </h3>


                    <p>
                        <b>Department:</b>
                        ${escapeHTML(
                            resource.department || "-"
                        )}
                    </p>


                    <p>
                        <b>Year:</b>
                        ${escapeHTML(
                            resource.year || "-"
                        )}
                    </p>


                    <p>
                        <b>Subject:</b>
                        ${escapeHTML(
                            resource.subject || "-"
                        )}
                    </p>


                    <a
                        href="${resource.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📖 Open PDF
                    </a>


                    ${adminButtons}

                </div>

            `;

        }).join("");

}


// ===============================
// SEARCH NOTES
// ===============================

function searchNotes(){

    const input =
        document.getElementById(
            "searchNotes"
        );


    if(!input){

        return;

    }


    const value =
        input.value
        .trim()
        .toLowerCase();


    if(!value){

        displayNotes();

        return;

    }


    const result =
        notes.filter(
            function(resource){

                const searchableText = [

                    resource.title,

                    resource.subject,

                    resource.department,

                    resource.year,

                    resource.semester

                ]
                .join(" ")
                .toLowerCase();


                return searchableText.includes(
                    value
                );

            }
        );


    displayNotes(result);

}


// ===============================
// UPLOAD NOTES
// ===============================

async function uploadNotes(){

    if(!isLibrarian()){

        alert(
            "Access Denied\n\nOnly Librarian can upload Notes."
        );

        return;

    }


    const title =
        document.getElementById("title")
        .value
        .trim();


    const subject =
        document.getElementById("subject")
        .value
        .trim();


    const department =
        document.getElementById("department")
        .value;


    const year =
        document.getElementById("year")
        .value;


    const file =
        document.getElementById("file")
        .files[0];


    if(!title){

        alert(
            "Please enter Notes Title."
        );

        return;

    }


    if(!file){

        alert(
            "Please select PDF File."
        );

        return;

    }


    if(
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ){

        alert(
            "Please select a PDF file only."
        );

        return;

    }


    document.getElementById("msg").innerHTML =
        "⏳ Uploading...";


    try{

        const base64 =
            await fileToBase64(file);


        const data =
            await post({

                action: "add",

                token:
                localStorage.getItem("token"),

                title: title,

                type: "Notes",

                department: department,

                year: year,

                subject: subject,

                fileName: file.name,

                mimeType:
                    file.type ||
                    "application/pdf",

                data: base64

            });


        if(data.ok){

            document.getElementById("msg").innerHTML =
                "✅ Notes Uploaded Successfully";


            document.getElementById("title").value =
                "";

            document.getElementById("subject").value =
                "";

            document.getElementById("department").value =
                "";

            document.getElementById("year").value =
                "";

            document.getElementById("file").value =
                "";


            await loadNotes();

        }
        else{

            document.getElementById("msg").innerHTML =
                "❌ " +
                (
                    data.error ||
                    "Upload failed"
                );

        }

    }
    catch(error){

        console.log(error);

        document.getElementById("msg").innerHTML =
            "❌ Upload Error: " +
            error.message;

    }

}


// ===============================
// FILE TO BASE64
// ===============================

function fileToBase64(file){

    return new Promise(
        function(resolve, reject){

            const reader =
                new FileReader();


            reader.onload =
                function(){

                    const result =
                        String(reader.result);


                    resolve(
                        result.split(",")[1]
                    );

                };


            reader.onerror =
                function(){

                    reject(
                        new Error(
                            "Could not read file"
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// ===============================
// DELETE NOTES
// ===============================

async function deleteNotes(id){

    if(!isLibrarian()){

        alert(
            "Access Denied\n\nOnly Librarian can delete Notes."
        );

        return;

    }


    if(
        !confirm(
            "Are you sure you want to delete these Notes?"
        )
    ){

        return;

    }


    try{

        const data =
            await post({

                action: "delete",

                id: id,

                token:
                localStorage.getItem("token")

            });


        if(data.ok){

            alert(
                "✅ Notes deleted successfully."
            );


            await loadNotes();

        }
        else{

            alert(
                data.error ||
                "Delete failed"
            );

        }

    }
    catch(error){

        console.log(error);

        alert(
            "Delete Error: " +
            error.message
        );

    }

}


// ===============================
// EDIT NOTES
// ===============================

function editNotes(id){

    if(!isLibrarian()){

        alert(
            "Access Denied\n\nOnly Librarian can edit Notes."
        );

        return;

    }


    const note =
        notes.find(
            function(resource){

                return resource.id == id;

            }
        );


    if(!note){

        alert(
            "Notes not found."
        );

        return;

    }


    document.getElementById("title").value =
        note.title || "";


    document.getElementById("subject").value =
        note.subject || "";


    document.getElementById("department").value =
        note.department || "";


    document.getElementById("year").value =
        note.year || "";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    alert(
        "Edit the details and upload the updated PDF."
    );

}


// ===============================
// SECURITY
// ===============================

function escapeHTML(value){

    return String(value || "")
        .replace(
            /[&<>"']/g,
            function(character){

                return {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#039;"

                }[character];

            }
        );

}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadNotes();

    }
);
