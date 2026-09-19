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
