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

// ============================
// RESULTADOS DA BUSCA
// ============================

document.addEventListener("catalogoCarregado", () => {

    if (!window.location.pathname.includes("busca.html")) return;

    const params = new URLSearchParams(window.location.search);
    const termo = (params.get("q") || "").toLowerCase();

    const resultados = catalogoHQs.filter(hq =>
        hq.titulo.toLowerCase().includes(termo)
    );

    console.log("Resultados:", resultados);

    const lista = document.getElementById("resultadoBusca");
const textoBusca = document.getElementById("textoBusca");

if (textoBusca) {
    textoBusca.textContent =
        `${resultados.length} resultado(s) para "${params.get("q")}"`;
}

});