const API =
"https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let databases = [];



/* =========================
   LIBRARIAN CHECK
========================= */

function isLibrarian(){

    return (
        localStorage.getItem("role") ===
        "Librarian"
    );

}



/* =========================
   API POST
========================= */

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



/* =========================
   LOAD DATABASES
========================= */

async function loadDatabases(){

    const container =
        document.getElementById(
            "databaseList"
        );


    try{

        const result =
            await post({

                action: "list",

                token:
                    localStorage.getItem(
                        "token"
                    )

            });


        if(!result.success){

            container.innerHTML =
                "<p>Unable to load databases.</p>";

            return;

        }


        databases =
            (result.resources || [])
            .filter(function(resource){

                return resource.type ===
                    "Database";

            });


        displayDatabases();

    }

    catch(error){

        console.error(error);

        container.innerHTML =
            "<p>Error loading databases.</p>";

    }

}



/* =========================
   DISPLAY DATABASES
========================= */

function displayDatabases(list){

    const container =
        document.getElementById(
            "databaseList"
        );


    const data =
        list || databases;


    if(data.length === 0){

        container.innerHTML =
            "<p>No database resources found.</p>";

        return;

    }


    container.innerHTML =
        data.map(function(resource){

            return `

                <div class="resource-card">

                    <h3>
                        ${escapeHTML(
                            resource.title || "Untitled"
                        )}
                    </h3>


                    <p>
                        <strong>Department:</strong>
                        ${escapeHTML(
                            resource.department || "-"
                        )}
                    </p>


                    <p>
                        <strong>Year:</strong>
                        ${escapeHTML(
                            resource.year || "-"
                        )}
                    </p>


                    <p>
                        <strong>Subject:</strong>
                        ${escapeHTML(
                            resource.subject || "-"
                        )}
                    </p>


                    <div class="resource-actions">

                        <a
                            href="${resource.fileUrl || resource.url || "#"}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            📄 Open PDF
                        </a>


                        ${
                            isLibrarian()

                            ?

                            `

                            <button
                                onclick="editDatabase('${resource.id}')"
                            >
                                ✏️ Edit
                            </button>


                            <button
                                onclick="deleteDatabase('${resource.id}')"
                            >
                                🗑️ Delete
                            </button>

                            `

                            :

                            ""

                        }

                    </div>

                </div>

            `;

        })
        .join("");

}



/* =========================
   SEARCH DATABASES
========================= */

function searchDatabases(){

    const searchInput =
        document.getElementById(
            "searchDatabase"
        );


    const query =
        searchInput.value
        .toLowerCase()
        .trim();


    if(!query){

        displayDatabases();

        return;

    }


    const filtered =
        databases.filter(function(resource){

            const text = [

                resource.title,
                resource.subject,
                resource.department,
                resource.year,
                resource.semester

            ]
            .join(" ")
            .toLowerCase();


            return text.includes(query);

        });


    displayDatabases(filtered);

}



/* =========================
   UPLOAD DATABASE
========================= */

async function uploadDatabase(){

    if(!isLibrarian()){

        alert(
            "Only Librarian can upload resources."
        );

        return;

    }


    const title =
        document.getElementById(
            "databaseTitle"
        ).value.trim();


    const subject =
        document.getElementById(
            "databaseSubject"
        ).value.trim();


    const department =
        document.getElementById(
            "databaseDepartment"
        ).value.trim();


    const year =
        document.getElementById(
            "databaseYear"
        ).value.trim();


    const file =
        document.getElementById(
            "databaseFile"
        ).files[0];


    if(!title){

        alert(
            "Please enter database title."
        );

        return;

    }


    if(!file){

        alert(
            "Please select a PDF file."
        );

        return;

    }


    if(
        file.type !==
        "application/pdf"
    ){

        alert(
            "Only PDF files are allowed."
        );

        return;

    }


    try{

        const base64 =
            await fileToBase64(file);


        const result =
            await post({

                action: "add",

                token:
                    localStorage.getItem(
                        "token"
                    ),

                title: title,

                type: "Database",

                subject: subject,

                department: department,

                year: year,

                fileName: file.name,

                fileData: base64

            });


        if(result.success){

            alert(
                "Database resource uploaded successfully."
            );


            document.getElementById(
                "databaseTitle"
            ).value = "";


            document.getElementById(
                "databaseSubject"
            ).value = "";


            document.getElementById(
                "databaseDepartment"
            ).value = "";


            document.getElementById(
                "databaseYear"
            ).value = "";


            document.getElementById(
                "databaseFile"
            ).value = "";


            loadDatabases();

        }

        else{

            alert(
                result.error ||
                "Upload failed."
            );

        }

    }

    catch(error){

        console.error(error);

        alert(
            "Error uploading database resource."
        );

    }

}



/* =========================
   FILE TO BASE64
========================= */

function fileToBase64(file){

    return new Promise(function(
        resolve,
        reject
    ){

        const reader =
            new FileReader();


        reader.onload =
            function(){

                const result =
                    reader.result;


                const base64 =
                    result.split(",")[1];


                resolve(base64);

            };


        reader.onerror =
            function(){

                reject(
                    new Error(
                        "File reading failed"
                    )
                );

            };


        reader.readAsDataURL(file);

    });

}



/* =========================
   DELETE DATABASE
========================= */

async function deleteDatabase(id){

    if(!isLibrarian()){

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this database resource?"
        );


    if(!confirmDelete){

        return;

    }


    try{

        const result =
            await post({

                action: "delete",

                token:
                    localStorage.getItem(
                        "token"
                    ),

                id: id

            });


        if(result.success){

            alert(
                "Database resource deleted."
            );

            loadDatabases();

        }

        else{

            alert(
                result.error ||
                "Delete failed."
            );

        }

    }

    catch(error){

        console.error(error);

        alert(
            "Error deleting resource."
        );

    }

}



/* =========================
   EDIT DATABASE
========================= */

function editDatabase(id){

    if(!isLibrarian()){

        return;

    }


    const resource =
        databases.find(function(item){

            return String(item.id) ===
                String(id);

        });


    if(!resource){

        alert(
            "Database resource not found."
        );

        return;

    }


    document.getElementById(
        "databaseTitle"
    ).value =
        resource.title || "";


    document.getElementById(
        "databaseSubject"
    ).value =
        resource.subject || "";


    document.getElementById(
        "databaseDepartment"
    ).value =
        resource.department || "";


    document.getElementById(
        "databaseYear"
    ).value =
        resource.year || "";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    alert(
        "Details loaded. Please upload the updated PDF to replace the resource."
    );

}



/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value){

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadDatabases();

    }
);
