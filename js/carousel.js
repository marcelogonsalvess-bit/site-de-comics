// ============================
// CARROSSEL - FUNDAÇÃO COMICS
// ETAPA 1
// Últimas Adições (desktop)
// ============================


function iniciarCarrosseis(){


    const carrosseis =
        document.querySelectorAll(".latest-section .carousel-container, .top10-section .carousel-container");


    carrosseis.forEach(carrossel => {


        const track =
            carrossel.querySelector(".carousel-track");


        const cards =
            track.querySelectorAll(".comic-card");


        const btnPrev =
            carrossel.querySelector(".carousel-btn.prev");


        const btnNext =
            carrossel.querySelector(".carousel-btn.next");



        if(!track || cards.length === 0)
            return;



        let paginaAtual = 0;



        // ============================
        // QUANTIDADE VISÍVEL
        // ============================


        function quantidadeVisivel(){


            // MOBILE

            if(window.innerWidth <= 768){


                if(
                    carrossel.closest(".top10-section")
                ){

                    return 2;

                }


                return 1;

            }



            // DESKTOP

            if(
                carrossel.closest(".top10-section")
            ){

                return 5;

            }



            return 3;

        }



        // ============================
        // LARGURA DO MOVIMENTO
        // ============================


        function larguraCard(){


            const card =
                cards[0];


            const estilo =
                window.getComputedStyle(track);


            const gap =
                parseFloat(estilo.gap) || 0;


            return card.offsetWidth + gap;

        }



        // ============================
        // TOTAL DE PÁGINAS
        // ============================


        function totalPaginas(){


            const visiveis =
                quantidadeVisivel();


            return Math.max(

                1,

                Math.ceil(

                    cards.length / visiveis

                )

            );

        }



        // ============================
        // IR PARA PÁGINA
        // ============================


        function mover(){


            const visiveis =
                quantidadeVisivel();



            let indice =
                paginaAtual * visiveis;



            // ajuste para final incompleto

            if(
                indice + visiveis > cards.length
            ){

                indice =
                    cards.length - visiveis;

            }



            if(indice < 0)
                indice = 0;



            track.scrollTo({

    left:
        indice * larguraCard(),

    behavior:"auto"

});



            atualizarSetas();

        }



        // ============================
        // SETAS
        // ============================


        function atualizarSetas(){

            if(window.innerWidth <= 768){

                btnPrev.style.display = "none";
                btnNext.style.display = "none";

                return;

            }


            if(!btnPrev || !btnNext)
                return;



            btnPrev.style.display =
                paginaAtual > 0
                ? "flex"
                : "none";



            btnNext.style.display =
                paginaAtual < totalPaginas() - 1
                ? "flex"
                : "none";


        }




        btnNext.onclick = () => {


            if(
                paginaAtual < totalPaginas() - 1
            ){

                paginaAtual++;

                mover();

            }


        };



        btnPrev.onclick = () => {


            if(paginaAtual > 0){

                paginaAtual--;

                mover();

            }


        };



        // ============================
        // MOBILE
        // ============================


        function configurarMobile(){


            if(window.innerWidth <= 768){


                btnPrev.style.display =
                    "none";


                btnNext.style.display =
                    "none";


                track.style.overflowX =
                    "auto";


                track.style.scrollBehavior =
                    "smooth";


            }


            else{


                track.style.overflowX =
                    "hidden";


                atualizarSetas();


            }


        }



        window.addEventListener(

            "resize",

            configurarMobile

        );

        // ============================
        // ARRASTAR MOBILE
        // ============================

        let pressionando = false;

        let inicioX = 0;

        let scrollInicial = 0;


        track.addEventListener("touchstart", e => {

            pressionando = true;

            inicioX =
                e.touches[0].pageX;

            scrollInicial =
                track.scrollLeft;

        });


        track.addEventListener("touchmove", e => {

            if(!pressionando)
                return;


            const movimento =
                e.touches[0].pageX - inicioX;


            track.scrollLeft =
                scrollInicial - movimento;

        });


        track.addEventListener("touchend", () => {

            pressionando = false;

        });

        configurarMobile();



    });


}

document.addEventListener(
    "DOMContentLoaded",
    iniciarCarrosseis
);