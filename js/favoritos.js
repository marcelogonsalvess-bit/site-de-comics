// ============================
// SISTEMA DE FAVORITOS
// ============================

const Favoritos = {


    async adicionar(idHQ, tituloDaHQ){

        const usuario = await Auth.getUser();

        if(!usuario){

            return false;

        }


        const { data: existente } =
        await supabaseClient
            .from("favoritos")
            .select("id")
            .eq("id_usuario", usuario.id)
            .eq("id_hq", idHQ)
            .maybeSingle();


        if(existente){

            return true;

        }


        const { error } =
        await supabaseClient
            .from("favoritos")
            .insert({

                id_usuario: usuario.id,
                id_hq: idHQ

            });


        if(error){

            console.error(
                "Erro ao adicionar favorito:",
                error
            );

            return false;

        }


        await Auth.addActivity(
            "❤️ Você favoritou " + tituloDaHQ
        );


        return true;

    },


    async remover(idHQ, tituloDaHQ){


    const usuario =
    await Auth.getUser();


    if(!usuario){

        return false;

    }


    const { error } =
    await supabaseClient
        .from("favoritos")
        .delete()
        .eq("id_usuario", usuario.id)
        .eq("id_hq", idHQ);


    if(error){

        console.error(
            "Erro ao remover favorito:",
            error
        );

        return false;

    }


    await Auth.addActivity(
        "💔 Você removeu " + tituloDaHQ + " dos favoritos."
    );


    return true;

},


    async verificar(idHQ){

        const usuario = await Auth.getUser();

        if(!usuario){

            return false;

        }


        const { data } =
        await supabaseClient
            .from("favoritos")
            .select("id")
            .eq("id_usuario", usuario.id)
            .eq("id_hq", idHQ)
            .maybeSingle();


        return !!data;

    },


    async total(){


    const usuario =
    await Auth.getUser();


    if(!usuario){

        return 0;

    }


    const { count, error } =
    await supabaseClient
        .from("favoritos")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq(
            "id_usuario",
            usuario.id
        );


    if(error){

        console.error(
            "Erro ao contar favoritos:",
            error
        );

        return 0;

    }


    return count || 0;


}


};