// ============================
// CARREGAR FAVORITOS
// ============================

async function carregarFavoritos() {

    const lista = document.getElementById("listaFavoritos");

    if (!lista) return;


    const usuarioAuth = await Auth.getUser();


    if (!usuarioAuth) return;


    const { data: favoritos, error } =
    await supabaseClient
        .from("favoritos")
        .select("id_hq")
        .eq("id_usuario", usuarioAuth.id);


    if (error) {

        console.error(
            "Erro ao carregar favoritos:",
            error
        );

        lista.innerHTML =
        "<p>Erro ao carregar favoritos.</p>";

        return;

    }


    if (!favoritos || favoritos.length === 0) {

        lista.innerHTML =
        "<p>Nenhum favorito ainda.</p>";

        return;

    }


    lista.innerHTML = "";


    favoritos.forEach(item => {


        const hq =
        catalogoHQs.find(
            comic => comic.id === item.id_hq
        );


        if (!hq) return;


        const card =
        document.createElement("article");


        card.className = "comic-card";


        card.innerHTML = `

            <a href="../pages/hq.html?id=${hq.id}" class="comic-link">

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