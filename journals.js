<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>AIHS Journal Collection</title>

    <link rel="stylesheet" href="styles.css">
</head>

<body>

<header class="topbar">

    <div class="brand">
        <img src="logo.jpg" alt="AIHS Logo">
        <span>AIHS Digital Library</span>
    </div>

    <div class="header-right">

        <span id="userInfo">
            User
        </span>

        <button onclick="backToDashboard()">
            ⬅ Back
        </button>

        <button onclick="logoutUser()">
            Logout
        </button>

    </div>

</header>


<main class="container">

    <!-- HERO -->

    <section class="hero">

        <h1>📖 Journal Collection</h1>

        <p>
            Access important physiotherapy and academic journals.
        </p>

    </section>


    <!-- SEARCH -->

    <section class="card">

        <h2>🔎 Search Journals</h2>

        <input
            type="text"
            id="searchJournal"
            placeholder="Search Journal Title..."
            oninput="searchJournals()"
        >

    </section>


    <!-- JOURNAL LIST -->

    <section class="card">

        <h2>📚 Available Journals</h2>

        <div class="table-container">

            <table class="resource-table">

                <thead>

                    <tr>

                        <th>SL</th>

                        <th>Journal Titles</th>

                        <th>Website Link</th>

                    </tr>

                </thead>

                <tbody id="journalList">

                    <tr>

                        <td colspan="3">
                            Loading journals...
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </section>

</main>


<script src="journals.js"></script>


<script>

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const user =
            localStorage.getItem("user");

        const role =
            localStorage.getItem("role");


        const userInfo =
            document.getElementById(
                "userInfo"
            );


        if(user){

            userInfo.textContent =
                user + " • " + (role || "");

        }
        else{

            userInfo.textContent =
                "Guest";

        }

    }
);


function backToDashboard(){

    const role =
        localStorage.getItem("role");


    if(role === "Librarian"){

        window.location.href =
            "administration.html";

    }

    else if(
        role === "Student" ||
        role === "Staff"
    ){

        window.location.href =
            "index.html?dashboard=1";

    }

    else{

        window.location.href =
            "index.html";

    }

}


function logoutUser(){

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    localStorage.removeItem("role");


    window.location.href =
        "index.html";

}

</script>

</body>

</html>
