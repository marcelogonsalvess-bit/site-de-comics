// ============================
// CARREGAR COMPONENTE
// ============================

function loadComponent(id, file) {

    return fetch(file)
        .then(response => response.text())
        .then(data => {

            document.getElementById(id).innerHTML = data;

        });

}


// ============================
// QUANDO A PÁGINA CARREGAR
// ============================

document.addEventListener("DOMContentLoaded", () => {


    // Detecta profundidade da página

    let basePath = "";


    if(window.location.pathname.includes("/pages/")){

        basePath = "../";

    }


    if(window.location.pathname.includes("/colecoes/")){

        basePath = "../";

    }


    if(window.location.pathname.includes("/editoras/")){

        basePath = "../";

    }


    if(window.location.pathname.includes("/hqs/")){

    basePath = "../../../";

}


    Promise.all([


        loadComponent(
            "header",
            basePath + "components/header.html"
        ),


        loadComponent(
            "footer",
            basePath + "components/footer.html"
        ),


        loadComponent(
            "auth",
            basePath + "components/auth-modal.html"
        )


    ])
    .then(() => {


        if(typeof initMobileMenu === "function"){

         initMobileMenu();

    }

        console.log("Componentes carregados");

        if(typeof initAuth === "function"){

            initAuth();

        }

        window.dispatchEvent(
            new Event("componentsLoaded")
        );


        // ============================
        // MENU ATIVO AUTOMÁTICO
        // ============================

        const paginaAtual = window.location.pathname;


        const links = {

            "index.html": "link-home",

            "colecoes.html": "link-colecoes",

            "editoras.html": "link-editoras",

            "contato.html": "link-contato"

        };


        Object.values(links).forEach(id => {

            const link = document.getElementById(id);

            if(link){

                link.classList.remove("active");

            }

        });


        for (const pagina in links){


            if(paginaAtual.includes(pagina)){


                const linkAtivo = document.getElementById(
                    links[pagina]
                );


                if(linkAtivo){

                    linkAtivo.classList.add("active");

                }

            }

        }


    });


});




// ============================
// HEADER AO ROLAR
// ============================

window.addEventListener("scroll", () => {


    const header = document.querySelector(".header");


    if (!header) return;


    if (window.scrollY > 50){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }


});

// ============================
// ATUALIZAR MENU DO USUÁRIO
// ============================

function updateUserMenu(){


    const guestMenu =
    document.querySelector(".guest-menu");

    const mobileAuth =
    document.querySelector(".mobile-auth");


    const userMenu =
    document.querySelector(".user-menu");


    if(!guestMenu || !userMenu){

        return;

    }



    const usuario =
    Auth.getUser();



    if(usuario){


        if(guestMenu){

            guestMenu.style.display = "none";

        }


        if(mobileAuth){

            mobileAuth.style.display = "none";

        }


        if(userMenu){

            userMenu.style.display = "flex";

        }



        const avatar =
        document.querySelector(".profile-button img");


        const nome =
        document.querySelector(".profile-button span");



        if(avatar){

            if(usuario.avatar){

                avatar.src = "/img/avatars/" + usuario.avatar;

            } else {

                avatar.src = "/img/avatars/avatar.jpg";

            }

        }


        if(nome){

            nome.textContent =
            usuario.nome;

        }



    else{


        if(guestMenu){

            guestMenu.style.display = "flex";

        }


        if(mobileAuth){

            mobileAuth.style.display = "flex";

        }


        if(userMenu){

            userMenu.style.display = "none";

        }


    }


    }


}



// ============================
// ESCUTAR LOGIN / LOGOUT
// ============================

window.addEventListener("authChanged", () => {

    updateUserMenu();

});



// ============================
// APÓS CARREGAR COMPONENTES
// ============================

window.addEventListener("componentsLoaded", () => {

    updateUserMenu();

});
document.addEventListener("click", (e)=>{


    if(e.target.id === "logoutButton"){


        Auth.logout();


        location.reload();


    }


});

// ============================
// MENU DO PERFIL
// ============================

document.addEventListener("click", (e)=>{


    const button =
    e.target.closest("#profileButton");


    const dropdown =
    document.getElementById("profileDropdown");



    if(button && dropdown){


        dropdown.classList.toggle("active");


    }


    if(
        dropdown &&
        !e.target.closest(".profile-area")
    ){

        dropdown.classList.remove("active");

    }


});