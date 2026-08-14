const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const pageId = item.dataset.page;

        console.log("Abrindo página:", pageId);

        // Remove a página ativa
        pages.forEach(page => {
            page.classList.remove("active");
        });

        // Remove o item ativo do menu
        menuItems.forEach(menuItem => {
            menuItem.classList.remove("active");
        });

        // Ativa o item clicado
        item.classList.add("active");

        // Abre a página correspondente
        const page = document.getElementById(pageId);

        if (page) {

            page.classList.add("active");

        } else {

            console.error(
                "Página não encontrada:",
                pageId
            );

        }

    });

});

// =====================================
// VISUALIZAR USUÁRIO
// =====================================

function visualizarUsuario(botao) {

    const linha = botao.closest("tr");

    const nome = linha.querySelector(".admin-table-user-name").textContent.trim();

    const email = linha.querySelector(".admin-table-user-email").textContent.trim();

    const status = linha.querySelector(".admin-table-status").textContent.trim();

    const cadastro = linha.querySelector("td:nth-child(3)").textContent.trim();

    console.log("Nome:", nome);
    console.log("E-mail:", email);

    document.getElementById("modalUsuarioNome").textContent = nome;

    document.getElementById("modalUsuarioEmail").textContent = email;

    document.getElementById("modalUsuarioStatus").textContent = status;

    const statusElemento = document.getElementById(
        "modalUsuarioStatus"
    );

    statusElemento.classList.remove("ativo", "inativo");

    statusElemento.classList.add(
        status.toLowerCase()
    );

    document.getElementById("modalUsuarioCadastro").textContent = cadastro;

    const modal = document.getElementById("modalVisualizarUsuario");

    modal.classList.add("active");

}


document.addEventListener("click", function (event) {

    const botaoVisualizar = event.target.closest(
        '[data-action="visualizar-usuario"]'
    );

    if (!botaoVisualizar) return;

    visualizarUsuario(botaoVisualizar);

});

// =====================================
// FECHAR MODAL — VISUALIZAR USUÁRIO
// =====================================

const botaoFecharModal = document.getElementById(
    "fecharModalVisualizarUsuario"
);

botaoFecharModal.addEventListener("click", function () {

    const modal = document.getElementById(
        "modalVisualizarUsuario"
    );

    modal.classList.remove("active");

});

lucide.createIcons();

// =====================================
// FECHAR MODAL — CLIQUE FORA
// =====================================

const modalVisualizarUsuario = document.getElementById(
    "modalVisualizarUsuario"
);

modalVisualizarUsuario.addEventListener("click", function (event) {

    if (event.target === modalVisualizarUsuario) {

        modalVisualizarUsuario.classList.remove("active");

    }

});