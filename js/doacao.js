// ============================
// MODAL DE DOAÇÃO
// ============================


function iniciarDoacao(){



    const openDonation =
        document.getElementById(
            "openDonation"
        );


    const donationModal =
        document.getElementById(
            "donationModal"
        );


    const closeDonation =
        document.getElementById(
            "closeDonation"
        );


    const copyPix =
        document.getElementById(
            "copyPix"
        );


    const pixKey =
        document.getElementById(
            "pixKey"
        );




    if(
        !openDonation ||
        !donationModal ||
        !closeDonation
    ){

        console.log(
            "Elementos da doação ainda não encontrados"
        );

        return;

    }



    console.log(
        "Modal de doação conectado"
    );




    // ============================
    // ABRIR MODAL
    // ============================


    openDonation.addEventListener(
        "click",
        () => {

            donationModal.classList.add(
                "active"
            );

        }
    );




    // ============================
    // FECHAR PELO X
    // ============================


    closeDonation.addEventListener(
        "click",
        () => {

            donationModal.classList.remove(
                "active"
            );

        }
    );




    // ============================
    // FECHAR CLICANDO FORA
    // ============================


    donationModal.addEventListener(
        "click",
        (e) => {

            if(
                e.target === donationModal
            ){

                donationModal.classList.remove(
                    "active"
                );

            }

        }
    );




    // ============================
    // COPIAR CHAVE PIX
    // ============================


    if(
        copyPix &&
        pixKey
    ){


        copyPix.addEventListener(
            "click",
            async () => {


                try{


                    await navigator.clipboard.writeText(
                        pixKey.textContent.trim()
                    );


                    copyPix.textContent =
                        "✅ Chave copiada!";



                    setTimeout(
                        () => {

                            copyPix.textContent =
                                "📋 Copiar chave Pix";

                        },
                        2000
                    );


                }

                catch(error){


                    console.error(
                        "Erro ao copiar chave Pix:",
                        error
                    );


                }


            }
        );


    }



}




// ============================
// ESPERA COMPONENTES
// ============================


document.addEventListener(
    "componentesCarregados",
    iniciarDoacao
);




// ============================
// FALLBACK
// ============================


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            iniciarDoacao,
            1000
        );

    }
);