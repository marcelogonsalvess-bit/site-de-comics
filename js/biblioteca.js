// ============================
// MINHA BIBLIOTECA
// ============================


document.addEventListener(
"DOMContentLoaded",
async ()=>{


const grid =
document.getElementById("bibliotecaGrid");



const usuario =
await Auth.getUser();


if(!usuario){

    grid.innerHTML =
    "<p>Nenhuma HQ adicionada ainda.</p>";

    return;

}


const { data: biblioteca, error } =
await supabaseClient
    .from("biblioteca")
    .select("id_hq")
    .eq("id_usuario", usuario.id);



if(error){

    console.error(
        "Erro ao carregar biblioteca:",
        error
    );

    grid.innerHTML =
    "<p>Erro ao carregar biblioteca.</p>";

    return;

}



if(!biblioteca || biblioteca.length === 0){

    grid.innerHTML =
    "<p>Nenhuma HQ adicionada ainda.</p>";

    return;

}




biblioteca.forEach(item => {


    const hq =
    catalogoHQs.find(
        comic => comic.id === item.id_hq
    );


    if(!hq){

        return;

    }



    const card =
    document.createElement("div");


    card.className =
    "comic-card";



card.innerHTML = `

<a href="../pages/hq.html?id=${hq.id}">

    <div class="comic-cover">

        <img
            src="${hq.capa}"
            alt="${hq.titulo}">

    </div>


    <div class="comic-info">

        <h3 class="comic-title">

            ${hq.titulo}

        </h3>

    </div>

</a>



<button
class="remover-biblioteca"
data-id="${hq.id}">

×


</button>

`;


grid.appendChild(card);



const botaoRemover =
card.querySelector(".remover-biblioteca");



botaoRemover.addEventListener("click",(e)=>{


    e.preventDefault();


    e.stopPropagation();



    Auth.removeFromLibrary(
        hq.id,
        hq.titulo
    );


    card.remove();


});



});


});