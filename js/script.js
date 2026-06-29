const slider = document.querySelector(".slider");

document.querySelector(".next").onclick = () => {

    slider.scrollBy({

        left: 600,

        behavior: "smooth"

    });

}

document.querySelector(".prev").onclick = () => {

    slider.scrollBy({

        left: -600,

        behavior: "smooth"

    });

}


const heroes = [
    {
        titulo: "Coleções Clássicas",
        descricao: "Explore as principais coleções de quadrinhos clássicos e edições históricas.",
        categoria: "Fundação Comics",
        colecoes: "4",
        revistas: "950",
        periodo: "2016–2026",
        poster: "https://static.wixstatic.com/media/535ced_460507851e0c45d9914f535b5b1b15a9~mv2.jpg",
        fundo: "https://static.wixstatic.com/media/535ced_460507851e0c45d9914f535b5b1b15a9~mv2.jpg"
    },
    {
        titulo: "Universo DC",
        descricao: "As maiores histórias da DC Comics reunidas em um só lugar.",
        categoria: "Super-heróis",
        colecoes: "12",
        revistas: "1.240",
        periodo: "1938–2026",
        poster: "https://m.media-amazon.com/images/I/81bR8F1cJ1L.jpg",
        fundo: "https://wallpapercave.com/wp/wp2465877.jpg"
    },
    {
        titulo: "Marvel Classics",
        descricao: "Os heróis mais icônicos da Marvel em coleções completas.",
        categoria: "Super-heróis",
        colecoes: "18",
        revistas: "2.100",
        periodo: "1961–2026",
        poster: "https://m.media-amazon.com/images/I/91JX9x2x0pL.jpg",
        fundo: "https://wallpapercave.com/wp/wp2751455.jpg"
    }
];

let indexHero = 0;



function atualizarHero() {

    const hero = heroes[indexHero];

    document.getElementById("heroTitulo").textContent = hero.titulo;
    document.getElementById("heroDescricao").textContent = hero.descricao;
    document.getElementById("heroCategoria").textContent = hero.categoria;

    document.getElementById("heroColecoes").textContent = hero.colecoes;
    document.getElementById("heroRevistas").textContent = hero.revistas;
    document.getElementById("heroPeriodo").textContent = hero.periodo;

    document.getElementById("heroPoster").src = hero.poster;

    document.getElementById("heroFundo").style.backgroundImage =
        `url('${hero.fundo}')`;

}





const modal = document.getElementById("modalContato");
const openBtn = document.getElementById("openContato");
const closeBtn = document.getElementById("closeContato");

const form = document.getElementById("formContato");
const statusMsg = document.getElementById("statusMsg");

// abre / fecha com toggle
openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.toggle("ativo");
});

// fecha botão X
closeBtn.addEventListener("click", () => {
    modal.classList.remove("ativo");
});

// fecha clicando fora
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("ativo");
    }
});

// envio
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    try {
        const res = await fetch("https://formsubmit.co/ajax/marcelo@marcelogonsalves.com.br", {
            method: "POST",
            body: data
        });

        if (res.ok) {
            statusMsg.innerText = "Mensagem enviada com sucesso!";
            form.reset();

            // fecha modal após enviar
            modal.classList.remove("ativo");
        } else {
            statusMsg.innerText = "Erro ao enviar.";
        }

    } catch (err) {
        statusMsg.innerText = "Erro de conexão.";
    }
});