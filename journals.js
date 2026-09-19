/* =========================================
   JOURNAL COLLECTION
========================================= */


const journals = [

    {
        title:
            "The International Journal of Physiotherapy",

        url:
            "https://ijphy.com/index.php/journal"
    },


    {
        title:
            "Journal of Physiotherapy",

        url:
            "https://www.journalofphysiotherapy.com/"
    },


    {
        title:
            "Journal of Physical Therapy Science",

        url:
            "https://www.jstage.jst.go.jp/browse/jpts"
    },


    {
        title:
            "Physiotherapy Theory and Practice",

        url:
            "https://www.tandfonline.com/journals/iptp20"
    },


    {
        title:
            "Musculoskeletal Science and Practice",

        url:
            "https://www.sciencedirect.com/journal/musculoskeletal-science-and-practice"
    },


    {
        title:
            "Physical Therapy & Rehabilitation Journal",

        url:
            "https://academic.oup.com/ptj"
    }

];



/* =========================================
   DISPLAY JOURNALS
========================================= */

function displayJournals(list){

    const tableBody =
        document.getElementById(
            "journalList"
        );


    if(!list || list.length === 0){

        tableBody.innerHTML = `

            <tr>

                <td colspan="3">
                    No journals found.
                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML =
        list.map(function(journal, index){

            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>
                        ${escapeHTML(
                            journal.title
                        )}
                    </td>


                    <td>

                        <a
                            href="${journal.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="website-link"
                        >
                            📖 Open Website
                        </a>

                    </td>

                </tr>

            `;

        }).join("");

}



/* =========================================
   SEARCH JOURNALS
========================================= */

function searchJournals(){

    const input =
        document.getElementById(
            "searchJournal"
        );


    const query =
        input.value
        .toLowerCase()
        .trim();


    if(!query){

        displayJournals(
            journals
        );

        return;

    }


    const filtered =
        journals.filter(
            function(journal){

                return journal.title
                    .toLowerCase()
                    .includes(query);

            }
        );


    displayJournals(
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

        displayJournals(
            journals
        );

    }
);
