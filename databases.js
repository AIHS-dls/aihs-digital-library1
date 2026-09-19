/* =========================================
   DATABASE COLLECTION
========================================= */


const databases = [

    {
        title:
            "PubMed",

        url:
            "https://pubmed.ncbi.nlm.nih.gov/"
    },


    {
        title:
            "PEDro – Physiotherapy Evidence Database",

        url:
            "https://pedro.org.au/"
    },


    {
        title:
            "Cochrane Library",

        url:
            "https://www.cochranelibrary.com/"
    },


    {
        title:
            "Google Scholar",

        url:
            "https://scholar.google.com/"
    },


    {
        title:
            "Directory of Open Access Journals (DOAJ)",

        url:
            "https://doaj.org/"
    },


    {
        title:
            "ScienceDirect",

        url:
            "https://www.sciencedirect.com/"
    },


    {
        title:
            "ResearchGate",

        url:
            "https://www.researchgate.net/"
    }

];



/* =========================================
   DISPLAY DATABASES
========================================= */

function displayDatabases(list){

    const tableBody =
        document.getElementById(
            "databaseList"
        );


    if(!list || list.length === 0){

        tableBody.innerHTML = `

            <tr>

                <td colspan="3">
                    No databases found.
                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML =
        list.map(function(database, index){

            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>
                        ${escapeHTML(
                            database.title
                        )}
                    </td>


                    <td>

                        <a
                            href="${database.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="website-link"
                        >
                            🌐 Open Website
                        </a>

                    </td>

                </tr>

            `;

        }).join("");

}



/* =========================================
   SEARCH DATABASES
========================================= */

function searchDatabases(){

    const input =
        document.getElementById(
            "searchDatabase"
        );


    const query =
        input.value
        .toLowerCase()
        .trim();


    if(!query){

        displayDatabases(
            databases
        );

        return;

    }


    const filtered =
        databases.filter(
            function(database){

                return database.title
                    .toLowerCase()
                    .includes(query);

            }
        );


    displayDatabases(
        filtered
    );

}



/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value){

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        displayDatabases(
            databases
        );

    }
);
