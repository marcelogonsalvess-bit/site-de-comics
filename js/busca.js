// ============================
// BUSCA DO SITE
// ============================


document.addEventListener("submit", (evento) => {


    const form = evento.target;


    if(
        !form.matches("#formBusca") &&
        !form.matches("#mobileSearch")
    ) return;



    evento.preventDefault();



    let campo;



    if(form.matches("#formBusca")){


        campo = document.getElementById("campoBusca");


    }else{


        campo = document.getElementById("mobileCampoBusca");


    }



    if(!campo) return;



    const termo =
    campo.value.trim();



    if(!termo) return;



    window.location.href =
    "/pages/busca.html?q=" + encodeURIComponent(termo);


});