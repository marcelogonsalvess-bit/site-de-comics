Chart.register(ChartDataLabels);
let hqEditandoId = null;

let paginaHQAdmin = 1;

const limiteHQAdmin = 18;

let buscaHQAdmin = "";


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


    const acessoNegado =
    document.getElementById("adminAcessoNegado");


    if(acessoNegado){

        acessoNegado.style.display = "flex";

    }


    return;

}



    console.log(
        "Administrador confirmado"
    );

    const telaLoading =
    document.getElementById("adminLoading");


    if(telaLoading){

        telaLoading.remove();

    }


}



// ============================
// CARREGAR ESTATÍSTICAS
// ============================

async function carregarEstatisticas(){

        // VISITAS

    const { count: totalVisitas, error: erroVisitas } =
    await supabaseClient
        .from("visitas")
        .select("*", {
            count:"exact",
            head:true
        });

        document.getElementById(
            "totalVisitas"
        ).textContent = totalVisitas;

        

// VISITAS HOJE

const inicioHoje = new Date();

inicioHoje.setHours(
    0,
    0,
    0,
    0
);


const { count: visitasHoje, error: erroVisitasHoje } =
await supabaseClient
    .from("visitas")
    .select("*", {
        count:"exact",
        head:true
    })
    .gte(
        "created_at",
        inicioHoje.toISOString()
    );


console.log(
    "VISITAS HOJE:",
    visitasHoje
);

document.getElementById(
    "crescimentoVisitas"
).textContent =
`Hoje: ${visitasHoje}`;


if(erroVisitasHoje){

    console.error(
        "Erro ao buscar visitas de hoje:",
        erroVisitasHoje
    );

}


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


    // ============================
// USUÁRIOS MAIS ATIVOS
// ============================


const { data: rankingAtividades } =
await supabaseClient
    .from("atividades")
    .select("id_usuario");


const contadorUsuarios = {};


(rankingAtividades || []).forEach(item => {

    if(!item.id_usuario) return;


    contadorUsuarios[item.id_usuario] =
    (contadorUsuarios[item.id_usuario] || 0) + 1;

});


const usuariosMaisAtivos =
Object.entries(contadorUsuarios)
.sort((a,b)=> b[1] - a[1])
.slice(0,3);


console.log(
    "RANKING USUÁRIOS:",
    usuariosMaisAtivos
);


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

// ============================
// USUÁRIOS MAIS ATIVOS
// ============================


const { data: usuariosRanking } =
await supabaseClient
    .from("atividades")
    .select("id_usuario");


const contagemUsuarios = {};


(usuariosRanking || []).forEach(item => {

    if(!item.id_usuario) return;


    contagemUsuarios[item.id_usuario] =
    (contagemUsuarios[item.id_usuario] || 0) + 1;

});


const rankingUsuarios =
Object.entries(contagemUsuarios)
.sort((a,b)=> b[1] - a[1])
.slice(0,3);


console.log(
    "RANKING FINAL:",
    rankingUsuarios
);



const idsUsuariosAtivos =
rankingUsuarios.map(item => item[0]);


const { data: perfisAtivos } =
await supabaseClient
    .from("perfis")
    .select("id_auth, nome, avatar")
    .in(
        "id_auth",
        idsUsuariosAtivos
    );


console.log(
    "PERFIS ATIVOS:",
    perfisAtivos
);

const painelUsuariosAtivos =
document.getElementById("painelUsuariosAtivos");


if(painelUsuariosAtivos){

    painelUsuariosAtivos.innerHTML = "";


    (perfisAtivos || []).forEach(usuario => {


        painelUsuariosAtivos.innerHTML += `

        <div class="usuario-ativo-item">


            <img
            src="../img/avatars/${usuario.avatar || "avatar1.jpg"}"
            class="user-card-avatar"
            alt="${usuario.nome}">


            <h4>
            ${usuario.nome}
            </h4>


        </div>

        `;


    });

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

    lista.innerHTML = "";

    const hqsFiltradas =
        buscaHQAdmin
            ? hqs.filter(hq =>
                hq.titulo
                .toLowerCase()
                .includes(buscaHQAdmin)
            )
            : hqs;


    const inicio =
        (paginaHQAdmin - 1) * limiteHQAdmin;


    const fim =
        inicio + limiteHQAdmin;


    const hqsPagina =
        hqsFiltradas.slice(inicio, fim);

    const totalPaginas =
        Math.ceil(hqsFiltradas.length / limiteHQAdmin);

        if(totalPaginas <= 1){

            document.getElementById("paginacaoHQAdmin").innerHTML = "";

        }else{

            // cria os botões de paginação

        }

        const paginacao =
            document.getElementById("paginacaoHQAdmin");

        paginacao.innerHTML = "";


        if(totalPaginas > 1){


            if(paginaHQAdmin > 1){

                paginacao.innerHTML += `
                    <button data-pagina="${paginaHQAdmin - 1}">
                        ←
                    </button>
                `;

            }


            if(paginaHQAdmin - 1 >= 1){

                paginacao.innerHTML += `
                    <button data-pagina="${paginaHQAdmin - 1}">
                        ${paginaHQAdmin - 1}
                    </button>
                `;

            }


            paginacao.innerHTML += `
                <button class="pagina-atual">
                    ${paginaHQAdmin}
                </button>
            `;


            if(paginaHQAdmin + 1 <= totalPaginas){

                paginacao.innerHTML += `
                    <button data-pagina="${paginaHQAdmin + 1}">
                        ${paginaHQAdmin + 1}
                    </button>
                `;

            }


            if(paginaHQAdmin < totalPaginas){

                paginacao.innerHTML += `
                    <button data-pagina="${paginaHQAdmin + 1}">
                        →
                    </button>
                `;

            }


        }

        paginacao.querySelectorAll("button").forEach(botao => {

            botao.addEventListener("click", () => {

                paginaHQAdmin =
                    Number(botao.dataset.pagina);

                carregarListaHQsAdmin();

            });

        });

    console.log(
        "Total de páginas:",
        totalPaginas
    );


    hqsPagina.forEach(hq => {


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

        document.getElementById("salvarHQ").textContent = "Atualizar HQ";

      

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

        document.getElementById("capaURLHQ").value =
            hqEditar.capa || "";

        }

        if(previewLogoHQ){

            previewLogoHQ.src =
                hqEditar.logo || "";

        }

        urlCapaCard = hqEditar.capa_card || null;

        document.getElementById("capaCardURLHQ").value =
            hqEditar.capa_card || "";

        if(previewCardCapaHQ){

            previewCardCapaHQ.src =
                hqEditar.capa_card || "";

        }

        urlHero = hqEditar.hero_imagem || null;

        document.getElementById("heroImagemURLHQ").value =
            hqEditar.hero_imagem || "";


        if(previewHeroImagemHQ){

            previewHeroImagemHQ.src =
                hqEditar.hero_imagem || "";

        }

        urlLogo = hqEditar.logo || null;

        document.getElementById("logoURLHQ").value =
        hqEditar.logo || "";

      
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

        atualizarPreviewHQ();

    }

    const botaoExcluir = e.target.closest(".btnExcluirHQ");


    if(botaoExcluir){

        console.log("ELEMENTO QUE DISPAROU:", e.target);
        console.log("BOTAO ENCONTRADO:", botaoExcluir);
        console.log("CHAMANDO MODAL");

        const idHQ = botaoExcluir.dataset.id;

        console.log("FUNÇÃO MODAL:", typeof abrirConfirmacao);

        const resposta = await abrirConfirmacao();

if (!resposta) {

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

if (error) {

    console.error(
        "ERRO DELETE:",
        error
    );

    return;

}

await carregarListaHQsAdmin();


        //console.log(
        //    "Erro delete:",
        //    error
        //);

        //   console.log("ERRO DELETE:", error);


        //if(error){

        //    console.error(
        //        "Erro ao excluir HQ:",
        //        error
        //    );

        //    alert(
        //        "Erro ao excluir HQ."
        //   );

        //    return;

        //}


        

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

const campoSinopseHQ =
document.getElementById("sinopseHQ");

const campoVolumeHQ =
document.getElementById("volumeHQ");

const campoEdicaoHQ =
document.getElementById("edicaoHQ");


const previewInfoHQ =
document.getElementById("previewInfoHQ");

const previewEdicaoHQ =
document.getElementById("previewEdicaoHQ");

const previewHeroTituloHQ =
document.getElementById("previewHeroTituloHQ");

const previewHeroInfoHQ =
document.getElementById("previewHeroInfoHQ");

const previewHeroEdicaoHQ =
document.getElementById("previewHeroEdicaoHQ");

const campoCapaHQ =
document.getElementById("capaHQ");

const campoCapaURLHQ =
document.getElementById("capaURLHQ");

if(campoCapaURLHQ){

    campoCapaURLHQ.addEventListener("input", ()=>{

        atualizarPreviewHQ();

    });

}


const campoCapaCardHQ =
document.getElementById("capaCardHQ");

const campoCapaCardURLHQ =
document.getElementById("capaCardURLHQ");

if(campoCapaCardURLHQ){

    campoCapaCardURLHQ.addEventListener("input", ()=>{

        atualizarPreviewHQ();

    });

}

const previewCapaHQ =
document.getElementById("previewCapaHQ");

const campoLogoHQ =
document.getElementById("logoHQ");

const campoLogoURLHQ =
document.getElementById("logoURLHQ");

if(campoLogoURLHQ){

    campoLogoURLHQ.addEventListener("input", ()=>{

        atualizarPreviewHQ();

    });

}

const campoHeroImagemHQ =
document.getElementById("heroImagemHQ");

const campoHeroImagemURLHQ =
document.getElementById("heroImagemURLHQ");

if(campoHeroImagemURLHQ){

    campoHeroImagemURLHQ.addEventListener("input", ()=>{

        atualizarPreviewHQ();

    });

}

const previewHeroImagemHQ =
document.getElementById("previewHeroImagemHQ");

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

function limparFormularioNovaHQ(){

    document.querySelectorAll("#modalNovaHQ input").forEach(campo => {

        console.log(
            "INPUTS LIMPOS:",
            document.querySelectorAll("#modalNovaHQ input").length
        );

        if(campo.type === "checkbox"){

            campo.checked = false;

        }else if(campo.type === "file"){

            campo.value = "";

        }else{

            campo.value = "";

        }

    });

    document.getElementById("anoHQ").value = "";
    document.getElementById("volumeHQ").value = "";
    document.getElementById("edicaoHQ").value = "";

    console.log(
        "ANO:",
        document.getElementById("anoHQ").value,
        "VOLUME:",
        document.getElementById("volumeHQ").value,
        "EDICAO:",
        document.getElementById("edicaoHQ").value
    );

    document.querySelectorAll("#modalNovaHQ textarea").forEach(campo => {

        campo.value = "";

    });

    console.log(
        "TITULO LIMPO:",
        document.getElementById("tituloHQ").value
    );

    if(previewCapaHQ){

    previewCapaHQ.src = "";

}


if(previewHeroImagemHQ){

    previewHeroImagemHQ.src = "";

}


if(previewCardCapaHQ){

    previewCardCapaHQ.src = "";

}


if(previewLogoHQ){

    previewLogoHQ.src = "";

}

if(previewInfoHQ){

    previewInfoHQ.textContent = "";

}


if(previewEdicaoHQ){

    previewEdicaoHQ.textContent = "";

}


if(previewSinopseHQ){

    previewSinopseHQ.textContent = "";

}

if(previewCardTituloHQ){

    previewCardTituloHQ.textContent = "";

}


if(previewCardInfoHQ){

    previewCardInfoHQ.textContent = "";

}


if(previewCardEdicaoHQ){

    previewCardEdicaoHQ.textContent = "";

}

console.log("LIMPEZA EXECUTADA");

}

let tempoBuscaHQAdmin;

const campoBuscaHQAdmin =
document.getElementById("buscaHQAdmin");


if(campoBuscaHQAdmin){

    campoBuscaHQAdmin.addEventListener("keydown", (e)=>{

        if(e.key !== "Enter"){

            return;

        }


        clearTimeout(tempoBuscaHQAdmin);


        tempoBuscaHQAdmin = setTimeout(()=>{


            buscaHQAdmin =
                e.target.value.toLowerCase();


            paginaHQAdmin = 1;


            carregarListaHQsAdmin();


        },300);


    });

}

function atualizarPreviewHQ(){


    

    //previewCardTituloHQ.textContent =
    //    campoTituloHQ.value.trim() || "Nova HQ";

    //previewHeroTituloHQ.textContent =
    //    campoTituloHQ.value.trim() || "Nova HQ";

    //previewHeroInfoHQ.textContent =
    //   `${campoEditoraHQ.value || "Editora"} • ${campoAnoHQ.value || "Ano"}`;

    //previewHeroEdicaoHQ.textContent =
    //    `${campoVolumeHQ.value || "Volume"} • ${campoEdicaoHQ.value || "Edição"}`;

    previewInfoHQ.textContent =
        `${campoAnoHQ.value || "Ano"}`;

    previewSinopseHQ.textContent =
        campoSinopseHQ.value.trim() || "Sinopse da HQ";

    //previewCardInfoHQ.textContent =
    //    `${campoEditoraHQ.value || "Editora"} • ${campoAnoHQ.value || "Ano"}`;

    previewEdicaoHQ.textContent =
        `Volume ${campoVolumeHQ.value || "1"}   Edição ${campoEdicaoHQ.value || "10"}`;

    //previewCardEdicaoHQ.textContent =
    //    `${campoVolumeHQ.value || "Volume"} • ${campoEdicaoHQ.value || "Edição"}`;

    if(previewCapaHQ){

        if(campoCapaHQ.files.length){

            previewCapaHQ.src =
                URL.createObjectURL(
                    campoCapaHQ.files[0]
                );

        }else if(campoCapaURLHQ.value.trim()){

            previewCapaHQ.src =
                campoCapaURLHQ.value.trim();

        }

    }

    if(previewHeroImagemHQ){

        if(campoHeroImagemHQ.files.length){

            previewHeroImagemHQ.src =
                URL.createObjectURL(
                    campoHeroImagemHQ.files[0]
                );

        }else if(campoHeroImagemURLHQ.value.trim()){

            previewHeroImagemHQ.src =
                campoHeroImagemURLHQ.value.trim();

        }

    }

    if(previewCardCapaHQ){

        if(campoCapaCardHQ.files.length){

            previewCardCapaHQ.src =
                URL.createObjectURL(
                    campoCapaCardHQ.files[0]
                );

        }else if(campoCapaCardURLHQ.value.trim()){

            previewCardCapaHQ.src =
                campoCapaCardURLHQ.value.trim();

        }

    }

        if(campoLogoHQ.files.length){

            const logoPreview =
            URL.createObjectURL(
                campoLogoHQ.files[0]
            );


            if(previewLogoHQ){

                previewLogoHQ.src =
                logoPreview;

            }

        }else if(campoLogoURLHQ.value.trim()){


            if(previewLogoHQ){

                previewLogoHQ.src =
                campoLogoURLHQ.value.trim();

            }

        }


    if(mostrarLogoCardHQ && previewCardLogoHQ){

        if(mostrarLogoCardHQ.checked){

            previewCardLogoHQ.style.display = "block";

        }else{

            previewCardLogoHQ.style.display = "none";

        }

    }

        if(mostrarLogoHeroHQ && previewHeroLogoArea && previewHeroLogoHQ){

            if(mostrarLogoHeroHQ.checked){

                previewHeroLogoArea.style.display = "block";
                previewHeroLogoHQ.style.display = "block";

            }else{

                previewHeroLogoArea.style.display = "none";
                previewHeroLogoHQ.style.display = "none";

            }

        }

    if(mostrarLogoPostHQ && previewPostLogoArea && previewPostLogoHQ){

        if(mostrarLogoPostHQ.checked){

            previewPostLogoArea.style.display = "block";
            previewPostLogoHQ.style.display = "block";

        }else{

            previewPostLogoArea.style.display = "none";
            previewPostLogoHQ.style.display = "none";

        }

    }

}


if(btnNovaHQ){

    btnNovaHQ.addEventListener(
        "click",
        () => {

            hqEditandoId = null;

            limparFormularioNovaHQ();

            document.getElementById("salvarHQ").textContent = "Salvar HQ";

            modalNovaHQ.style.display = "flex";

            console.log("NOVA HQ ABERTA");

            console.log(
                "ANO APÓS ABRIR:",
                document.getElementById("anoHQ").value
            );

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

    campoHeroImagemHQ.addEventListener(
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
 campoEdicaoHQ,
 campoSinopseHQ].forEach(campo => {

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

let urlCapa = "";
let urlCapaCard = "";
let urlHero = "";
let urlLogo = "";

if(salvarHQ){

    salvarHQ.addEventListener(
        "click",
        async () => {


            const confirmar = confirm(
                hqEditandoId
                    ? "Atualizar esta HQ?"
                    : "Publicar esta HQ?"
            );

            if(!confirmar){

                return;

            }

            salvarHQ.disabled = true;

            salvarHQ.textContent = hqEditandoId
                ? "Atualizando..."
                : "Publicando...";

            console.log("COMEÇOU PUBLICAÇÃO");

            const titulo =
            document.getElementById("tituloHQ").value.trim();


            if(!titulo){

                alert("Digite o título da HQ antes de publicar.");

                return;

            }

 const capa = document.getElementById("capaHQ").files[0];

const capaURL =
document.getElementById("capaURLHQ").value.trim();

// Só exige capa ao criar uma HQ nova
if (!hqEditandoId && !capa && !capaURL) {

    alert("Adicione uma capa antes de publicar.");
    return;

}

const hero = document.getElementById("heroImagemHQ").files[0];

// Só exige hero ao criar uma HQ nova
const heroURL =
document.getElementById("heroImagemURLHQ").value.trim();


if (!hqEditandoId && !hero && !heroURL) {

    alert("Adicione uma imagem de banner antes de publicar.");
    return;

}

// ADICIONE ESTAS DUAS LINHAS
const capaCard = document.getElementById("capaCardHQ").files[0];

const capaCardURL =
document.getElementById("capaCardURLHQ").value.trim();

const logo = document.getElementById("logoHQ").files[0];

const fecharDepoisSalvar =
document.getElementById("fecharModalDepoisSalvar").checked;
            const pastaHQ =
            Date.now();


            if (capa) {

                const novaUrlCapa = await uploadImagemHQ(capa, pastaHQ);

                if (novaUrlCapa) {
                    urlCapa = novaUrlCapa;
                }

            }else if(capaURL){

                urlCapa = capaURL;

            }

            if (capaCard) {

                const novaUrlCapaCard = await uploadImagemHQ(capaCard, pastaHQ);

                if (novaUrlCapaCard) {
                    urlCapaCard = novaUrlCapaCard;
                }

            }else if(capaCardURL){

                urlCapaCard = capaCardURL;

            }

            if(heroImagemURLHQ.value.trim()){

                urlHero = heroImagemURLHQ.value.trim();

            }else if(hero){

                const novaUrlHero =
                    await uploadImagemHQ(hero, pastaHQ);

                if(novaUrlHero){

                    urlHero = novaUrlHero;

                }

            }

            if(campoLogoURLHQ.value.trim()){

                urlLogo = campoLogoURLHQ.value.trim();

            }else if(logo){

                const novaUrlLogo =
                    await uploadImagemHQ(logo, pastaHQ);

                if(novaUrlLogo){

                    urlLogo = novaUrlLogo;

                }

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

function gerarSlug(texto){

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}

novaHQ.slug = gerarSlug(novaHQ.titulo);

let resultado;


if(hqEditandoId){


    resultado =
    await supabaseClient
    .from("hqs")
    .update({

        titulo: novaHQ.titulo,

        slug: novaHQ.slug,

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

        slug: novaHQ.slug,

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

    console.log("CHEGOU NO FINAL DO SALVAR");

    salvarHQ.disabled = false;

    salvarHQ.textContent = "Salvar HQ";




}


const {data, error} = resultado;


if(error){

    console.error(
        "Erro ao salvar HQ:",
        error
    );

}else{


    alert(
        hqEditandoId
            ? "HQ atualizada com sucesso!"
            : "HQ salva com sucesso!"
    );




    carregarListaHQsAdmin();

    if(fecharDepoisSalvar){

        fecharModalNovaHQ();

    }else{

        limparFormularioNovaHQ();

    }

}


        }
    );

    document.addEventListener("click", (e)=>{

    if(e.target.id === "voltarInicioAdmin"){

        window.location.href = "../index.html";

    }

});

}




