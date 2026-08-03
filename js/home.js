// ============================
// HOME - ÚLTIMAS ADIÇÕES
// ============================

document.addEventListener(
    "catalogoCarregado",
    () => {

    const lista = document.getElementById("listaUltimasAdicoes");

    if (!lista) return;


    if (typeof catalogoHQs === "undefined") {

        console.error("Catálogo de HQs não carregado.");
        return;

    }


    lista.innerHTML = "";


    const ultimasHQs = [...catalogoHQs]
        .sort((a, b) => {

            return new Date(b.criado_em) - new Date(a.criado_em)

        })
        .slice(0, 10);



    ultimasHQs.forEach(hq => {


        const card = document.createElement("article");

        card.className = "comic-card";


        card.innerHTML = `

            <a href="pages/hq.html?id=${hq.id}" class="comic-link">


                <div class="comic-cover">

                    <img
                        src="${
                            hq.capa_card
                                ? hq.capa_card
                                : hq.capa
                        }"
                        alt="${hq.titulo}"
                        loading="lazy">



                    ${
                        hq.mostrar_logo_card && hq.logo
                        ?
                        `
                        <img
                            class="comic-logo"
                            src="${hq.logo}"
                            alt="${hq.titulo}">
                        `
                        :
                        ""
                    }


                    ${hq.selo ? `
                    <span class="comic-badge">
                        ${hq.selo}
                    </span>
                    ` : ""}


                </div>



                <div class="comic-info">

                    <div class="comic-meta">

                        <span class="edition">
                            Edição #${hq.edicao || "001"} • ${hq.ano || ""}
                        </span>

                    </div>

                </div>


            </a>

        `;


        lista.appendChild(card);


    });


});

