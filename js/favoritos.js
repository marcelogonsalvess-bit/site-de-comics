// ============================
// SISTEMA DE FAVORITOS
// ============================

const Favoritos = {


    adicionar(idHQ, tituloDaHQ){


        const usuario = Auth.getUser();


        if(!usuario){

            return false;

        }


        if(!usuario.favoritos){

            usuario.favoritos = [];

        }


        if(!usuario.favoritos.includes(idHQ)){


            usuario.favoritos.push(idHQ);


            Auth.updateUser(usuario);


            Auth.addActivity(
                "⭐ Você favoritou " + tituloDaHQ
            );


        }


        return true;

    },


    remover(idHQ, tituloDaHQ){


    const usuario = Auth.getUser();


    if(!usuario){

        return false;

    }


    if(!usuario.favoritos){

        usuario.favoritos = [];

    }


    usuario.favoritos =
        usuario.favoritos.filter(
            item => item !== idHQ
        );


    Auth.updateUser(usuario);


    Auth.addActivity(
        "💔 Você removeu " + tituloDaHQ + " dos favoritos."
    );


    return true;

},


    verificar(idHQ){


        const usuario = Auth.getUser();


        if(!usuario || !usuario.favoritos){

            return false;

        }


        return usuario.favoritos.includes(idHQ);

    },


    total(){


        const usuario = Auth.getUser();


        if(!usuario || !usuario.favoritos){

            return 0;

        }


        return usuario.favoritos.length;

    }


};