// ============================
// CARREGADOR DE DADOS JSON
// ============================


let catalogoHQs = [];

let catalogoColecoes = [];

let catalogoEditoras = [];



// ============================
// CARREGAR HQS
// ============================


async function carregarHQs(){

    const { data, error } = await supabaseClient
    .from("hqs")
    .select("*");


    if(error){

        console.error(
            "Erro ao carregar HQs:",
            error
        );

        return;

    }


    catalogoHQs = data;


    console.log(
        "HQs carregadas do Supabase:",
        catalogoHQs
    );


    carregarColecoes();

}


carregarHQs();


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