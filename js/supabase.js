// ============================
// CONFIGURAÇÃO SUPABASE
// ============================


const SUPABASE_URL = "https://gncfjvtpwvttgmzkmnxr.supabase.co";


const SUPABASE_KEY = "sb_publishable_xgWaycpZmvLByA7KBnC0RQ_VGi4n9vm";



// ============================
// CLIENTE SUPABASE
// ============================


const supabaseClient = supabase.createClient(

    SUPABASE_URL,

    SUPABASE_KEY

);


console.log("Supabase conectado");

// ============================
// CADASTRO SUPABASE
// ============================

async function cadastrarUsuario(nome, email, senha){

    console.log("FUNÇÃO CADASTRAR CHAMADA:", {
    nome,
    email,
    senha
});

    const { data, error } =
    await supabaseClient.auth.signUp({

        email: email,

        password: senha,

        options: {

            data: {
                nome: nome
            }

        }

    });


    if(error){

        console.error(
            "Erro no cadastro:",
            error
        );

        return null;

    }


    console.log(
        "Usuário criado:",
        data
    );


    return data;

}

// ============================
// CRIAR PERFIL
// ============================

async function criarPerfil(usuarioAuth, dados){


    const { data, error } = await supabaseClient
    .from("perfis")
    .insert({

        id: usuarioAuth.id,

        id_auth: usuarioAuth.id,

        nome: dados.nome,

        avatar: "img/avatar.jpg",

        favoritos: [],

        biblioteca: [],

        baixadas: [],

        atividades: []

    })
    .select();



    if(error){

        console.error(
            "Erro ao criar perfil:",
            error
        );

        return null;

    }



    console.log(
        "Perfil criado:",
        data
    );


    return data;


}
// ============================
// LOGIN TESTE SUPABASE
// ============================

async function loginTeste(email, senha){

    const { data, error } =
    await supabaseClient.auth.signInWithPassword({

        email: email,

        password: senha

    });


    if(error){

        console.error(
            "Erro login:",
            error
        );

        return null;

    }


    console.log(
        "Login realizado:",
        data
    );


    return data;

}