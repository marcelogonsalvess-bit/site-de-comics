// ============================
// EDITORAS
// ============================

document.addEventListener(
    "catalogoCarregado",
    () => {

        console.log("Evento catálogo recebido na página de editoras");

        carregarEditoras();


    }
);

// ============================
// CARREGAR EDITORAS
// ============================

function carregarEditoras(){


    const container = document.getElementById("listaEditoras");


    if(!container) return;



    container.innerHTML = "";

    // Conta HQs por editora

    catalogoEditoras.forEach(editora => {

        editora.hqs = catalogoHQs.filter(hq => 
            hq.editoraId === editora.id
        ).length;

    });

    catalogoEditoras.forEach(editora => {



        const card = document.createElement("a");

        card.className = "editora-card";

        card.href = `../editoras/${editora.id}.html`;



        card.innerHTML = `

            <div class="editora-logo">

                <img 
                    src="${editora.logo}"
                    alt="${editora.nome}"
                    onerror="this.style.display='none'"
                >

            </div>


            <div class="editora-info">


                <h2>
                    ${editora.nome}
                </h2>


                <span>
                    📚 ${editora.hqs} revistas
                </span>


            </div>

        `;



        container.appendChild(card);



    });


}