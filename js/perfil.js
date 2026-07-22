// ============================
// PERFIL DO USUÁRIO
// ============================

// Elementos do modal

const btnEditarPerfil = document.getElementById("btnEditarPerfil");
const editarPerfilModal = document.getElementById("editarPerfilModal");
const cancelarPerfil = document.getElementById("cancelarPerfil");
const editarNome = document.getElementById("editarNome");
const salvarPerfil = document.getElementById("salvarPerfil");

// ============================
// CARREGAR PERFIL
// ============================

document.addEventListener("DOMContentLoaded", () => {

    // Verifica se existe um usuário logado

    if (!Auth.isLogged()) {

        window.location.href = "../index.html";
        return;

    }

    carregarPerfil();

});

// ============================
// FORMATAR DATA DA ATIVIDADE
// ============================

function formatarDataAtividade(dataTexto) {

    const data = new Date(dataTexto);

    // Caso seja uma data antiga no formato brasileiro
    // que o navegador não consiga interpretar,
    // mostra o texto original.

    if (isNaN(data)) {

        return dataTexto;

    }

    const agora = new Date();

    const hoje = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate()
    );

    const atividade = new Date(
        data.getFullYear(),
        data.getMonth(),
        data.getDate()
    );

    const diferencaDias =
        Math.floor((hoje - atividade) / 86400000);

    const hora = data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    if (diferencaDias === 0) {

        return `Hoje às ${hora}`;

    }

    if (diferencaDias === 1) {

        return `Ontem às ${hora}`;

    }

    return data.toLocaleDateString("pt-BR") + " • " + hora;

}

// ============================
// CARREGAR ATIVIDADES
// ============================

function carregarAtividades() {

    const lista = document.getElementById("listaAtividades");

    if (!lista) return;

    const usuario = Auth.getUser();

    if (!usuario) return;

    lista.innerHTML = "";

    if (!usuario.atividades || usuario.atividades.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma atividade registrada ainda.</p>";

        return;

    }

    usuario.atividades
    .slice(0, 10)
    .forEach((atividade) => {

        const item = document.createElement("div");

        item.className = "atividade-item";

        const icone = atividade.texto.split(" ")[0];

        let classeIcone = "atividade-avatar";

        switch (icone) {

            case "⭐":
                classeIcone = "atividade-favorito";
                break;

            case "📚":
                classeIcone = "atividade-biblioteca";
                break;

            case "📖":
                classeIcone = "atividade-lida";
                break;

            case "⚙️":
                classeIcone = "atividade-config";
                break;

            default:
                classeIcone = "atividade-avatar";

        }

        item.innerHTML = `
            <div class="atividade-icone ${classeIcone}">

                ${icone}

            </div>

            <div class="atividade-conteudo">

                <p>${atividade.texto.substring(2)}</p>

                <small>${formatarDataAtividade(atividade.data)}</small>

            </div>
        `;

                lista.appendChild(item);

            });

}

// ============================
// FUNÇÃO PARA CARREGAR O PERFIL
// ============================

function carregarPerfil() {

    const usuario = Auth.getUser();

    if (!usuario) return;

    // Nome

    document.getElementById("perfilNome").textContent =
        usuario.nome;

    // E-mail

    document.getElementById("perfilEmail").textContent =
        usuario.email;

    // Data de cadastro

    document.getElementById("perfilData").textContent =
        "Membro desde: " + usuario.dataCadastro;

    // Avatar

    document.getElementById("perfilAvatar").src =
        usuario.avatar
        ? "/img/avatars/" + usuario.avatar
        : "/img/avatars/avatar.jpg";

    // Estatísticas

    document.getElementById("totalFavoritos").textContent =
        usuario.favoritos ? usuario.favoritos.length : 0;

    document.getElementById("totalBiblioteca").textContent =
        usuario.biblioteca ? usuario.biblioteca.length : 0;

    document.getElementById("totalBaixadas").textContent =
        usuario.baixadas ? usuario.baixadas.length : 0;

    carregarAtividades();
}

// ============================
// MODAL EDITAR PERFIL
// ============================

if (btnEditarPerfil && editarPerfilModal) {

    btnEditarPerfil.addEventListener("click", () => {

        const usuario = Auth.getUser();

        editarNome.value = usuario.nome;

        editarPerfilModal.style.display = "flex";

        editarNome.focus();

        editarNome.select();

    });

}

if (cancelarPerfil && editarPerfilModal) {

    cancelarPerfil.addEventListener("click", () => {

        editarPerfilModal.style.display = "none";

    });

}

if (editarPerfilModal) {

    editarPerfilModal.addEventListener("click", (e) => {

        if (e.target === editarPerfilModal) {

            editarPerfilModal.style.display = "none";

        }

    });

}

// Fecha o modal com a tecla ESC

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        editarPerfilModal.style.display = "none";

    }

});
// ============================
// SALVAR PERFIL
// ============================

if (salvarPerfil) {

    salvarPerfil.addEventListener("click", () => {

        const usuario = Auth.getUser();

        const novoNome = editarNome.value.trim();

if (novoNome === "") {

    alert("Digite um nome.");

    editarNome.focus();

    return;

}

usuario.nome = novoNome;

Auth.updateUser(usuario);

editarPerfilModal.style.display = "none";;

    });

}

// ============================
// TROCAR AVATAR
// ============================

const btnTrocarAvatar = document.getElementById("btnTrocarAvatar");

const btnTrocarAvatarTexto = document.getElementById("btnTrocarAvatarTexto");

const avatarModal = document.getElementById("avatarModal");

const listaAvatares = document.getElementById("listaAvatares");

const fecharAvatarModal = document.getElementById("fecharAvatarModal");

const salvarAvatar = document.getElementById("salvarAvatar");

// Abre modal de avatar

function abrirModalAvatar(){

    avatarModal.style.display = "flex";

}

// ============================
// CARREGAR AVATARES
// ============================

let avatarSelecionado = null;


const avatares = [

    "avatar1.jpg",
    "avatar2.jpg",
    "avatar3.jpg"

];

if (listaAvatares) {

    avatares.forEach((avatar) => {


        const imagem = document.createElement("img");


        imagem.src = "/img/avatars/" + avatar;

        imagem.alt = "Avatar";


        imagem.addEventListener("click", () => {


            // remove seleção dos outros avatares

            document
            .querySelectorAll(".avatar-grid img")
            .forEach((img) => {

                img.classList.remove("selecionado");

            });


            // seleciona o avatar clicado

            imagem.classList.add("selecionado");


            avatarSelecionado = avatar;

            console.log("Avatar selecionado:", avatarSelecionado);


        });


        listaAvatares.appendChild(imagem);


    });

}


// Clique na foto

if (btnTrocarAvatar) {

    btnTrocarAvatar.addEventListener("click", () => {

        abrirModalAvatar();

    });

}


// Clique no botão

if (btnTrocarAvatarTexto) {

    btnTrocarAvatarTexto.addEventListener("click", () => {

        abrirModalAvatar();

    });

}

if (fecharAvatarModal) {

    fecharAvatarModal.addEventListener("click", () => {

        avatarModal.style.display = "none";

    });

}

// ============================
// SALVAR AVATAR
// ============================

if (salvarAvatar) {

    salvarAvatar.addEventListener("click", () => {


        if (!avatarSelecionado) {

            alert("Escolha um avatar.");

            return;

        }


        const usuario = Auth.getUser();


        if (!usuario) return;


        usuario.avatar = avatarSelecionado;

        Auth.updateUser(usuario);

        Auth.addActivity("📷 Você alterou seu avatar.");

        avatarModal.style.display = "none";


    });

}

// Fecha o modal clicando fora

if (avatarModal) {

    avatarModal.addEventListener("click", (e) => {

        if (e.target === avatarModal) {

            avatarModal.style.display = "none";

        }

    });

}

// ============================
// ATUALIZAÇÃO DO PERFIL
// ============================

window.addEventListener("authChanged", () => {

    const usuarioAtual = Auth.getUser();

    if (!usuarioAtual) {

        window.location.href = "../index.html";
        return;

    }

    carregarPerfil();

});

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