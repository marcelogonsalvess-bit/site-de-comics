// ============================
// BOTÃO DE FAVORITO
// ============================

function configurarFavorito(idHQ, botao, tituloDaHQ){


    // Estado inicial

    if(Favoritos.verificar(idHQ)){

        botao.textContent = "♥";

        botao.title = "Remover dos favoritos";

    }else{

        botao.textContent = "♡";

        botao.title = "Adicionar aos favoritos";

    }



    botao.addEventListener("click", () => {


        if(!Auth.isLogged()){

            alert("Faça login para adicionar favoritos.");

            return;

        }



        if(Favoritos.verificar(idHQ)){


            Favoritos.remover(
                idHQ,
                tituloDaHQ
            );


            botao.textContent = "♡";

            botao.title = "Adicionar aos favoritos";


        }else{


            Favoritos.adicionar(
                idHQ,
                tituloDaHQ
            );


            botao.textContent = "♥";

            botao.title = "Remover dos favoritos";


        }


    });


}