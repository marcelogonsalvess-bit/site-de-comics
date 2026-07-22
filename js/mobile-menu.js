function initMobileMenu(){


    const button =
    document.getElementById("mobileMenuButton");


    const menu =
    document.getElementById("mobileMenu");



    if(!button || !menu) return;



    button.onclick = (e)=>{

        e.stopPropagation();

        menu.classList.toggle("active");

    };



    document.addEventListener("click",(e)=>{


        if(
            !menu.contains(e.target) &&
            !button.contains(e.target)
        ){

            menu.classList.remove("active");

        }


    });

        const links =
    menu.querySelectorAll("a");


    const paginaAtual =
    window.location.pathname;


    links.forEach(link=>{


        if(link.pathname === paginaAtual){

            link.classList.add("active");

        }


    });


}