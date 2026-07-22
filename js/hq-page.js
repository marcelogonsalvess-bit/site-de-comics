// ============================
// PÁGINA DA HQ
// ============================

    document.addEventListener(
        "catalogoCarregado",
        () => {

            console.log("HQ Page carregado");

            console.log("CATÁLOGO DENTRO DA HQ:", catalogoHQs);


            // ============================
            // CARREGAR DADOS DA HQ
            // ============================

            let dadosHQ = null;


            // Novo formato (catálogo)

            let idAtual = null;


            // pega o nome do arquivo atual

            const arquivoAtual = window.location.pathname
                .split("/")
                .pop()
                .replace(".html","");


            // usa o nome como ID da HQ

            idAtual = arquivoAtual;



            if (
                typeof buscarHQ === "function"
            ) {


                dadosHQ = buscarHQ(idAtual);




        if (!dadosHQ) {

            console.error(
                `HQ '${hqId}' não encontrada no catálogo.`
            );

            return;

        }

    }


    // Formato antigo

    else if (typeof hq !== "undefined") {

        dadosHQ = hq;

    }


    // Nenhuma HQ encontrada

    else {

        console.error(
            "Nenhuma HQ foi definida."
        );

        return;

    }



    // ============================
    // ELEMENTOS
    // ============================


    const volumeHQ = document.getElementById("volumeHQ");
    const anoHQ = document.getElementById("anoHQ");
    const sinopseHQ = document.getElementById("sinopseHQ");
    const capaHQ = document.getElementById("capaHQ");
    const logoHQ = document.getElementById("logoHQ");
    const bannerHQ = document.querySelector(".hq-banner");

    const btnFavorito =
        document.getElementById("btnFavorito");

    const btnBiblioteca =
        document.getElementById("btnBiblioteca");

    const btnDownload =
        document.getElementById("btnDownload");



    // Links

    const linkColecaoHQ =
        document.getElementById("linkColecaoHQ");


    const linkEditora =
        document.getElementById("linkEditora");



    // Painel informações

    const infoEditora =
        document.getElementById("infoEditora");


    const infoAno =
        document.getElementById("infoAno");


    const infoVolume =
        document.getElementById("infoVolume");


    const infoColecao =
        document.getElementById("infoColecao");




    // ============================
    // BUSCAR EDITORA E COLEÇÃO
    // ============================


    const editoraInfo =
        catalogoEditoras.find(

            editora =>
            editora.id === dadosHQ.editoraId

        );



    const colecaoInfo =
        catalogoColecoes.find(

            colecao =>
            colecao.id === dadosHQ.colecaoId

        );



    // ============================
    // BOTÃO DOWNLOAD
    // ============================


    if (btnDownload) {


        if (Auth.isLogged()) {


            btnDownload.textContent =
                "⬇️ Download HQ";


            btnDownload.disabled =
                false;


            btnDownload.title = "";


        }


        else {


            btnDownload.textContent =
                "🔒";


            btnDownload.disabled =
                false;


            btnDownload.title =
                "Faça login ou registre-se para baixar";



            btnDownload.onclick = () => {


                const loginBtn =
                    document.getElementById("openLogin");


                if (loginBtn) {

                    loginBtn.click();

                }


            };


        }


    }



    // ============================
    // PREENCHER DADOS
    // ============================


    document.title =
        `${dadosHQ.titulo} | Fundação Comics`;



    registrarAcesso(
        dadosHQ.id
    );



    if (volumeHQ)
        volumeHQ.textContent =
            dadosHQ.volume;



    if (anoHQ)
        anoHQ.textContent =
            dadosHQ.ano;

    if (edicaoHQ)
        edicaoHQ.textContent =
            dadosHQ.edicao;



    if (sinopseHQ)

        sinopseHQ.textContent =
            dadosHQ.descricaoCompleta ||
            dadosHQ.sinopse;

    if (btnDownload && dadosHQ.download){

        btnDownload.onclick = () => {

            const usuarioLogado =
                JSON.parse(
                    localStorage.getItem("usuario")
                );


            if(!usuarioLogado){

                alert("Faça login ou cadastre-se para baixar esta HQ.");

                return;

            }


            window.open(
                dadosHQ.download,
                "_blank"
            );

        };

    }


    if (infoAno)

        infoAno.textContent =
            dadosHQ.ano;



    if (infoVolume)

        infoVolume.textContent =
            dadosHQ.volume;



    if (infoColecao)

        infoColecao.textContent =
            colecaoInfo
            ? colecaoInfo.nome
            : "";



    if (infoEditora)

        infoEditora.textContent =
            editoraInfo
            ? editoraInfo.nome
            : "";



    // ============================
    // LINKS
    // ============================


    if (
        linkEditora &&
        editoraInfo
    ) {


        linkEditora.href =
            `../../../${editoraInfo.pagina}`;


    }



    if (
        linkColecaoHQ &&
        colecaoInfo
    ) {


        linkColecaoHQ.href =
            `/colecoes/${colecaoInfo.slug}.html`;


    }



    // ============================
    // IMAGENS
    // ============================


    if (capaHQ) {


        capaHQ.src =
            dadosHQ.capa;


        capaHQ.alt =
            dadosHQ.titulo;


    }



    if (logoHQ) {


        logoHQ.src =
            dadosHQ.logo;


        logoHQ.alt =
            dadosHQ.titulo;


    }



    if (bannerHQ) {


        bannerHQ.style.backgroundImage =
            `url(${dadosHQ.heroImagem})`;


    }
        // ============================
    // PAINEL DE INFORMAÇÕES
    // ============================


    montarPainelInformacoes(
        dadosHQ,
        editoraInfo,
        colecaoInfo
    );
    montarRevistasRelacionadas(dadosHQ);


    // ============================
    // FAVORITOS
    // ============================


    if (btnFavorito) {


        configurarFavorito(

            dadosHQ.id,

            btnFavorito,

            dadosHQ.titulo

        );


    }



    // ============================
    // BIBLIOTECA
    // ============================


    function atualizarBiblioteca() {


        if (!btnBiblioteca)
            return;



        const usuario =
            Auth.getUser();



        const existe =

            usuario &&

            usuario.biblioteca &&

            usuario.biblioteca.some(

                item =>
                item.id === dadosHQ.id

            );



        if (existe) {


            btnBiblioteca.textContent =
                "✓";


            btnBiblioteca.title =
                "Remover da biblioteca";


        }


        else {


            btnBiblioteca.textContent =
                "+";


            btnBiblioteca.title =
                "Adicionar à biblioteca";


        }


    }




    if (btnBiblioteca) {


        atualizarBiblioteca();



        btnBiblioteca.addEventListener(

            "click",

            () => {


                const usuario =
                    Auth.getUser();



                const existe =

                    usuario &&

                    usuario.biblioteca &&

                    usuario.biblioteca.some(

                        item =>
                        item.id === dadosHQ.id

                    );



                if (existe) {


                    Auth.removeFromLibrary(

                        dadosHQ.id,

                        dadosHQ.titulo

                    );


                }


                else {


                    Auth.addToLibrary({

                        id:
                            dadosHQ.id,


                        titulo:
                            dadosHQ.titulo,


                        capa:
                            dadosHQ.capa,


                        pagina:
                            dadosHQ.pagina


                    });


                }



                atualizarBiblioteca();


            }

        );


    }



});

// ============================
// PAINEL DE INFORMAÇÕES
// ============================

function montarPainelInformacoes(dadosHQ, editoraInfo, colecaoInfo){

    const left =
        document.getElementById("hqInfoLeft");


    const right =
        document.getElementById("hqInfoRight");



    if (!left || !right)
        return;



    left.innerHTML = "";

    right.innerHTML = "";



    function adicionarItem(

        coluna,

        titulo,

        valor,

        link = ""

    ){


        if (!valor)
            return;



        coluna.innerHTML += `

            <div class="hq-info-item">


                <span class="hq-info-label">

                    ${titulo}

                </span>


                ${
                    link

                    ?

                    `<a href="${link}" class="hq-info-value">
                        ${valor}
                    </a>`

                    :

                    `<span class="hq-info-value">
                        ${valor}
                    </span>`

                }


            </div>

        `;


}



    // ============================
    // COLUNA ESQUERDA
    // ============================

    adicionarItem(

        left,

        "Título Original",

        dadosHQ.informacoes
        ? dadosHQ.informacoes.tituloOriginal
        : ""

     );

    adicionarItem(

        left,

        "Coleção",

        colecaoInfo
        ? colecaoInfo.nome
        : "",

        colecaoInfo
        ? `../../../colecoes/${colecaoInfo.slug}.html`
        : ""

    );


    adicionarItem(

        left,

        "Volume",

        dadosHQ.volume

    );


    adicionarItem(

        left,

        "Edição",

        dadosHQ.edicao

    );


    adicionarItem(

        left,

        "Ano",

        dadosHQ.ano

    );


    adicionarItem(

        left,

        "Classificação",

        dadosHQ.classificacao

    );


    adicionarItem(

        left,

        "Formato",

        dadosHQ.formato

    );
    
        adicionarItem(

            left,

            "Idioma",

            dadosHQ.informacoes
            ? dadosHQ.informacoes.idioma
            : ""

        );


        adicionarItem(

            left,

            "Gênero",

            dadosHQ.informacoes
            ? dadosHQ.informacoes.genero
            : ""

        );


        adicionarItem(

            left,

            "Páginas",

            dadosHQ.informacoes
            ? dadosHQ.informacoes.paginas
            : ""

        );

        adicionarItem(

            left,

            "Editora",

            editoraInfo
            ? editoraInfo.nome
            : "",

            editoraInfo
            ? `../../../${editoraInfo.pagina}`
            : ""

        );


    // ============================
    // COLUNA DIREITA
    // ============================


    

    adicionarItem(

        right,

        "Data de Lançamento",

        dadosHQ.informacoes
        ? dadosHQ.informacoes.dataLancamento
        : ""

    );

    adicionarItem(

        right,

        "Tamanho",

        dadosHQ.informacoes
        ? dadosHQ.informacoes.tamanho
        : ""

    );

    adicionarItem(

        right,

        "Servidor",

        dadosHQ.informacoes
        ? dadosHQ.informacoes.servidor
        : ""

    );

    adicionarItem(

        right,

        "Autor",

        dadosHQ.creditos
        ? dadosHQ.creditos.autor
        : ""

    );


    adicionarItem(

        right,

        "Desenhista",

        dadosHQ.creditos
        ? dadosHQ.creditos.desenhista
        : ""

    );

        adicionarItem(

        right,

        "Colorista",

        dadosHQ.creditos
        ? dadosHQ.creditos.colorista
        : ""

    );


    adicionarItem(

        right,

        "Tradutor",

        dadosHQ.creditos
        ? dadosHQ.creditos.tradutor
        : ""

    );

}

// ============================
// REVISTAS RELACIONADAS
// ============================


function montarRevistasRelacionadas(dadosHQ){


    const container =
        document.getElementById("revistasRelacionadas");



    if (!container)
        return;



    if (!dadosHQ.colecaoId)
        return;



    const relacionadas =

        catalogoHQs.filter(


            hq =>

            hq.colecaoId === dadosHQ.colecaoId &&

            hq.id !== dadosHQ.id


        );



    container.innerHTML = "";



    relacionadas.forEach(hq => {


        container.innerHTML += `

            <a 
                href="../../../${hq.pagina}"
                class="related-card"
            >

                <img

                    src="${hq.capa}"

                    alt="${hq.titulo}"

                >


                <div class="related-overlay">

                    <h3>
                        ${hq.titulo}
                    </h3>

                </div>


            </a>

        `;


    });


}