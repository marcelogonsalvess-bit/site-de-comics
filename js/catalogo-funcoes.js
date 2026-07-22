// ============================
// FUNÇÕES DOS CATÁLOGOS
// ============================


function buscarHQ(id){

    return catalogoHQs.find(

        hq => hq.id === id

    );

}



function buscarColecao(id){

    return catalogoColecoes.find(

        colecao => colecao.id === id

    );

}



function buscarEditora(id){

    return catalogoEditoras.find(

        editora => editora.id === id

    );

}



// ============================
// REGISTRAR ACESSO DA HQ
// ============================

function registrarAcesso(idHQ){

    let acessosSalvos =
        JSON.parse(
            localStorage.getItem("acessosHQ")
        ) || {};


    if(!acessosSalvos[idHQ]){

        acessosSalvos[idHQ] = 0;

    }


    acessosSalvos[idHQ]++;


    localStorage.setItem(
        "acessosHQ",
        JSON.stringify(acessosSalvos)
    );

}