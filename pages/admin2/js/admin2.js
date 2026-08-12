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