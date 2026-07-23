// ============================
// RESULTADOS DA BUSCA
// ============================


document.addEventListener("catalogoCarregado", () => {


    const parametros = new URLSearchParams(
        window.location.search
    );


    const termo = parametros.get("q");


    const textoBusca = document.getElementById("textoBusca");


    const lista = document.getElementById("resultadoBusca");



    if(!termo || !lista) return;



    textoBusca.innerHTML = 
    `Resultados para: <strong>${termo}</strong>`;



    const busca = termo.toLowerCase();



    const resultadosTitulo = catalogoHQs.filter(hq => {


    const titulo = hq.titulo.toLowerCase();


    return titulo.includes(busca);


});



const resultadosDescricao = catalogoHQs.filter(hq => {


    const titulo = hq.titulo.toLowerCase();


    const descricao = (

        hq.descricaoCompleta ||

        hq.sinopse ||

        ""

    ).toLowerCase();



    return (

        !titulo.includes(busca)

        &&

        descricao.includes(busca)

    );


});



const resultados = [

    ...resultadosTitulo,

    ...resultadosDescricao

];


textoBusca.innerHTML += 
    `<br>Encontradas: <strong>${resultados.length} HQs</strong>`;



    if(resultados.length === 0){


        lista.innerHTML = 
            "<p>Nenhuma HQ encontrada.</p>";


        return;


    }

// ============================
// PAGINAÇÃO
// ============================


const resultadosPorPagina = 12;


let paginaAtual = 1;



function mostrarResultados(){


    lista.innerHTML = "";



    const inicio = 
        (paginaAtual - 1) * resultadosPorPagina;


    const fim = 
        inicio + resultadosPorPagina;



    const resultadosPagina = 
        resultados.slice(inicio, fim);



    resultadosPagina.forEach(hq => {


        lista.innerHTML += `


            <article class="comic-card">


                <a href="../${hq.pagina}">


                    <div class="comic-cover">


                        <img
                            src="${
                                hq.mostrarLogoCard && hq.capaCard
                                    ? hq.capaCard
                                    : hq.capa
                            }"
                            alt="${hq.titulo}"
                            loading="lazy">


                    </div>



                    <div class="comic-info">


                        <h3 class="comic-title">

                            ${hq.titulo}

                        </h3>


                        <p>

                            ${hq.editora || ""}

                        </p>


                        <p>

                            ${hq.ano || ""}

                        </p>


                        <p>

                            ${hq.categoria || ""}

                        </p>


                    </div>


                </a>


            </article>


        `;


    });



    criarPaginacao();


}




function criarPaginacao(){


    const paginacao = 
        document.getElementById("paginacaoBusca");



    if(!paginacao) return;



    paginacao.innerHTML = "";



    const totalPaginas = 
        Math.ceil(resultados.length / resultadosPorPagina);



    if(totalPaginas <= 1) return;



    if(paginaAtual > 1){

    paginacao.innerHTML += `

        <button onclick="irParaPagina(${paginaAtual - 1})">

            ← Anterior

        </button>

    `;

}



    for(let i = 1; i <= totalPaginas; i++){


        const ativo = 
            i === paginaAtual ? "active" : "";


        paginacao.innerHTML += `

            <button 
                class="${ativo}"
                onclick="irParaPagina(${i})">

                ${i}

            </button>

        `;


    }



    if(paginaAtual < totalPaginas){

        paginacao.innerHTML += `

            <button onclick="irParaPagina(${paginaAtual + 1})">

                Próximo →

            </button>

        `;

}


}



window.irParaPagina = function(numero){


    paginaAtual = numero;


    mostrarResultados();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

};



// inicia a primeira página

mostrarResultados();

    

});