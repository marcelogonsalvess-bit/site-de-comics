// ============================
// AUTENTICAÇÃO
// ============================

const Auth = {


    // ============================
    // CADASTRAR USUÁRIO
    // ============================

    register(user){

        let usuarios = JSON.parse(
            localStorage.getItem("cadastro")
        );


        // Compatibilidade com cadastro antigo
        if(!Array.isArray(usuarios)){

            usuarios = usuarios ? [usuarios] : [];

        }


        usuarios.push(user);


        localStorage.setItem(
            "cadastro",
            JSON.stringify(usuarios)
        );

    },



    // ============================
    // LOGIN
    // ============================

    login(user){

        localStorage.setItem(
            "usuario",
            JSON.stringify(user)
        );


        window.dispatchEvent(
            new Event("authChanged")
        );

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

    addActivity(texto){

        const usuario = this.getUser();


        if(!usuario) return;



        if(!usuario.atividades){

            usuario.atividades = [];

        }



        usuario.atividades.unshift({

            texto: texto,

            data: new Date().toISOString()

        });



        // mantém apenas 20 atividades

        if(usuario.atividades.length > 20){

            usuario.atividades.length = 20;

        }



        this.updateUser(usuario);

    },



    // ============================
    // ADICIONAR À BIBLIOTECA
    // ============================

    addToLibrary(hq){

        const usuario = this.getUser();


        if(!usuario) return false;



        if(!usuario.biblioteca){

            usuario.biblioteca = [];

        }



        const jaExiste =
        usuario.biblioteca.some(
            item => item.id === hq.id
        );



        if(jaExiste){

            return false;

        }



        usuario.biblioteca.push(hq);



        this.updateUser(usuario);



        this.addActivity(
            "📚 Você adicionou " + hq.titulo + " à biblioteca."
        );



        return true;

    },



    // ============================
    // REMOVER DA BIBLIOTECA
    // ============================

    removeFromLibrary(idHQ, titulo){


        const usuario = this.getUser();



        if(!usuario){

            return false;

        }



        if(!usuario.biblioteca){

            usuario.biblioteca = [];

        }



        usuario.biblioteca =
            usuario.biblioteca.filter(
                item => item.id !== idHQ
            );



        this.updateUser(usuario);



        this.addActivity(
            "📕 Você removeu " + titulo + " da biblioteca."
        );



        return true;


    },



    // ============================
    // LOGOUT
    // ============================

    logout(){

        localStorage.removeItem("usuario");


        window.dispatchEvent(
            new Event("authChanged")
        );

    },



    // ============================
    // VERIFICAR LOGIN
    // ============================

    isLogged(){

        return localStorage.getItem("usuario") !== null;

    },



    // ============================
    // PEGAR USUÁRIO LOGADO
    // ============================

    getUser(){

        return JSON.parse(
            localStorage.getItem("usuario")
        );

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