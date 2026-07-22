// ============================
// PÁGINA INDIVIDUAL DA COLEÇÃO
// ============================
// ============================
// FORMATAR STATUS
// ============================

function formatarStatus(status){

    const nomes = {

        "em-andamento": "Em andamento",

        "completa": "Completa",

        "pausada": "Pausada",

        "cancelada": "Cancelada",

        "abandonada": "Abandonada"

    };


    return nomes[status] || status;

}

document.addEventListener(
    "catalogoCarregado",
    () => {

    const slug = document.body.dataset.colecao;

    const colecao = catalogoColecoes.find(

        c => c.slug === slug

    );

    console.log("Coleção carregada:", colecao);



    if(!colecao) return;



    // ============================
    // BUSCAR HQS DA COLEÇÃO
    // ============================

    const hqs = catalogoHQs.filter(

        hq => hq.colecaoId === colecao.id

    );

    hqs.sort((a, b) => {

        return a.edicao - b.edicao;

    });

    const editora = catalogoEditoras.find(

        e => e.id === colecao.editoraId

    );


    console.log("HQs da coleção:", hqs);




    const dados = document.getElementById("dadosColecao");



    if(dados){

        dados.innerHTML = `


            <div 
                class="colecao-banner"
                style="background-image:url('${colecao.banner}')"
            >


                <div class="colecao-overlay"></div>

                <img
                    src="${colecao.imagem}"
                    alt="${colecao.nome}"
                    class="colecao-capa"
                >

                <div class="colecao-info">


                    <h1>
                        ${colecao.nome}
                    </h1>

                    <span class="colecao-editora">
                        ${editora ? editora.nome : ""}
                    </span>



                    <div class="colecao-meta">


                        <span>
                            📚 ${hqs.length} revista(s)
                        </span>



                        <span>
                            Status: ${formatarStatus(colecao.status)}
                        </span>


                    </div>




                    <p>
                        ${colecao.descricao}
                    </p>



                </div>


            </div>


        `;

    }




    const lista = document.getElementById("listaHQsColecao");



    if(!lista) return;



    hqs.forEach(hq => {



        lista.innerHTML += `


            <article class="colecao-hq-card">



                <a href="../${hq.pagina}">


                    <div class="colecao-hq-capa">

                        <img 
                        src="${hq.capa}"
                        alt="${hq.titulo}">


                        <div class="colecao-hq-overlay">

                            <h3>
                                ${hq.titulo}
                            </h3>

                        </div>

                    </div>



                </a>



            </article>



        `;



    });



});