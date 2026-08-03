// ============================
// AUTENTICAÇÃO
// ============================

const Auth = {




    // ============================
    // LOGIN
    // ============================

    async login(email, senha){

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: senha
            });


        if(error){
            console.error("Erro no login:", error.message);
            return null;
        }


        window.dispatchEvent(
            new Event("authChanged")
        );


        return data.user;

    },



    // ============================
    // ATUALIZAR USUÁRIO
    // ============================

    updateUser(user){


        // Atualiza usuário logado

        localStorage.setItem(
            "usuario",
            JSON.stringify(user)
        );



        // Atualiza usuário dentro do cadastro

        let usuarios = JSON.parse(
            localStorage.getItem("cadastro")
        );


        if(!Array.isArray(usuarios)){

            usuarios = usuarios ? [usuarios] : [];

        }



        const index = usuarios.findIndex(
            item => item.email === user.email
        );



        if(index !== -1){

            usuarios[index] = user;

        }else{

            usuarios.push(user);

        }



        localStorage.setItem(
            "cadastro",
            JSON.stringify(usuarios)
        );



        window.dispatchEvent(
            new Event("authChanged")
        );

    },



    // ============================
    // ADICIONAR ATIVIDADE
    // ============================

    async addActivity(texto){

        const usuario =
            await this.getUser();


        if(!usuario) return;



        const { data: perfil, error } =
        await supabaseClient
            .from("perfis")
            .select("atividades")
            .eq("id_auth", usuario.id)
            .single();



        if(error){

            console.error(
                "Erro ao buscar atividades:",
                error
            );

            return;

        }



        let atividades =
            perfil.atividades || [];



        atividades.unshift({

            texto: texto.replace(/^(\S+)\s/, ""),

            data: new Date().toISOString()

        });



        if(atividades.length > 20){

            atividades =
                atividades.slice(0,20);

        }



        const { error: erroUpdate } =
        await supabaseClient
            .from("perfis")
            .update({

                atividades: atividades

            })
            .eq("id_auth", usuario.id);



        if(erroUpdate){

            console.error(
                "Erro ao salvar atividade:",
                erroUpdate
            );

        }

// ============================
// REGISTRAR NO PAINEL ADMIN
// ============================


const { error: erroAtividade } =
await supabaseClient
    .from("atividades")
    .insert({

        id_usuario: usuario.id,
        tipo: texto.split(" ")[0],
        descricao: texto

    });



if(erroAtividade){

    console.error(
        "Erro ao registrar atividade admin:",
        erroAtividade
    );

}


    },



    // ============================
    // ADICIONAR À BIBLIOTECA
    // ============================

    async addToLibrary(hq){


        const usuario =
        await this.getUser();


        if(!usuario){

            return false;

        }


        const { data: existente } =
        await supabaseClient
            .from("biblioteca")
            .select("id")
            .eq("id_usuario", usuario.id)
            .eq("id_hq", hq.id)
            .maybeSingle();


        if(existente){

            return false;

        }


        const { error } =
        await supabaseClient
            .from("biblioteca")
            .insert({

                id_usuario: usuario.id,
                id_hq: hq.id

            });


        if(error){

            console.error(
                "Erro ao adicionar à biblioteca:",
                error
            );

            return false;

        }


        await this.addActivity(
            "📚 Você adicionou " + hq.titulo + " à biblioteca."
        );


        return true;


    },



    // ============================
    // REMOVER DA BIBLIOTECA
    // ============================

    async removeFromLibrary(idHQ, titulo){


        const usuario =
        await this.getUser();


        if(!usuario){

            return false;

        }


        const { error } =
        await supabaseClient
            .from("biblioteca")
            .delete()
            .eq("id_usuario", usuario.id)
            .eq("id_hq", idHQ);


        if(error){

            console.error(
                "Erro ao remover da biblioteca:",
                error
            );

            return false;

        }


        await this.addActivity(
            "📕 Você removeu " + titulo + " da biblioteca."
        );


        return true;


    },


    // ============================
    // VERIFICAR BIBLIOTECA
    // ============================

    async isInLibrary(idHQ){


        const usuario =
        await this.getUser();


        if(!usuario){

            return false;

        }


        const { data } =
        await supabaseClient
            .from("biblioteca")
            .select("id")
            .eq("id_usuario", usuario.id)
            .eq("id_hq", idHQ)
            .maybeSingle();


        return !!data;


    },



    // ============================
    // LOGOUT
    // ============================

    async logout(){

        await supabaseClient.auth.signOut();

        window.dispatchEvent(
            new Event("authChanged")
        );

    },



    // ============================
    // VERIFICAR LOGIN
    // ============================

    async isLogged(){

        const { data } =
            await supabaseClient.auth.getSession();

        return !!data.session;

    },


    // ============================
    // PEGAR USUÁRIO LOGADO
    // ============================

    async getUser(){

    const { data } =
    await supabaseClient.auth.getSession();


    const usuarioAuth = data.session?.user;


    if(!usuarioAuth){

        return null;

    }


    const { data: perfil, error } =
    await supabaseClient
    .from("perfis")
    .select("*")
    .eq("id_auth", usuarioAuth.id)
    .maybeSingle();



    if(error){

        console.log("Erro buscando perfil:", error);

    }



    if(perfil){

        return {
            ...usuarioAuth,
            perfilId: perfil.id,
            id_auth: perfil.id_auth,
            nome: perfil.nome,
            avatar: perfil.avatar,
            admin: perfil.admin,
            favoritos: perfil.favoritos,
            biblioteca: perfil.biblioteca,
            baixadas: perfil.baixadas,
            atividades: perfil.atividades
        };

    }



    const { data: novoPerfil, error: erroCriacao } =
    await supabaseClient
    .from("perfis")
    .insert({

        id_auth: usuarioAuth.id,
        nome: usuarioAuth.user_metadata?.nome || "Novo usuário",
        avatar: "avatar1.jpg"

    })
    .select()
    .single();



    if(erroCriacao){

        console.error(
            "Erro ao criar perfil:",
            erroCriacao
        );

        return usuarioAuth;

    }



    return {
        ...usuarioAuth,
        perfilId: novoPerfil.id,
        id_auth: novoPerfil.id_auth,
        nome: novoPerfil.nome,
        avatar: novoPerfil.avatar,
        favoritos: novoPerfil.favoritos,
        biblioteca: novoPerfil.biblioteca,
        baixadas: novoPerfil.baixadas,
        atividades: novoPerfil.atividades
    };


},

    // ============================
    // PEGAR CADASTROS
    // ============================

    getRegister(){

        let usuarios = JSON.parse(
            localStorage.getItem("cadastro")
        );



        if(!usuarios){

            return [];

        }



        if(!Array.isArray(usuarios)){

            usuarios = [usuarios];

        }



        return usuarios;

    }


};