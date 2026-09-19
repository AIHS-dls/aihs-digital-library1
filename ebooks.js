const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";


let ebooks=[];


// ===============================
// CHECK LIBRARIAN
// ===============================

function isLibrarian(){

    return localStorage.getItem("role") === "Librarian";

}



// ===============================
// LOAD E-BOOKS
// ===============================

async function loadEbooks(){

    try{

        let response = await fetch(API,{

            method:"POST",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },

            body:JSON.stringify({

                action:"list",

                token:localStorage.getItem("token")

            })

        });


        let data=await response.json();


        if(data.ok){

            ebooks=(data.resources || []).filter(function(r){

                return r.type=="E-book";

            });


            displayEbooks();

        }

        else{

            document.getElementById("ebookList").innerHTML =
                data.error || "Unable to load E-Books";

        }

    }

    catch(error){

        console.log(error);

        document.getElementById("ebookList").innerHTML =
            "Unable to load E-Books";

    }

}



// ===============================
// DISPLAY E-BOOKS
// ===============================

function displayEbooks(list=ebooks){

    let box=document.getElementById("ebookList");


    if(list.length===0){

        box.innerHTML=
            "No E-Books Found";

        return;

    }


    box.innerHTML=list.map(function(r){

        let adminButtons="";


        // ===============================
        // LIBRARIAN ONLY
        // ===============================

        if(isLibrarian()){

            adminButtons=`

                <br><br>

                <button
                onclick="editEbook('${r.id}')">

                ✏ Edit

                </button>


                <button
                onclick="deleteEbook('${r.id}')"
                style="background:#c62828;color:white">

                🗑 Delete

                </button>

            `;

        }


        return `

        <div class="card">

            <h3>
                📘 ${r.title}
            </h3>


            <p>
                Department : ${r.department || "-"}
            </p>


            <p>
                Year : ${r.year || "-"}
            </p>


            <p>
                Subject : ${r.subject || "-"}
            </p>


            <a
            href="${r.url}"
            target="_blank">

                📖 Open PDF

            </a>


            ${adminButtons}

        </div>

        `;

    }).join("");

}



// ===============================
// SEARCH
// ===============================

function searchBooks(){

    let value=document
        .getElementById("searchBook")
        .value
        .toLowerCase();


    let result=ebooks.filter(function(r){

        return (

            (r.title || "")
            .toLowerCase()
            .includes(value)

        );

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


    let file=document
        .getElementById("file")
        .files[0];


    if(!file){

        alert("Select PDF File");

        return;

    }


    document.getElementById("msg").innerHTML=
        "Uploading...";


    let reader=new FileReader();


    reader.onload=async function(){

        try{

            let base64=
                reader.result.split(",")[1];


            let response=await fetch(API,{

                method:"POST",

                headers:{
                    "Content-Type":"text/plain;charset=utf-8"
                },


                body:JSON.stringify({

                    action:"add",

                    token:localStorage.getItem("token"),

                    title:
                    document.getElementById("title").value.trim(),

                    type:"E-book",

                    department:
                    document.getElementById("department").value,

                    year:
                    document.getElementById("year").value,

                    subject:
                    document.getElementById("subject").value.trim(),

                    fileName:file.name,

                    mimeType:file.type,

                    data:base64

                })

            });


            let data=await response.json();


            if(data.ok){

                document.getElementById("msg").innerHTML=
                    "✅ E-Book Uploaded Successfully";


                document.getElementById("title").value="";

                document.getElementById("subject").value="";

                document.getElementById("file").value="";


                loadEbooks();

            }

            else{

                document.getElementById("msg").innerHTML=
                    "❌ "+data.error;

            }

        }

        catch(error){

            console.log(error);

            document.getElementById("msg").innerHTML=
                "❌ Upload Error";

        }

    };


    reader.readAsDataURL(file);

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


    if(!confirm("Delete this E-Book?")){

        return;

    }


    try{

        let response=await fetch(API,{

            method:"POST",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },


            body:JSON.stringify({

                action:"delete",

                id:id,

                token:localStorage.getItem("token")

            })

        });


        let data=await response.json();


        if(data.ok){

            alert("✅ Deleted");

            loadEbooks();

        }

        else{

            alert(data.error);

        }

    }

    catch(error){

        console.log(error);

        alert("Delete Error");

    }

}



// ===============================
// EDIT E-BOOK
// LIBRARIAN ONLY
// ===============================

function editEbook(id){


    if(!isLibrarian()){

        alert(
            "Access Denied\n\nOnly Librarian can edit E-Books."
        );

        return;

    }


    let book=ebooks.find(function(r){

        return r.id==id;

    });


    if(!book){

        return;

    }


    document.getElementById("title").value=
        book.title;


    document.getElementById("subject").value=
        book.subject;


    document.getElementById("department").value=
        book.department;


    document.getElementById("year").value=
        book.year;


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });


    alert(
        "Edit details and upload new PDF"
    );

}



// ===============================
// BACK
// ===============================

function backCollections(){

    let role=
        localStorage.getItem("role");


    if(role==="Librarian"){

        window.location.href=
            "administration.html";

    }

    else{

        window.location.href=
            "index.html";

    }

}



// ===============================
// PAGE LOAD
// ===============================

window.onload=function(){

    loadEbooks();

};
