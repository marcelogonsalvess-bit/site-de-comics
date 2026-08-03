// ==========================
// CONTADOR DE VISITAS
// ==========================


async function registrarVisita(){


    try {


        const pagina =
        window.location.pathname;


        const { error } =
        await supabaseClient
        .from("visitas")
        .insert({

            pagina: pagina

        });



        if(error){

    console.error(
        "Erro ao registrar visita:",
        error.message,
        error.details,
        error.hint
    );

    return;

}


        console.log(
            "Visita registrada:",
            pagina
        );


    } catch(err){


        console.error(
            "Erro contador visitas:",
            err
        );


    }


}



document.addEventListener(
"DOMContentLoaded",
()=>{

    registrarVisita();

});