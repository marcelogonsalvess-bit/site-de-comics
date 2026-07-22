// ============================
// PÁGINA DE COLEÇÕES
// ============================

function formatarStatus(status){

    const nomes = {

        "em-andamento": "Em andamento",

        "completa": "Completa",

        "cancelada": "Cancelada",

        "abandonada": "Abandonada",

        "pausada": "Pausada"

    };


    return nomes[status] || status;

}

function classeStatus(status){

    const classes = {

        "em-andamento": "status-andamento",

        "completa": "status-completa",

        "pausada": "status-pausada",

        "cancelada": "status-cancelada",

        "abandonada": "status-abandonada"

    };


    return classes[status] || "";

}


document.addEventListener(
    "catalogoCarregado",
    () => {


    const container = document.getElementById("listaColecoes");


    if(!container) return;



    container.innerHTML = "";



    catalogoColecoes.forEach(colecao => {



        const hqsDaColecao = catalogoHQs.filter(

            hq => hq.colecaoId === colecao.id

        );



        const primeiraHQ = hqsDaColecao[0];



        const card = document.createElement("a");


        card.className = "colecao-card";


        card.href = `../colecoes/${colecao.slug}.html`;


        card.innerHTML = `

            <div class="colecao-card-capa">

                <img
                    src="${primeiraHQ ? primeiraHQ.capa : colecao.imagem}"
                    alt="${colecao.nome}"
                >

                <div class="colecao-overlay">

                    <h3>
                        ${colecao.nome}
                    </h3>

                    <p>
                        📚 ${hqsDaColecao.length} revistas
                    </p>

                </div>


                <span class="colecao-status ${classeStatus(colecao.status)}">

                    ${formatarStatus(colecao.status)}

                </span>

            </div>

        `;



        container.appendChild(card);



    });



});