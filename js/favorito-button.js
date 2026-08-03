// ============================
// BOTÃO DE FAVORITO
// ============================

async function configurarFavorito(idHQ, botao, tituloDaHQ){
    console.log("configurarFavorito ativo", botao); 

    // Estado inicial

    const favorito =
        await Favoritos.verificar(idHQ);


        if(favorito){

            botao.innerHTML = '<i class="fa-solid fa-heart"></i>';

            botao.title = "Remover dos favoritos";

        }else{

            botao.innerHTML = '<i class="fa-regular fa-heart"></i>';

            botao.title = "Adicionar aos favoritos";

        }



    botao.addEventListener("click", async (e) => {

        e.preventDefault();

        if(!(await Auth.isLogged())){

            alert("Faça login para adicionar favoritos.");

            botao.innerHTML =
                '<i class="fa-regular fa-heart"></i>';

            return;

        }




const favorito =
    await Favoritos.verificar(idHQ);

        if(favorito){


            Favoritos.remover(
                idHQ,
                tituloDaHQ
            );


            botao.innerHTML = '<i class="fa-regular fa-heart"></i>';

            botao.title = "Adicionar aos favoritos";


        }else{


            Favoritos.adicionar(
                idHQ,
                tituloDaHQ
            );


            botao.innerHTML = '<i class="fa-solid fa-heart"></i>';

            botao.title = "Remover dos favoritos";


        }


    });


}