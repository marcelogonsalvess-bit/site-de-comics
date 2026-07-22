// ============================
// MAIS ACESSADOS
// ============================

document.addEventListener(
    "catalogoCarregado",
    () => {


    const lista =
    document.getElementById("listaMaisAcessados");


    if(!lista) return;


    if(typeof catalogoHQs === "undefined"){

        console.error("Catálogo de HQs não carregado.");

        return;

    }


    lista.innerHTML = "";


    // ============================
    // CARREGAR ACESSOS SALVOS
    // ============================

    const acessosSalvos =

        JSON.parse(
            localStorage.getItem("acessosHQ")
        ) || {};



    const maisAcessados = [...catalogoHQs]

    .map(hq => ({


        ...hq,


        acessos:

            acessosSalvos[hq.id] || 0


    }))


    .sort((a,b)=>{


        return b.acessos - a.acessos;


    })


    .slice(0,10);



    // ============================
    // CRIAR CARDS
    // ============================

    maisAcessados.forEach((hq, index)=>{


        const card = document.createElement("article");


        card.className = "comic-card";


        card.innerHTML = `

            <a href="${hq.pagina}" class="comic-link">


                <div class="comic-cover">


                    <img

                        src="${hq.capa}"

                        alt="${hq.titulo}"

                        loading="lazy">


                </div>


                <div class="comic-info top10-info">

                    <div class="top10-number">

                        ${index + 1}

                    </div>

                </div>


            </a>

        `;


        lista.appendChild(card);


    });
        
    iniciarCarrosseis();

});