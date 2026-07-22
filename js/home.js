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

            return new Date(b.dataAdicao) - new Date(a.dataAdicao);

        })
        .slice(0, 10);



    ultimasHQs.forEach(hq => {


        const card = document.createElement("article");

        card.className = "comic-card";


        card.innerHTML = `

            <a href="${hq.pagina}" class="comic-link">


                <div class="comic-cover">

                    <img
                        src="${
                            (hq.mostrarLogoCard && hq.capaCard)
                                ? hq.capaCard
                                : hq.capa
                        }"
                        alt="${hq.titulo}"
                        loading="lazy">



                    ${
                        hq.mostrarLogoCard && hq.logo
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

