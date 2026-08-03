console.log("PERFIL.JS CARREGOU");
// ============================
// PERFIL DO USUÁRIO
// ============================


// ============================
// ELEMENTOS DO MODAL EDITAR PERFIL
// ============================

const btnEditarPerfil =
document.getElementById("btnEditarPerfil");

const editarPerfilModal =
document.getElementById("editarPerfilModal");

const cancelarPerfil =
document.getElementById("cancelarPerfil");

const editarNome =
document.getElementById("editarNome");

const salvarPerfil =
document.getElementById("salvarPerfil");


// ============================
// BUSCAR PERFIL NO SUPABASE
// ============================

async function buscarPerfil(){


    const usuarioAuth =
    await Auth.getUser();


    if(!usuarioAuth){

        return null;

    }



    const { data, error } =
    await supabaseClient
    .from("perfis")
    .select("*")
    .eq("id_auth", usuarioAuth.id)
    .single();

    console.log("Usuário Auth:", usuarioAuth);

    console.log("Perfil encontrado:", data);



    if(error){

        console.error(
            "Erro ao buscar perfil:",
            error
        );

        return null;

    }



    return data;


}



// ============================
// CARREGAR PÁGINA
// ============================


document.addEventListener(
"DOMContentLoaded",
async () => {


    const usuarioAuth =
    await Auth.getUser();



    if(!usuarioAuth){

        window.location.href =
        "../index.html";

        return;

    }



    await carregarPerfil();


    await carregarFavoritos();


    await carregarAtividades();


});



// ============================
// FORMATAR DATA
// ============================


function formatarDataAtividade(dataTexto){


    const data =
    new Date(dataTexto);



    if(isNaN(data)){

        return dataTexto;

    }



    const agora =
    new Date();



    const hoje =
    new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate()
    );



    const atividade =
    new Date(
        data.getFullYear(),
        data.getMonth(),
        data.getDate()
    );



    const diferencaDias =
    Math.floor(
        (hoje - atividade)
        /
        86400000
    );



    const hora =
    data.toLocaleTimeString(
        "pt-BR",
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );



    if(diferencaDias === 0){

        return `Hoje às ${hora}`;

    }



    if(diferencaDias === 1){

        return `Ontem às ${hora}`;

    }



    return (
        data.toLocaleDateString("pt-BR")
        +
        " • "
        +
        hora
    );


}



// ============================
// CARREGAR PERFIL
// ============================


async function carregarPerfil(){


    const perfil =
    await buscarPerfil();



    const usuarioAuth =
    await Auth.getUser();



    if(!perfil){

        console.error(
            "Perfil não encontrado"
        );

        return;

    }



    document.getElementById(
        "perfilNome"
    ).textContent =
    perfil.nome || "Usuário";



    document.getElementById(
        "perfilEmail"
    ).textContent =
    usuarioAuth.email;



    document.getElementById(
        "perfilData"
    ).textContent =
    "Membro desde: "
    +
    new Date(
        perfil.created_at
    )
    .toLocaleDateString(
        "pt-BR"
    );



    document.getElementById(
        "perfilAvatar"
    ).src =
    perfil.avatar
    ?
    "/img/avatars/" + perfil.avatar
    :
    "/img/avatars/avatar.jpg";



    const { count: totalFavoritos } =
await supabaseClient
.from("favoritos")
.select("*", {
    count: "exact",
    head: true
})
.eq("id_usuario", usuarioAuth.id);

    document.getElementById(
        "totalFavoritos"
    ).textContent =
    totalFavoritos || 0;



    const { count: totalBiblioteca } =
    await supabaseClient
    .from("biblioteca")
    .select("*", {
        count: "exact",
        head: true
    })
    .eq("id_usuario", usuarioAuth.id);

    document.getElementById(
        "totalBiblioteca"
    ).textContent =
    totalBiblioteca || 0;



    const { count: totalDownloads } =
    await supabaseClient
    .from("downloads")
    .select("*", {
        count: "exact",
        head: true
    })
    .eq("id_usuario", usuarioAuth.id);

    document.getElementById(
        "totalBaixadas"
    ).textContent =
    totalDownloads || 0;


}
// ============================
// CARREGAR ATIVIDADES
// ============================


async function carregarAtividades(){


    const lista =
    document.getElementById(
        "listaAtividades"
    );



    if(!lista){

        return;

    }



    const perfil =
    await buscarPerfil();



    if(
        !perfil ||
        !perfil.atividades ||
        perfil.atividades.length === 0
    ){

        lista.innerHTML =
        "<p>Nenhuma atividade registrada ainda.</p>";

        return;

    }



    lista.innerHTML = "";



    perfil.atividades
    .slice(0,10)
    .forEach(
    atividade => {



        const item =
        document.createElement(
            "div"
        );



        item.className =
        "atividade-item";



        const emoji = atividade.texto
    ? atividade.texto.split(" ")[0]
    : "⚙️";

let classeIcone = "atividade-avatar";
let icone = '<i class="fa-solid fa-user"></i>';

switch (emoji) {

    case "❤️":
        classeIcone = "atividade-favorito";
        icone = '<i class="fa-solid fa-heart"></i>';
        break;

    case "📚":
        classeIcone = "atividade-biblioteca";
        icone = '<i class="fa-solid fa-book"></i>';
        break;

    case "📖":
        classeIcone = "atividade-lida";
        icone = '<i class="fa-solid fa-book-open"></i>';
        break;

    case "⬇️":
        classeIcone = "atividade-download";
        icone = '<i class="fa-solid fa-download"></i>';
        break;

    case "⚙️":
        classeIcone = "atividade-config";
        icone = '<i class="fa-solid fa-gear"></i>';
        break;
}

        item.innerHTML = `

            <div class="atividade-icone ${classeIcone}">

                ${icone}

            </div>


            <div class="atividade-conteudo">


                <p>
                    ${
                        ["❤️", "💔", "📚", "📖", "⬇️", "⚙️"].includes(emoji)
                            ? atividade.texto.split(" ").slice(1).join(" ")
                            : atividade.texto
                    }
                </p>


                <small>
                    ${formatarDataAtividade(
                        atividade.data
                    )}
                </small>


            </div>

        `;



        lista.appendChild(item);


    });


}



// ============================
// SALVAR ALTERAÇÃO DE NOME
// ============================


if(salvarPerfil){


    salvarPerfil.addEventListener(
    "click",
    async () => {


        const novoNome =
        editarNome.value.trim();



        if(!novoNome){


            alert(
                "Digite um nome."
            );


            editarNome.focus();


            return;


        }



        const usuarioAuth =
        await Auth.getUser();



        const { error } =
        await supabaseClient
        .from("perfis")
        .update({

            nome:
            novoNome

        })
        .eq("id_auth", usuarioAuth.id);



        if(error){


            console.error(
                "Erro ao atualizar nome:",
                error
            );


            alert(
                "Erro ao salvar nome."
            );


            return;


        }



        editarPerfilModal.style.display =
        "none";



        await carregarPerfil();


    });


}



// ============================
// ABRIR MODAL EDITAR PERFIL
// ============================


if(
    btnEditarPerfil &&
    editarPerfilModal
){


    btnEditarPerfil.addEventListener(
    "click",
    async () => {



        const perfil =
        await buscarPerfil();



        if(!perfil){

            return;

        }



        editarNome.value =
        perfil.nome;



        editarPerfilModal.style.display =
        "flex";



        editarNome.focus();



        editarNome.select();


    });


}



// ============================
// CANCELAR EDIÇÃO
// ============================


if(
    cancelarPerfil &&
    editarPerfilModal
){


    cancelarPerfil.addEventListener(
    "click",
    () => {


        editarPerfilModal.style.display =
        "none";


    });


}



// ============================
// FECHAR CLICANDO FORA
// ============================


if(editarPerfilModal){


    editarPerfilModal.addEventListener(
    "click",
    e => {


        if(
            e.target === editarPerfilModal
        ){

            editarPerfilModal.style.display =
            "none";

        }


    });


}



// ============================
// ESC FECHA MODAL
// ============================


document.addEventListener(
"keydown",
e => {


    if(
        e.key === "Escape" &&
        editarPerfilModal
    ){

        editarPerfilModal.style.display =
        "none";

    }


});
// ============================
// TROCAR AVATAR
// ============================


const btnTrocarAvatar =
document.getElementById(
    "btnTrocarAvatar"
);


const btnTrocarAvatarTexto =
document.getElementById(
    "btnTrocarAvatarTexto"
);


const avatarModal =
document.getElementById(
    "avatarModal"
);


const listaAvatares =
document.getElementById(
    "listaAvatares"
);


const fecharAvatarModal =
document.getElementById(
    "fecharAvatarModal"
);


const salvarAvatar =
document.getElementById(
    "salvarAvatar"
);



let avatarSelecionado =
null;



const avatares = [

    "avatar1.jpg",
    "avatar2.jpg",
    "avatar3.jpg",
    "avatar4.jpg",
    "avatar5.jpg",
    "avatar6.jpg",
    "avatar7.jpg",
    "avatar8.jpg",
    "avatar9.jpg",
    "avatar10.jpg",
    "avatar11.jpg",
    "avatar12.jpg"


];



// ============================
// CARREGAR OPÇÕES DE AVATAR
// ============================


if(listaAvatares){


    avatares.forEach(
    avatar => {


        const imagem =
        document.createElement(
            "img"
        );



        imagem.src =
        "/img/avatars/"
        +
        avatar;



        imagem.alt =
        "Avatar";



        imagem.addEventListener(
        "click",
        () => {



            document
            .querySelectorAll(
                ".avatar-grid img"
            )
            .forEach(
            img => {


                img.classList.remove(
                    "selecionado"
                );


            });



            imagem.classList.add(
                "selecionado"
            );



            avatarSelecionado =
            avatar;



        });



        listaAvatares.appendChild(
            imagem
        );


    });


}



// ============================
// ABRIR MODAL AVATAR
// ============================


function abrirModalAvatar(){


    if(avatarModal){


        avatarModal.style.display =
        "flex";


    }


}




if(btnTrocarAvatar){


    btnTrocarAvatar.addEventListener(
    "click",
    () => {


        abrirModalAvatar();


    });


}



if(btnTrocarAvatarTexto){


    btnTrocarAvatarTexto.addEventListener(
    "click",
    () => {


        abrirModalAvatar();


    });


}




// ============================
// SALVAR AVATAR
// ============================


if(salvarAvatar){


    salvarAvatar.addEventListener(
    "click",
    async () => {



        if(!avatarSelecionado){


            alert(
                "Escolha um avatar."
            );


            return;


        }



        const usuarioAuth =
        await Auth.getUser();


        const { error } =
        await supabaseClient
        .from("perfis")
        .update({

            avatar:
            avatarSelecionado

        })
        .eq("id_auth", usuarioAuth.id);



        if(error){


            console.error(
                "Erro ao salvar avatar:",
                error
            );


            alert(
                "Erro ao salvar avatar."
            );


            return;


        }



        avatarModal.style.display =
        "none";



        await carregarPerfil();


        location.reload();


    });


}



// ============================
// FECHAR MODAL AVATAR
// ============================


if(fecharAvatarModal){


    fecharAvatarModal.addEventListener(
    "click",
    () => {


        avatarModal.style.display =
        "none";


    });


}



if(avatarModal){


    avatarModal.addEventListener(
    "click",
    e => {


        if(
            e.target === avatarModal
        ){

            avatarModal.style.display =
            "none";

        }


    });


}
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

        console.error("Erro ao carregar favoritos:", error);

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


// ============================
// ATUALIZAR PERFIL QUANDO LOGIN MUDA
// ============================


window.addEventListener(
"authChanged",
async () => {


    const usuario =
    await Auth.getUser();



    if(!usuario){


        window.location.href =
        "../index.html";


        return;


    }



    await carregarPerfil();


    await carregarFavoritos();


    await carregarAtividades();


});



// ============================
// FIM DO PERFIL
// ============================