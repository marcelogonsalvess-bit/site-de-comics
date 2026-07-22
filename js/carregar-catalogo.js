// ============================
// CARREGADOR DE DADOS JSON
// ============================


let catalogoHQs = [];

let catalogoColecoes = [];

let catalogoEditoras = [];



// ============================
// CARREGAR HQS
// ============================

fetch("/dados/hqs.json")

.then(resposta => resposta.json())

.then(dados => {


    catalogoHQs = dados;


    console.log(
        "HQs carregadas:",
        catalogoHQs
    );


    carregarColecoes();


})

.catch(erro => {


    console.error(
        "Erro ao carregar HQs:",
        erro
    );


});




// ============================
// CARREGAR COLEÇÕES
// ============================


function carregarColecoes(){


    fetch("/dados/colecoes.json")


    .then(resposta => resposta.json())


    .then(dados => {


        catalogoColecoes = dados;


        console.log(
            "Coleções carregadas:",
            catalogoColecoes
        );


        carregarEditoras();

            })


    .catch(erro => {


        console.error(
            "Erro ao carregar coleções:",
            erro
        );


    });
            
// ============================
// CARREGAR EDITORAS
// ============================

function carregarEditoras(){


    fetch("/dados/editoras.json")


    .then(resposta => resposta.json())


    .then(dados => {


        catalogoEditoras = dados;


        console.log(
            "Editoras carregadas:",
            catalogoEditoras
        );


        document.dispatchEvent(
            new Event("catalogoCarregado")
        );


    })


    .catch(erro => {


        console.error(
            "Erro ao carregar editoras:",
            erro
        );


    });

}

}