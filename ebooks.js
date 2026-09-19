const API =
"https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let ebooks = [];


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

    const response = await fetch(API, {

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
// LOAD E-BOOKS
// ===============================

async function loadEbooks(){

    const box =
        document.getElementById("ebookList");


    if(box){

        box.innerHTML =
            "Loading E-Books...";

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
                    "Unable to load E-Books";

            }

            return;

        }


        ebooks =
            (data.resources || [])
            .filter(function(resource){

                return (
                    resource.type === "E-book"
                );

            });


        displayEbooks();

    }
    catch(error){

        console.log(
            "E-BOOK LOAD ERROR:",
            error
        );


        if(box){

            box.innerHTML =
                "Unable to load E-Books";

        }

    }

}


// ===============================
// DISPLAY E-BOOKS
// ===============================

function displayEbooks(list = ebooks){

    const box =
        document.getElementById("ebookList");


    if(!box){

        return;

    }


    if(list.length === 0){

        box.innerHTML = `

            <div class="card">

                <h3>
                    📚 No E-Books Found
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


            /* ===============================
               LIBRARIAN CONTROLS
               =============================== */

            if(isLibrarian()){

                adminButtons = `

                    <div style="
                        margin-top:15px;
                    ">

                        <button
                            type="button"
                            onclick="editEbook('${resource.id}')"
                        >
                            ✏ Edit
                        </button>


                        <button
                            type="button"
                            onclick="deleteEbook('${resource.id}')"
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
                        📘 ${escapeHTML(
                            resource.title || "Untitled E-Book"
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
// SEARCH E-BOOKS
// ===============================

function searchBooks(){

    const input =
        document.getElementById("searchBook");


    if(!input){

        return;

    }


    const value =
        input.value
        .trim()
        .toLowerCase();


    if(!value){

        displayEbooks();

        return;

    }


    const result =
        ebooks.filter(function(resource){

            const searchableText = [

                resource.title,

                resource.subject,

                resource.department,

                resource.year,

                resource.semester

            ]
            .join(" ")
            .toLowerCase();


            return searchableText.includes(value);

        });


    displayEbooks(result);

}


// ===============================
// UPLOAD E-BOOK
// LIBRARIAN ONLY
// ===============================

async function uploadEbook(){

    if(!isLibrarian()){

        alert(
            "Access Denied\n\nOnly Librarian can upload E-Books."
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
            "Please enter Book Title."
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


    const message =
        document.getElementById("msg");


    message.innerHTML =
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

                type: "E-book",

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

            message.innerHTML =
                "✅ E-Book Uploaded Successfully";


            document
                .getElementById("title")
                .value = "";


            document
                .getElementById("subject")
                .value = "";


            document
                .getElementById("department")
                .value = "";


            document
                .getElementById("year")
                .value = "";


            document
                .getElementById("file")
                .value = "";


            await loadEbooks();

        }
        else{

            message.innerHTML =
                "❌ " +
                (
                    data.error ||
                    "Upload failed"
                );

        }

    }
    catch(error){

        console.log(
            "UPLOAD ERROR:",
            error
        );


        message.innerHTML =
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
                        String(
                            reader.result
                        );


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
// DELETE E-BOOK
// LIBRARIAN ONLY
// ===============================

async function deleteEbook(id){

    if(!isLibrarian()){

        alert(
            "Access Denied\n\nOnly Librarian can delete E-Books."
        );

        return;

    }


    if(
        !confirm(
            "Are you sure you want to delete this E-Book?"
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
                "✅ E-Book deleted successfully."
            );


            await loadEbooks();

        }
        else{

            alert(
                data.error ||
                "Delete failed"
            );

        }

    }
    catch(error){

        console.log(
            "DELETE ERROR:",
            error
        );


        alert(
            "Delete Error: " +
            error.message
        );

    }

}


// ===============================
// EDIT E-BOOK
// ===============================

function editEbook(id){

    if(!isLibrarian()){

        alert(
            "Access Denied\n\nOnly Librarian can edit E-Books."
        );

        return;

    }


    const book =
        ebooks.find(function(resource){

            return resource.id == id;

        });


    if(!book){

        alert(
            "E-Book not found."
        );

        return;

    }


    document.getElementById("title").value =
        book.title || "";


    document.getElementById("subject").value =
        book.subject || "";


    document.getElementById("department").value =
        book.department || "";


    document.getElementById("year").value =
        book.year || "";


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

        loadEbooks();

    }
);
