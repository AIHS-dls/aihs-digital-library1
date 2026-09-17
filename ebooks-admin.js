// =====================================
// AIHS DIGITAL LIBRARY
// E-BOOK ADMINISTRATION
// =====================================


const API = "https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let resources = [];

let uploading = false;


// =====================================
// LOAD E-BOOKS
// =====================================

async function loadEbooks() {

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify({

                action: "list",

                token: localStorage.getItem("token")

            })

        });


        const data = await response.json();


        if (!data.ok) {

            document.getElementById("resourceList").innerHTML =
                "❌ " + (data.error || "Unable to load E-Books");

            return;

        }


        resources = data.resources.filter(function (r) {

            return r.type === "E-book";

        });


        displayEbooks();


    }

    catch (error) {

        console.log(error);

        document.getElementById("resourceList").innerHTML =
            "❌ Error loading E-Books";

    }

}


// =====================================
// DISPLAY E-BOOKS
// =====================================

function displayEbooks() {

    const box = document.getElementById("resourceList");


    if (resources.length === 0) {

        box.innerHTML = "No E-Books Found";

        return;

    }


    box.innerHTML = resources.map(function (r) {

        return `

        <div class="card">

            <h3>
                📘 ${r.title}
            </h3>

            <p>
                Type: ${r.type}
            </p>

            <p>
                Department: ${r.department || "-"}
            </p>

            <p>
                Year: ${r.year || "-"}
            </p>

            <p>
                Subject: ${r.subject || "-"}
            </p>

            <a href="${r.url}" target="_blank">
                📖 Open E-Book
            </a>

            <br><br>

            <button onclick="editEbook('${r.id}')">
                ✏ Edit
            </button>

            <button
                onclick="deleteEbook('${r.id}')"
                style="background:#c62828;color:white"
            >
                🗑 Delete
            </button>

        </div>

        `;

    }).join("");

}


// =====================================
// DELETE E-BOOK
// =====================================

async function deleteEbook(id) {

    if (!confirm("Delete this E-Book?")) {

        return;

    }


    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify({

                action: "delete",

                id: id,

                token: localStorage.getItem("token")

            })

        });


        const data = await response.json();


        if (data.ok) {

            alert("✅ E-Book Deleted");

            await loadEbooks();

        }

        else {

            alert("❌ " + (data.error || "Delete failed"));

        }

    }

    catch (error) {

        console.log(error);

        alert("❌ Delete Error");

    }

}


// =====================================
// EDIT E-BOOK
// =====================================

function editEbook(id) {

    const resource = resources.find(function (r) {

        return r.id == id;

    });


    if (!resource) {

        return;

    }


    document.getElementById("title").value =
        resource.title || "";


    document.getElementById("department").value =
        resource.department || "";


    document.getElementById("year").value =
        resource.year || "";


    document.getElementById("subject").value =
        resource.subject || "";


    alert(
        "Edit the details and select a new PDF, then upload."
    );

}


// =====================================
// UPLOAD E-BOOK
// =====================================

async function uploadEbook() {

    if (uploading) {

        alert("Upload already in progress...");

        return;

    }


    const file =
        document.getElementById("file").files[0];


    if (!file) {

        alert("Please select a PDF file.");

        return;

    }


    const title =
        document.getElementById("title").value.trim();


    if (!title) {

        alert("Please enter E-Book title.");

        return;

    }


    uploading = true;


    const button =
        document.querySelector(".upload-btn");


    button.disabled = true;

    button.innerHTML = "⏳ Uploading...";


    document.getElementById("msg").innerHTML =
        "⏳ Uploading E-Book...";


    try {

        const base64 = await new Promise(function (
            resolve,
            reject
        ) {

            const reader = new FileReader();


            reader.onload = function () {

                resolve(
                    reader.result.split(",")[1]
                );

            };


            reader.onerror = reject;


            reader.readAsDataURL(file);

        });


        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify({

                action: "add",

                token: localStorage.getItem("token"),

                title: title,

                type: "E-book",

                department:
                    document.getElementById("department").value,

                year:
                    document.getElementById("year").value,

                subject:
                    document.getElementById("subject").value.trim(),

                fileName: file.name,

                mimeType: file.type,

                data: base64

            })

        });


        const data = await response.json();


        if (data.ok) {

            document.getElementById("msg").innerHTML =
                "✅ E-Book Uploaded Successfully";


            document.getElementById("title").value = "";

            document.getElementById("department").value = "";

            document.getElementById("year").value = "";

            document.getElementById("subject").value = "";

            document.getElementById("file").value = "";


            await loadEbooks();

        }

        else {

            document.getElementById("msg").innerHTML =
                "❌ " + (data.error || "Upload failed");

        }

    }

    catch (error) {

        console.log(error);

        document.getElementById("msg").innerHTML =
            "❌ Upload Error";

    }


    finally {

        uploading = false;

        button.disabled = false;

        button.innerHTML = "📤 Upload E-Book";

    }

}


// =====================================
// BACK TO ADMINISTRATION
// =====================================

function backAdministration() {

    window.location.href = "administration.html";

}


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadEbooks();

    }
);
