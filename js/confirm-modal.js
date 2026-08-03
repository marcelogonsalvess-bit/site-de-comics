// ==========================
// MODAL DE CONFIRMAÇÃO NOVO
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const modalConfirmacao = document.getElementById("confirmModal");

    if (modalConfirmacao) {
        document.body.appendChild(modalConfirmacao);
    }

});

let resolverConfirmacao = null;


function abrirConfirmacao(){

    return new Promise((resolve)=>{


        const modal =
        document.getElementById("confirmModal");

        console.log(modal);

        if(!modal){

            console.error(
                "Modal de confirmação não encontrado"
            );

            resolve(false);

            return;

        }


        resolverConfirmacao = resolve;

        const checkbox =
        document.getElementById("confirmarExclusaoCheck");

        if(checkbox){
            checkbox.checked = false;
        }


        modal.classList.add("ativo");


    });

}




function fecharConfirmacao(resultado){


    const modal =
    document.getElementById("confirmModal");


    if(modal){

        modal.classList.remove("ativo");

    }


    if(resolverConfirmacao){

        resolverConfirmacao(resultado);

        resolverConfirmacao = null;

    }


}




document.addEventListener("click", (e)=>{


    if(e.target.id === "confirmarExclusao"){

        fecharConfirmacao(true);

    }


    if(e.target.id === "cancelarExclusao"){

        fecharConfirmacao(false);

    }


});

document.addEventListener("change", (e)=>{

    if(e.target.id === "confirmarExclusaoCheck"){

        const botao =
        document.getElementById("confirmarExclusao");


        botao.disabled = !e.target.checked;

    }

});