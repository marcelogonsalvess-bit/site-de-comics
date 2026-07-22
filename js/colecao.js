// ============================
// CARREGAR FAVORITOS
// ============================

function carregarFavoritos() {

    const lista = document.getElementById("listaFavoritos");

    if (!lista) return;


    const usuario = Auth.getUser();


    if (!usuario || !usuario.favoritos || usuario.favoritos.length === 0) {

        lista.innerHTML = "<p>Nenhum favorito ainda.</p>";

        return;

    }


    lista.innerHTML = "";


    usuario.favoritos.forEach(idHQ => {


        const hq = catalogoHQs.find(

            item => item.id === idHQ

        );


        if (!hq) return;


        const card = document.createElement("article");


        card.className = "comic-card";


        card.innerHTML = `

            <a href="../${hq.pagina}" class="comic-link">


                <div class="comic-cover">


                    <img

                        src="${hq.capa}"

                        alt="${hq.titulo}"

                        loading="lazy">


                </div>


                <div class="comic-info">


                    <h3 class="comic-title">

                        ${hq.titulo}

                    </h3>


                </div>


            </a>

        `;


        lista.appendChild(card);


    });

}