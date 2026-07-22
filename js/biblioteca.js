// ============================
// MINHA BIBLIOTECA
// ============================


document.addEventListener(
"DOMContentLoaded",
()=>{


const grid =
document.getElementById("bibliotecaGrid");



const usuario =
Auth.getUser();



if(!usuario || !usuario.biblioteca){


    grid.innerHTML =
    "<p>Nenhuma HQ adicionada ainda.</p>";

    return;


}



if(usuario.biblioteca.length === 0){


    grid.innerHTML =
    "<p>Nenhuma HQ adicionada ainda.</p>";

    return;


}




usuario.biblioteca.forEach(hq => {



    const card =
    document.createElement("div");


    card.className =
    "biblioteca-card";



card.innerHTML = `


<a href="../${hq.pagina}"
class="biblioteca-link">


<img 
src="${hq.capa}"
alt="${hq.titulo}">


<h3>
${hq.titulo}
</h3>


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