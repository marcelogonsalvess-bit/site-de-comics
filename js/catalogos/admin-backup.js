Chart.register(ChartDataLabels);
let hqEditandoId = null;


const painelUsuarios = document.getElementById("painelUsuarios");

const painelHQMaisBaixada = document.getElementById("painelHQMaisBaixada");

const painelAtividades = document.getElementById("painelAtividades");

const painelDownloads = document.getElementById("painelDownloads");

const painelHQFavorita = document.getElementById("painelHQFavorita");

const painelUltimoUsuario = document.getElementById("painelUltimoUsuario");


// ============================
// VERIFICAR ADMIN
// ============================

async function verificarAdmin(){


    const {
        data:{
            user
        }
    } = await supabaseClient.auth.getUser();



    if(!user){

        window.location.href = "../index.html";

        return;

    }



    const { data: perfil } =
    await supabaseClient
        .from("perfis")
        .select("admin")
        .eq("id_auth", user.id)
        .single();



    if(!perfil || perfil.admin !== true){

        alert(
            "Acesso negado."
        );


        window.location.href =
        "../index.html";


        return;

    }



    console.log(
        "Administrador confirmado"
    );


}



// ============================
// CARREGAR ESTATÍSTICAS
// ============================

async function carregarEstatisticas(){


    // USUÁRIOS

    const { count: totalUsuarios, error } =
    await supabaseClient
        .from("perfis")
        .select("*", {
            count:"exact",
            head:true
        });



    if(error){

        console.error(
            "Erro ao buscar usuários:",
            error
        );

        return;

    }



    document.getElementById(
        "totalUsuarios"
    ).textContent = totalUsuarios;


    // Usuários ativos (com pelo menos uma atividade)

    const { data: usuariosAtivos } =
    await supabaseClient
        .from("atividades")
        .select("id_usuario");

    const totalUsuariosAtivos =
    new Set(
        (usuariosAtivos || []).map(item => item.id_usuario)
    ).size;

    const percentualAtivos =
    totalUsuarios > 0
        ? Math.round((totalUsuariosAtivos / totalUsuarios) * 100)
        : 0;

    document.getElementById(
        "crescimentoUsuarios"
    ).textContent =
    `${percentualAtivos}% ativos`;


    // HQS

    const totalHQs =
    catalogoHQs.length;


    document.getElementById(
        "totalHQs"
    ).textContent = totalHQs;


    // HQs baixadas

const { data: hqsBaixadas } =
await supabaseClient
    .from("downloads")
    .select("id_hq");


const totalHQsBaixadas =
new Set(
    (hqsBaixadas || []).map(item => item.id_hq)
).size;


document.getElementById(
    "crescimentoHQs"
).textContent =
`${totalHQsBaixadas} HQ${totalHQsBaixadas === 1 ? "" : "s"} baixada${totalHQsBaixadas === 1 ? "" : "s"}`;



    // FAVORITOS


    const { count: totalFavoritos, error: erroFavoritos } =
    await supabaseClient
        .from("favoritos")
        .select("*", {
            count:"exact",
            head:true
        });



    if(erroFavoritos){

        console.error(
            "Erro ao buscar favoritos:",
            erroFavoritos
        );

        return;

    }



    document.getElementById(
        "totalFavoritos"
    ).textContent = totalFavoritos;


    // Favoritos últimos 7 dias

    const seteDiasAtrasFavoritos =
    new Date();

    seteDiasAtrasFavoritos.setDate(
        seteDiasAtrasFavoritos.getDate() - 7
    );


    const { count: favoritosRecentes } =
    await supabaseClient
        .from("favoritos")
        .select("*", {
            count:"exact",
            head:true
        })
        .gte(
            "criado_em",
            seteDiasAtrasFavoritos.toISOString()
        );


    document.getElementById(
        "crescimentoFavoritos"
    ).textContent =
    document.getElementById(
        "crescimentoFavoritos"
    ).textContent =
    favoritosRecentes > 0
        ? `${favoritosRecentes} novo${favoritosRecentes === 1 ? "" : "s"} favorito${favoritosRecentes === 1 ? "" : "s"} nos últimos 7 dias`
        : "Nenhum favorito recente";



// ============================
// HQ MAIS FAVORITADA
// ============================

const { data: favoritosHQs, error: erroHQFavorita } =
await supabaseClient
    .from("favoritos")
    .select("id_hq");



if(!erroHQFavorita && favoritosHQs.length){


    const contadorFavoritos = {};


    favoritosHQs.forEach(item => {


        contadorFavoritos[item.id_hq] =
            (contadorFavoritos[item.id_hq] || 0) + 1;


    });



    const idMaisFavoritada =
    Object.keys(contadorFavoritos).reduce(
        (a, b) =>
        contadorFavoritos[a] > contadorFavoritos[b] ? a : b
    );



    const hq =
    catalogoHQs.find(
        comic => comic.id === idMaisFavoritada
    );



    if(hq){

        document.getElementById(
            "hqMaisFavoritadaTitulo"
        ).textContent =
        hq.titulo;


        const capa =
        document.getElementById(
            "hqMaisFavoritadaCapa"
        );


        capa.src = hq.capa;
        capa.alt = hq.titulo;


        document.getElementById(
            "hqMaisFavoritadaFavoritos"
        ).textContent =

        contadorFavoritos[idMaisFavoritada];

    }


}

// ============================
// HQ MAIS BAIXADA
// ============================

const { data: downloadsHQs, error: erroHQMaisBaixada } =
await supabaseClient
    .from("downloads")
    .select("id_hq");



if(!erroHQMaisBaixada && downloadsHQs.length){


    const contadorDownloads = {};


    downloadsHQs.forEach(item => {


        contadorDownloads[item.id_hq] =
            (contadorDownloads[item.id_hq] || 0) + 1;


    });



    const idMaisBaixada =
    Object.keys(contadorDownloads).reduce(
        (a, b) =>
        contadorDownloads[a] > contadorDownloads[b] ? a : b
    );



    const hq =
    catalogoHQs.find(
        comic => comic.id === idMaisBaixada
    );



    if(hq){


        document.getElementById(
            "hqMaisBaixadaTitulo"
        ).textContent =
        hq.titulo;



        const capa =
        document.getElementById(
            "hqMaisBaixadaCapa"
        );


        capa.src = hq.capa;
        capa.alt = hq.titulo;



        document.getElementById(
            "hqMaisBaixadaDownloads"
        ).textContent =

        ` ${contadorDownloads[idMaisBaixada]} ${contadorDownloads[idMaisBaixada] > 1 ? "s" : ""}`;



    }else{


        document.getElementById(
            "hqMaisBaixadaTitulo"
        ).textContent =
        "-";


        document.getElementById(
            "hqMaisBaixadaDownloads"
        ).textContent =
        "-";


        const capa =
        document.getElementById(
            "hqMaisBaixadaCapa"
        );


        capa.src = "../img/capas/placeholder.jpg";
        capa.alt = "Sem HQ";

    }


}



    // DOWNLOADS


    const { count: totalDownloads, error: erroDownloads } =
    await supabaseClient
        .from("downloads")
        .select("*", {
            count:"exact",
            head:true
        });



    if(erroDownloads){

        console.error(
            "Erro ao buscar downloads:",
            erroDownloads
        );

        return;

    }



    document.getElementById(
        "totalDownloads"
    ).textContent = totalDownloads;


    // Downloads últimos 7 dias

    const seteDiasAtras =
    new Date();

    seteDiasAtras.setDate(
        seteDiasAtras.getDate() - 7
    );


    const { count: downloadsRecentes } =
    await supabaseClient
        .from("downloads")
        .select("*", {
            count:"exact",
            head:true
        })
        .gte(
            "criado_em",
            seteDiasAtras.toISOString()
        );


    document.getElementById(
        "crescimentoDownloads"
    ).textContent =
        document.getElementById(
        "crescimentoDownloads"
    ).textContent =
    downloadsRecentes > 0
    ? `${downloadsRecentes} download${downloadsRecentes === 1 ? "" : "s"} nos últimos 7 dias`
    : "Nenhum download recente";


    // ============================
    // BIBLIOTECA
    // ============================

    // Total de HQs adicionadas às bibliotecas
    const { count: totalHQsBiblioteca, error: erroBiblioteca } =
    await supabaseClient
        .from("biblioteca")
        .select("*", {
            count: "exact",
            head: true
        });

    if (erroBiblioteca) {

        console.error(
            "Erro ao buscar biblioteca:",
            erroBiblioteca
        );

    } else {

        document.getElementById(
            "totalHQsBiblioteca"
        ).textContent = totalHQsBiblioteca || 0;

    }

    // Usuários que possuem biblioteca
    const { data: bibliotecas } =
    await supabaseClient
        .from("biblioteca")
        .select("id_usuario");

    const totalBibliotecas =
    new Set(
        (bibliotecas || []).map(item => item.id_usuario)
    ).size;

    document.getElementById(
        "totalBibliotecas"
    ).textContent = totalBibliotecas;



    // ============================
// TOTAL DE ATIVIDADES
// ============================

const { count: totalAtividades, error: erroAtividades } =
await supabaseClient
    .from("atividades")
    .select("*", {
        count:"exact",
        head:true
    });


if(erroAtividades){

    console.error(
        "Erro ao buscar atividades:",
        erroAtividades
    );

    return;

}


    const totalAtividadesElemento =
    document.getElementById("totalAtividadesAdmin");


        if(totalAtividadesElemento){

            totalAtividadesElemento.textContent =
            totalAtividades;

    }



// ============================
// ÚLTIMO USUÁRIO CADASTRADO
// ============================

const { data: ultimoUsuario, error: erroUltimoUsuario } =
await supabaseClient
    .from("perfis")
    .select("nome, avatar, created_at")
    .order(
        "created_at",
        {
            ascending:false
        }
    )
    .limit(1)
    .single();



if(erroUltimoUsuario){

    console.error(
        "Erro ao buscar último usuário:",
        erroUltimoUsuario
    );

    return;

}



document.getElementById("ultimoUsuarioNome").textContent =
    ultimoUsuario.nome;

document.getElementById("ultimoUsuarioData").textContent =
    new Date(ultimoUsuario.created_at)
        .toLocaleDateString("pt-BR");

const avatarUltimoUsuario =
document.getElementById("ultimoUsuarioAvatar");


if(avatarUltimoUsuario){

    avatarUltimoUsuario.src =
    "../img/avatars/" + (ultimoUsuario.avatar || "avatar1.jpg");

    avatarUltimoUsuario.alt =
    ultimoUsuario.nome;

}

}



// ============================
// CARREGAR ATIVIDADES RECENTES
// ============================

async function carregarAtividadesAdmin(){


    const lista = painelAtividades;


    if(!lista) return;



    if(!lista) return;



    const { data: atividades, error } =
    await supabaseClient
        .from("atividades")
        .select("*")
        .order(
            "criado_em",
            {
                ascending:false
            }
        )
        .limit(4);



    if(error){

        console.error(
            "Erro ao carregar atividades:",
            error
        );


        lista.innerHTML =
        "<p>Erro ao carregar atividades.</p>";


        return;

    }



    if(!atividades || atividades.length === 0){


        lista.innerHTML =
        "<p>Nenhuma atividade registrada.</p>";


        return;


    }



    lista.innerHTML = "";



    atividades.forEach(
    atividade => {


        const item =
        document.createElement("div");



        item.className =
        "admin-atividade-item";



        item.innerHTML = `

            ${
                atividade.tipo === "💔"
                ? '<i class="atividade-icone favorito-remove fa-solid fa-heart-crack"></i>'

                : atividade.tipo === "❤️"
                ? '<i class="atividade-icone favorito fa-solid fa-heart"></i>'

                : atividade.tipo === "📚"
                ? '<i class="atividade-icone biblioteca fa-solid fa-book"></i>'

                : atividade.tipo === "📕"
                ? '<i class="atividade-icone biblioteca-remove fa-solid fa-book-open"></i>'

                : atividade.tipo === "⬇️"
                ? '<i class="atividade-icone download fa-solid fa-download"></i>'

                : '<i class="atividade-icone fa-solid fa-bolt"></i>'
            }


            <div>

                <p>
                    ${atividade.descricao}
                </p>


                <small>
                    ${
                        new Date(
                            atividade.criado_em
                        ).toLocaleString("pt-BR")
                    }
                </small>

            </div>

        `;



        lista.appendChild(item);


    });


}



// ============================
// INICIAR PAINEL
// ============================

// temporariamente desativado
// até conectar Supabase e Chart.js

verificarAdmin();

carregarEstatisticas();

carregarAtividadesAdmin();

carregarGraficoDownloads();

carregarGraficoUsuarios();


// ==========================
// GRÁFICO DE USUÁRIOS
// ==========================

async function carregarGraficoUsuarios(){

    const { data, error } = await supabaseClient
        .from("perfis")
        .select("created_at");


    if(error){

        console.error(
            "Erro ao buscar usuários:",
            error
        );

        return;

    }


    const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez"
    ];


    const contador = Array(12).fill(0);


    data.forEach(usuario => {

        const dataCadastro =
        new Date(usuario.created_at);


        const mes =
        dataCadastro.getMonth();


        contador[mes]++;

    });

    painelUsuarios.innerHTML = `

        <h2>
            <i class="fa-solid fa-chart-line"></i>
            Novos Usuários
        </h2>

        <canvas id="graficoUsuarios"></canvas>

    `;

    const ctx =
    document.getElementById(
        "graficoUsuarios"
    );


    new Chart(ctx, {

        type:"bar",

        data:{

            labels:meses,

            datasets:[{

                label:"Novos usuários por mês",

                data:contador,

                backgroundColor:"#7c3aed",

                borderColor:"#8b5cf6",

                borderWidth:1,

                borderRadius:8

            }]

        },


        options:{

    responsive:true,

    plugins:{

        tooltip:{

            enabled:true

        }

    },

    scales:{

        y:{

            beginAtZero:true,

            ticks:{

                color:"#999",

                precision:0

            }

        },

        x:{

            ticks:{

                color:"#999"

            }

        }

    }

}

    });

}



// ==========================
// GRÁFICO DE DOWNLOADS
// ==========================

async function carregarGraficoDownloads(){

    const { data, error } = await supabaseClient
    .from("downloads")
    .select("criado_em");


    if(error){

        console.error(
            "Erro ao buscar downloads:",
            error
        );

        return;

    }


    const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez"
    ];


    const contador = Array(12).fill(0);


    data.forEach(download => {

        const dataDownload =
        new Date(download.criado_em);


        const mes =
        dataDownload.getMonth();


        contador[mes]++;

    });


    painelDownloads.innerHTML = `

        <h2>
            <i class="fa-solid fa-download"></i>
            Downloads por Mês
        </h2>

        <canvas id="graficoDownloads"></canvas>

    `;


        const ctx =
        document.getElementById(
            "graficoDownloads"
        );


    if(!ctx) return;


    new Chart(ctx, {

        type:"bar",

        data:{

            labels:meses,

            datasets:[{

                label:"Downloads por mês",

                data:contador,

                backgroundColor:"#16a34a",

                borderColor:"#22c55e",

                borderWidth:1,

                borderRadius:8

            }]

        },


        options:{

            responsive:true,

            plugins:{

                tooltip:{

                    enabled:true

                }

            },

            scales:{

                y:{

                    beginAtZero:true,

                    ticks:{

                        color:"#999",

                        precision:0

                    }

                },

                x:{

                    ticks:{

                        color:"#999"

                    }

                }

            }

        }

    });

}




// ============================
// GERENCIAR HQs
// ============================

async function carregarListaHQsAdmin(){

    const lista =
    document.getElementById("listaHQsAdmin");


    if(!lista){

        return;

    }


    lista.innerHTML = "";


    const { data: hqs, error } =
    await supabaseClient
    .from("hqs")
    .select("*")
    .order("criado_em", { ascending:false });


    if(error){

        console.error(
            "Erro ao carregar HQs:",
            error
        );

        return;

    }


    hqs.forEach(hq => {


        const item =
        document.createElement("div");


        item.className =
        "admin-hq-item";


        item.innerHTML = `


            <div class="admin-hq-capa-area">


                <img
                    src="${hq.capa}"
                    alt="${hq.titulo}"
                    class="admin-hq-capa">


                <div class="admin-hq-overlay">


                    <button
                        class="btnEditarHQ"
                        data-id="${hq.id}">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="btnExcluirHQ"
                        data-id="${hq.id}">

                        <i class="fa-solid fa-trash"></i>

                    </button>


                </div>


            </div>


            <h3>
                ${hq.titulo}
            </h3>


        `;


        lista.appendChild(item);


    });


}

setTimeout(() => {

    carregarListaHQsAdmin();

}, 1000);


document.addEventListener("click", async (e) => {

    const botao = e.target.closest(".btnEditarHQ");


    if(botao){

        const idHQ = botao.dataset.id;


        const hqEditar = catalogoHQs.find(
            hq => hq.id === idHQ
        );

        hqEditandoId = hqEditar.id;



      

        document.getElementById("tituloHQ").value = hqEditar.titulo || "";

        document.getElementById("anoHQ").value = hqEditar.ano || "";

        document.getElementById("volumeHQ").value = hqEditar.volume || "";

        document.getElementById("edicaoHQ").value = hqEditar.edicao || "";

        document.getElementById("editoraHQ").value = hqEditar.editora || "";

        document.getElementById("colecaoHQ").value = hqEditar.colecao || "";

        document.getElementById("formatoHQ").value = hqEditar.formato || "";

        document.getElementById("seloHQ").value = hqEditar.selo || "";

        document.getElementById("classificacaoHQ").value = hqEditar.classificacao || "";

        document.getElementById("mostrarHeroHQ").checked =
            hqEditar.hero || false;


        document.getElementById("mostrarLogoHero").checked =
            hqEditar.mostrar_logo_hero || false;


        document.getElementById("mostrarLogoCard").checked =
            hqEditar.mostrar_logo_card || false;


        document.getElementById("mostrarLogoPost").checked =
            hqEditar.mostrar_logo_post || false;

        urlCapa = hqEditar.capa || null;

        if(previewCapaHQ){

            previewCapaHQ.src =
                hqEditar.capa || "";

        }

        if(previewLogoHQ){

            previewLogoHQ.src =
                hqEditar.logo || "";

        }

        urlCapaCard = hqEditar.capa_card || null;

        urlHero = hqEditar.hero_imagem || null;

        urlLogo = hqEditar.logo || null;

      
        modalNovaHQ.style.display = "flex";

        atualizarPreviewHQ();

        document.getElementById("downloadHQ").value =
            hqEditar.download || "";

        document.getElementById("paginaHQ").value =
            hqEditar.pagina || "";

        document.getElementById("tituloOriginalHQ").value =
            hqEditar.informacoes?.tituloOriginal || "";

        document.getElementById("dataLancamentoHQ").value =
            hqEditar.informacoes?.dataLancamento || "";

        document.getElementById("tamanhoHQ").value =
            hqEditar.informacoes?.tamanho || "";

        document.getElementById("servidorHQ").value =
            hqEditar.informacoes?.servidor || "";

        document.getElementById("idiomaHQ").value =
            hqEditar.informacoes?.idioma || "";

        document.getElementById("generoHQ").value =
            hqEditar.informacoes?.genero || "";

        document.getElementById("paginasHQ").value =
            hqEditar.informacoes?.paginas || "";

        document.getElementById("downloadHQ").value =
            hqEditar.download || "";

        document.getElementById("autorHQ").value =
            hqEditar.creditos?.autor || "";

        document.getElementById("tradutorHQ").value =
            hqEditar.creditos?.tradutor || "";

        document.getElementById("coloristaHQ").value =
            hqEditar.creditos?.colorista || "";

        document.getElementById("desenhistaHQ").value =
            hqEditar.creditos?.desenhista || "";

        document.getElementById("distribuicaoHQ").value =
            hqEditar.creditos?.distribuicao || "";

        document.getElementById("sinopseHQ").value =
            hqEditar.sinopse || "";


        document.getElementById("descricaoCompletaHQ").value =
            hqEditar.descricao_completa || "";

    }

    const botaoExcluir = e.target.closest(".btnExcluirHQ");


    if(botaoExcluir){

        const idHQ = botaoExcluir.dataset.id;


        const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta HQ?"
        );


        if(!confirmar){

            return;

        }


        const { data: deletada, error } =
        await supabaseClient
            .from("hqs")
            .delete()
            .eq(
                "id",
                idHQ
            )
            .select();


        console.log(
            "Linha deletada:",
            deletada
        );


        console.log(
            "Erro delete:",
            error
        );

            console.log("ERRO DELETE:", error);


        if(error){

            console.error(
                "Erro ao excluir HQ:",
                error
            );

            alert(
                "Erro ao excluir HQ."
            );

            return;

        }


        console.log(
            "HQ excluída:",
            idHQ
        );

        const { data: verificarExclusao } =
        await supabaseClient
            .from("hqs")
            .select("id,titulo")
            .eq("id", idHQ);


        console.log(
            "ID tentando excluir:",
            idHQ
        );


        console.log(
            "Resultado após delete:",
            verificarExclusao
        );


        alert(
            "HQ excluída com sucesso."
        );


        carregarListaHQsAdmin();

    }

});


// ============================
// MODAL NOVA HQ
// ============================

const btnNovaHQ =
document.getElementById("btnNovaHQ");


const modalNovaHQ =
document.getElementById("modalNovaHQ");

const campoTituloHQ =
document.getElementById("tituloHQ");

const campoAnoHQ =
document.getElementById("anoHQ");

const campoEditoraHQ =
document.getElementById("editoraHQ");

const campoVolumeHQ =
document.getElementById("volumeHQ");

const campoEdicaoHQ =
document.getElementById("edicaoHQ");


const previewInfoHQ =
document.getElementById("previewInfoHQ");

const previewEdicaoHQ =
document.getElementById("previewEdicaoHQ");

const previewTituloHQ =
document.getElementById("previewTituloHQ");

const previewHeroTituloHQ =
document.getElementById("previewHeroTituloHQ");

const previewHeroInfoHQ =
document.getElementById("previewHeroInfoHQ");

const previewHeroEdicaoHQ =
document.getElementById("previewHeroEdicaoHQ");

const campoCapaHQ =
document.getElementById("capaHQ");

const campoCapaCardHQ =
document.getElementById("capaCardHQ");

const previewCapaHQ =
document.getElementById("previewCapaHQ");

const campoLogoHQ =
document.getElementById("logoHQ");

const mostrarLogoCardHQ =
document.getElementById("mostrarLogoCard");

const mostrarLogoHeroHQ =
document.getElementById("mostrarLogoHero");

const mostrarLogoPostHQ =
document.getElementById("mostrarLogoPost");

const previewLogoHQ =
document.getElementById("previewLogoHQ");

const previewCardCapaHQ =
document.getElementById("previewCardCapaHQ");

const previewCardLogoHQ =
document.getElementById("previewCardLogoHQ");

const previewCardTituloHQ =
document.getElementById("previewCardTituloHQ");

const previewCardInfoHQ =
document.getElementById("previewCardInfoHQ");

const previewCardEdicaoHQ =
document.getElementById("previewCardEdicaoHQ");

const previewHeroLogoArea =
document.getElementById("previewHeroLogoArea");

const previewHeroLogoHQ =
document.getElementById("previewHeroLogoHQ");

const previewPostLogoArea =
document.getElementById("previewPostLogoArea");

const previewPostLogoHQ =
document.getElementById("previewPostLogoHQ");

function fecharModalNovaHQ(){

    modalNovaHQ.style.display = "none";

}

function atualizarPreviewHQ(){

    console.log({
    previewTituloHQ,
    previewCardTituloHQ,
    previewInfoHQ,
    previewCardInfoHQ,
    previewEdicaoHQ,
    previewCardEdicaoHQ,
    previewCapaHQ,
    previewCardCapaHQ,
    previewLogoHQ,
    previewCardLogoHQ,
    previewHeroLogoHQ,
    previewPostLogoHQ,
    previewHeroLogoArea,
    previewPostLogoArea
});





    previewTituloHQ.textContent =
        campoTituloHQ.value.trim() || "Nova HQ";

    //previewCardTituloHQ.textContent =
    //    campoTituloHQ.value.trim() || "Nova HQ";

    //previewHeroTituloHQ.textContent =
    //    campoTituloHQ.value.trim() || "Nova HQ";

    //previewHeroInfoHQ.textContent =
    //   `${campoEditoraHQ.value || "Editora"} • ${campoAnoHQ.value || "Ano"}`;

    //previewHeroEdicaoHQ.textContent =
    //    `${campoVolumeHQ.value || "Volume"} • ${campoEdicaoHQ.value || "Edição"}`;

    previewInfoHQ.textContent =
        `${campoEditoraHQ.value || "Editora"} • ${campoAnoHQ.value || "Ano"}`;

    //previewCardInfoHQ.textContent =
    //    `${campoEditoraHQ.value || "Editora"} • ${campoAnoHQ.value || "Ano"}`;

    previewEdicaoHQ.textContent =
        `${campoVolumeHQ.value || "Volume"} • ${campoEdicaoHQ.value || "Edição"}`;

    //previewCardEdicaoHQ.textContent =
    //    `${campoVolumeHQ.value || "Volume"} • ${campoEdicaoHQ.value || "Edição"}`;

    if(campoCapaHQ.files.length){

            previewCapaHQ.src =
                URL.createObjectURL(campoCapaHQ.files[0]);

        }

        if(campoCapaCardHQ.files.length){

            previewCardCapaHQ.src =
                URL.createObjectURL(campoCapaCardHQ.files[0]);

        }

        if(campoLogoHQ.files.length){

        previewLogoHQ.src =
            URL.createObjectURL(campoLogoHQ.files[0]);

    }

        if(campoLogoHQ.files.length){

            previewHeroLogoHQ.src =
                URL.createObjectURL(campoLogoHQ.files[0]);

        }

        if(campoLogoHQ.files.length){

            previewPostLogoHQ.src =
                URL.createObjectURL(campoLogoHQ.files[0]);

        }

        if(campoLogoHQ.files.length){

            previewCardLogoHQ.src =
                URL.createObjectURL(campoLogoHQ.files[0]);

        }


    if(mostrarLogoCardHQ.checked){

        previewCardLogoHQ.style.display = "block";

    }else{

        previewCardLogoHQ.style.display = "none";

    }

        if(mostrarLogoHeroHQ.checked){

            previewHeroLogoArea.style.display = "block";
            previewHeroLogoHQ.style.display = "block";

        }else{

            previewHeroLogoArea.style.display = "none";
            previewHeroLogoHQ.style.display = "none";

        }

    if(mostrarLogoPostHQ.checked){

        previewPostLogoArea.style.display = "block";
        previewPostLogoHQ.style.display = "block";

    }else{

        previewPostLogoArea.style.display = "none";
        previewPostLogoHQ.style.display = "none";

    }

}


const fecharModalHQ =
document.getElementById("fecharModalHQ");



if(btnNovaHQ){

    btnNovaHQ.addEventListener(
        "click",
        () => {

            hqEditandoId = null;

            modalNovaHQ.style.display = "flex";

        }
    );

}



if(fecharModalHQ){

    fecharModalHQ.addEventListener(
        "click",
        () => {

            fecharModalNovaHQ();

        }
    );

}

if(campoTituloHQ){

    campoTituloHQ.addEventListener(
        "input",
        atualizarPreviewHQ
    );

}

if(campoCapaHQ){

    campoCapaHQ.addEventListener(
        "change",
        atualizarPreviewHQ
    );

}

if(campoCapaCardHQ){

    campoCapaCardHQ.addEventListener(
        "change",
        atualizarPreviewHQ
    );

}

if(campoLogoHQ){

    campoLogoHQ.addEventListener(
        "change",
        atualizarPreviewHQ
    );

}

if(mostrarLogoCardHQ){

    mostrarLogoCardHQ.addEventListener(
        "change",
        atualizarPreviewHQ
    );

}

if(mostrarLogoHeroHQ){

    mostrarLogoHeroHQ.addEventListener(
        "change",
        atualizarPreviewHQ
    );

}


if(mostrarLogoPostHQ){

    mostrarLogoPostHQ.addEventListener(
        "change",
        atualizarPreviewHQ
    );

}

console.log("Listener da capa ativo");

[campoAnoHQ,
 campoEditoraHQ,
 campoVolumeHQ,
 campoEdicaoHQ].forEach(campo => {

    campo.addEventListener(
        "input",
        atualizarPreviewHQ
    );

});


// ============================
// UPLOAD DE IMAGEM HQ
// ============================

async function uploadImagemHQ(arquivo, pasta){

    if(!arquivo){

        return null;

    }


    const nomeLimpo =
    arquivo.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "");


    const nomeArquivo =
    Date.now() + "-" + nomeLimpo;


    const caminho =
    pasta + "/" + nomeArquivo;



    const { error } =
    await supabaseClient
        .storage
        .from("hqs")
        .upload(
            caminho,
            arquivo
        );


    if(error){

        console.error(
            "Erro no upload:",
            error
        );

        return null;

    }



    const { data } =
    supabaseClient
        .storage
        .from("hqs")
        .getPublicUrl(
            caminho
        );


    return data.publicUrl;

}

// ============================
// CADASTRO DE HQ
// ============================

const salvarHQ =
document.getElementById("salvarHQ");


if(salvarHQ){

    salvarHQ.addEventListener(
        "click",
        async () => {



            const pastaHQ =
            Date.now();



            const novaUrlCapa =
            await uploadImagemHQ(
                document.getElementById("capaHQ").files[0],
                pastaHQ
            );

            if(novaUrlCapa){
                urlCapa = novaUrlCapa;
            }


            const novaUrlCapaCard =
            await uploadImagemHQ(
                document.getElementById("capaCardHQ").files[0],
                pastaHQ
            );

            if(novaUrlCapaCard){
                urlCapaCard = novaUrlCapaCard;
            }


            const novaUrlHero =
            await uploadImagemHQ(
                document.getElementById("heroImagemHQ").files[0],
                pastaHQ
            );

            if(novaUrlHero){
                urlHero = novaUrlHero;
            }


            const novaUrlLogo =
            await uploadImagemHQ(
                document.getElementById("logoHQ").files[0],
                pastaHQ
            );

            if(novaUrlLogo){
                urlLogo = novaUrlLogo;
            }





const novaHQ = {

    titulo:
    document.getElementById("tituloHQ").value,


    ano:
    document.getElementById("anoHQ").value,


    volume:
    document.getElementById("volumeHQ").value,

    edicao:
    document.getElementById("edicaoHQ").value,

    editora:
    document.getElementById("editoraHQ").value,


    colecao:
    document.getElementById("colecaoHQ").value,

    colecaoId:
    document.getElementById("colecaoHQ").value,

    formato:
    document.getElementById("formatoHQ").value,

    pagina:
    document.getElementById("paginaHQ").value,

    selo:
    document.getElementById("seloHQ").value,

    classificacao:
    document.getElementById("classificacaoHQ").value,

    hero:
    document.getElementById("mostrarHeroHQ").checked,


    mostrarLogoHero:
    document.getElementById("mostrarLogoHero").checked,


    mostrarLogoCard:
    document.getElementById("mostrarLogoCard").checked,


    mostrarLogoPost:
    document.getElementById("mostrarLogoPost").checked,

    capa:
    urlCapa,


    capaCard:
    urlCapaCard,


    heroImagem:
    urlHero,


    logo:
    urlLogo,

    download:
    document.getElementById("downloadHQ").value,

    informacoes: {

    tituloOriginal:
    document.getElementById("tituloOriginalHQ").value,


    dataLancamento:
    document.getElementById("dataLancamentoHQ").value,


    tamanho:
    document.getElementById("tamanhoHQ").value,


    servidor:
    document.getElementById("servidorHQ").value,


    idioma:
    document.getElementById("idiomaHQ").value,


    genero:
    document.getElementById("generoHQ").value,


    paginas:
    document.getElementById("paginasHQ").value

},


    creditos: {

    autor:
    document.getElementById("autorHQ").value,


    desenhista:
    document.getElementById("desenhistaHQ").value,


    colorista:
    document.getElementById("coloristaHQ").value,


    tradutor:
    document.getElementById("tradutorHQ").value,


    distribuicao:
    document.getElementById("distribuicaoHQ").value

},

sinopse:
document.getElementById("sinopseHQ").value,


descricaoCompleta:
document.getElementById("descricaoCompletaHQ").value

};



let resultado;


if(hqEditandoId){


    resultado =
    await supabaseClient
    .from("hqs")
    .update({

        titulo: novaHQ.titulo,

        ano: novaHQ.ano,

        volume: novaHQ.volume,

        edicao: novaHQ.edicao,

        editora: novaHQ.editora,

        colecao: novaHQ.colecao,

        colecao_id: novaHQ.colecaoId,

        formato: novaHQ.formato,

        selo: novaHQ.selo,

        classificacao: novaHQ.classificacao,

        hero: novaHQ.hero,

        mostrar_logo_hero:
        novaHQ.mostrarLogoHero,

        mostrar_logo_card:
        novaHQ.mostrarLogoCard,

        mostrar_logo_post:
        novaHQ.mostrarLogoPost,

        capa:
        novaHQ.capa,

        capa_card:
        novaHQ.capaCard,

        hero_imagem:
        novaHQ.heroImagem,

        logo:
        novaHQ.logo,

        informacoes:
        novaHQ.informacoes,

        creditos:
        novaHQ.creditos,

        download:
        novaHQ.download,

        pagina:
        novaHQ.pagina,

        sinopse:
        novaHQ.sinopse,

        descricao_completa:
        novaHQ.descricaoCompleta

    })
    .eq("id", hqEditandoId)
    .select();


}else{


    resultado =
    await supabaseClient
    .from("hqs")
    .insert({

        titulo: novaHQ.titulo,

        ano: novaHQ.ano,

        volume: novaHQ.volume,

        edicao: novaHQ.edicao,

        editora: novaHQ.editora,

        colecao: novaHQ.colecao,

        colecao_id:
        novaHQ.colecaoId,

        formato:
        novaHQ.formato,

        selo:
        novaHQ.selo,

        classificacao:
        novaHQ.classificacao,

        hero:
        novaHQ.hero,

        mostrar_logo_hero:
        novaHQ.mostrarLogoHero,

        mostrar_logo_card:
        novaHQ.mostrarLogoCard,

        mostrar_logo_post:
        novaHQ.mostrarLogoPost,

        capa:
        novaHQ.capa,

        capa_card:
        novaHQ.capaCard,

        hero_imagem:
        novaHQ.heroImagem,

        logo:
        novaHQ.logo,

        informacoes:
        novaHQ.informacoes,

        creditos:
        novaHQ.creditos,

        download:
        novaHQ.download,

        pagina:
        novaHQ.pagina,

        sinopse:
        novaHQ.sinopse,

        descricao_completa:
        novaHQ.descricaoCompleta

    })
    .select();

}


const {data, error} = resultado;


if(error){

    console.error(
        "Erro ao salvar HQ:",
        error
    );

}else{


    alert(
        "HQ salva com sucesso!"
    );


    fecharModalNovaHQ();


    carregarListaHQsAdmin();



}


        }
    );

}