// ============================
// PÁGINA DA EDITORA
// ============================

document.addEventListener(
    "catalogoCarregado",
    () => {


    const idEditora = document.body.dataset.editora;


    const editora = catalogoEditoras.find(
        item => item.id === idEditora
    );


    if(!editora){

        console.log("Editora não encontrada");

        return;

    }
    document.getElementById("tituloPagina").textContent =
       `${editora.nome} - Fundação Comics`;


    // ============================
    // INFORMAÇÕES DA EDITORA
    // ============================

    document.getElementById("dadosEditora").innerHTML = `


        <div class="logo-editora">

            <img 
                src="${editora.logo}"
                alt="${editora.nome}"
            >

        </div>


        <h1>
            ${editora.nome}
        </h1>


    `;




    // ============================
    // BUSCAR HQS DA EDITORA
    // ============================


    const hqsDaEditora = catalogoHQs
        .filter(
            hq => hq.editoraId === editora.id
        )
        .sort(
            (a, b) => a.titulo.localeCompare(b.titulo)
        );


    console.log("HQs da editora:", hqsDaEditora);



    // ============================
    // LISTAR HQS
    // ============================


    document.getElementById("listaHQsEditora").innerHTML = 
    hqsDaEditora.map(hq => {


        return `


            <a 
    href="../${hq.pagina}"
    class="comic-card"
>


    <div class="comic-cover">


        <img 
            src="${hq.capa}"
            alt="${hq.titulo}"
        >


        <div class="comic-gradient"></div>


        <h3>
            ${hq.titulo}
        </h3>


    </div>


</a>


        `;


    }).join("");



});