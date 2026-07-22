document.addEventListener(
    "catalogoCarregado",
    () => {


    // ==========================================================
    // ELEMENTOS DO HERO
    // ==========================================================

    const heroSlider = document.getElementById("heroSlider");

    const heroAuto = document.querySelector(".hero-slider-auto");

    const dotsContainer = document.querySelector(".hero-dots");

    const nextBtn = document.querySelector(".hero-next");

    const prevBtn = document.querySelector(".hero-prev");



    // Verifica estrutura

    if (!heroSlider || !heroAuto) {

        console.warn("Estrutura do Hero não encontrada.");

        return;

    }



    // ==========================================================
    // VARIÁVEIS DO SLIDER
    // ==========================================================

    let slides = [];

    let dots = [];

    let slideAtual = 0;

    let intervaloHero = null;



    // ==========================================================
    // CATÁLOGO DO HERO
    // ==========================================================

    const heroHQs = catalogoHQs

        .filter(hq => hq.hero === true)

        .sort((a, b) => {

            return (a.heroOrdem || 0) - (b.heroOrdem || 0);

        });



    if (!heroHQs.length) {

        console.warn(
            "Nenhuma HQ marcada para aparecer no Hero."
        );

        return;

    }



    // ==========================================================
    // CRIAÇÃO DO HTML DO SLIDE
    // ==========================================================

    function buscarSlugColecao(id){

        if(typeof catalogoColecoes === "undefined") return "#";

        const colecao = catalogoColecoes.find(

            c => c.id === id

        );


        return colecao

            ? `../colecoes/${colecao.slug}.html`

            : "#";

    }


    function criarSlideHero(hq) {


        return `

        <article class="hero-slide">


            <img

                src="${hq.heroImagem}"

                alt="${hq.titulo}"

                class="hero-image">




            <div class="hero-overlay"></div>




            <div class="hero-content">


                <div class="container">


                    ${hq.logo ? `

                    <img

                        src="${hq.logo}"

                        alt="${hq.titulo}"

                        class="hero-logo">

                    ` : ""}



                    <div class="hero-info">

                        <span class="classificacao idade-${hq.classificacao || "livre"}">
                            ${hq.classificacao || "L"}
                        </span>

                        <span>
                            ${hq.paginas || ""} páginas
                        </span>

                        <span>
                            ${hq.formato || ""}
                        </span>

                    </div>




                    <h1>

                        ${hq.titulo}

                    </h1>




                    <p>

                        ${hq.sinopse || ""}

                    </p>




                    <div class="hero-buttons">


                        <a

                            href="${hq.pagina || "#"}"

                            class="btn-primary">


                            Ler mais


                        </a>



                        <a

                            href="${buscarSlugColecao(hq.colecaoId)}"

                            class="btn-secondary">


                            Ver coleção


                        </a>


                    </div>



                </div>


            </div>



        </article>

        `;

    }



    // ==========================================================
    // GERAÇÃO DOS SLIDES
    // ==========================================================

    function criarSlides() {


        heroAuto.innerHTML = heroHQs

            .map(criarSlideHero)

            .join("");



        slides = [

            ...heroAuto.querySelectorAll(".hero-slide")

        ];


    }
    // ==========================================================
// CRIAÇÃO DOS DOTS
// ==========================================================

function criarDots() {


    if (!dotsContainer) return;


    dotsContainer.innerHTML = "";



    slides.forEach((slide, index) => {


        const dot = document.createElement("button");


        dot.classList.add("hero-dot");



        dot.setAttribute(

            "aria-label",

            `Ir para o slide ${index + 1}`

        );



        dot.dataset.slide = index;



        dot.addEventListener("click", () => {


            mostrarSlide(index);


            reiniciarAutoplay();


        });



        dotsContainer.appendChild(dot);


    });



    dots = [

        ...dotsContainer.querySelectorAll(".hero-dot")

    ];


}



// ==========================================================
// MOSTRAR SLIDE
// ==========================================================

function mostrarSlide(index) {


    if (!slides.length) return;



    if (index >= slides.length) {


        slideAtual = 0;


    } else if (index < 0) {


        slideAtual = slides.length - 1;


    } else {


        slideAtual = index;


    }




    slides.forEach(slide => {


        slide.classList.remove("active");


    });



    dots.forEach(dot => {


        dot.classList.remove("active");


    });




    slides[slideAtual].classList.add("active");



    if (dots[slideAtual]) {


        dots[slideAtual].classList.add("active");


    }


}



// ==========================================================
// PRÓXIMO SLIDE
// ==========================================================

function proximoSlide() {


    mostrarSlide(slideAtual + 1);


}



// ==========================================================
// SLIDE ANTERIOR
// ==========================================================

function slideAnterior() {


    mostrarSlide(slideAtual - 1);


}



// ==========================================================
// CONTROLES DAS SETAS
// ==========================================================

function iniciarControlesHero() {


    if (nextBtn) {


        nextBtn.addEventListener("click", () => {


            proximoSlide();


            reiniciarAutoplay();


        });


    }



    if (prevBtn) {


        prevBtn.addEventListener("click", () => {


            slideAnterior();


            reiniciarAutoplay();


        });


    }


}
// ==========================================================
// AUTOPLAY
// ==========================================================

function iniciarAutoplayHero() {


    if (slides.length <= 1) return;



    limparAutoplay();



    intervaloHero = setInterval(() => {


        proximoSlide();


    }, 7000);


}



// ==========================================================
// LIMPAR AUTOPLAY
// ==========================================================

function limparAutoplay() {


    if (intervaloHero) {


        clearInterval(intervaloHero);


        intervaloHero = null;


    }


}



// ==========================================================
// REINICIAR AUTOPLAY
// ==========================================================

function reiniciarAutoplay() {


    limparAutoplay();


    iniciarAutoplayHero();


}



// ==========================================================
// PAUSA AO PASSAR O MOUSE
// ==========================================================

function configurarPausaHero() {


    if (!heroSlider) return;



    heroSlider.addEventListener(
        "mouseenter",
        () => {


            limparAutoplay();


        }
    );



    heroSlider.addEventListener(
        "mouseleave",
        () => {


            iniciarAutoplayHero();


        }
    );


}



// ==========================================================
// AJUSTE RESPONSIVO
// ==========================================================

function ajustarHeroMobile() {


    slides.forEach(slide => {


        const imagem = slide.querySelector(
            ".hero-image"
        );



        if (!imagem) return;



        if (window.innerWidth <= 768) {


            imagem.style.objectPosition = "center";


        } else {


            imagem.style.objectPosition = "center right";


        }


    });


}



window.addEventListener(
    "resize",
    ajustarHeroMobile
);
// ==========================================================
// INICIALIZAÇÃO FINAL DO HERO
// ==========================================================

criarSlides();


criarDots();


mostrarSlide(0);


iniciarControlesHero();


iniciarAutoplayHero();


ajustarHeroMobile();


configurarPausaHero();




// ==========================================================
// CONTROLES EXTERNOS
// ==========================================================

window.hero = {


    proximo() {

        proximoSlide();

    },


    anterior() {

        slideAnterior();

    },


    irPara(index) {

        mostrarSlide(index);

    }


};



// ==========================================================
// LIMPEZA DO HERO
// ==========================================================

window.destruirHero = function() {


    limparAutoplay();



    slides.forEach(slide => {


        slide.classList.remove("active");


    });


};


});