console.log("contato.js carregado");
// ============================
// CONTATO
// ============================

document.addEventListener("DOMContentLoaded", () => {


    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const form = document.getElementById("formContato");


    // ============================
    // PREENCHER USUÁRIO LOGADO
    // ============================

    if (typeof Auth !== "undefined" && Auth.isLogged()) {


        const usuario = Auth.getUser();


        if(usuario){

            nome.value = usuario.nome || "";
            email.value = usuario.email || "";

        }

    }



    // ============================
    // ENVIO DO FORMULÁRIO
    // ============================

    form.addEventListener("submit", (e) => {


        e.preventDefault();

        const mensagemSucesso = document.getElementById("mensagemSucesso");

        mensagemSucesso.style.display = "none";


        const mensagem = document.getElementById("mensagem").value.trim();


        if(!nome.value.trim()){

            alert("Digite seu nome.");
            return;

        }


        if(!email.value.trim()){

            alert("Digite seu e-mail.");
            return;

        }


        if(!mensagem){

            alert("Digite uma mensagem.");
            return;

        }


        mensagemSucesso.innerHTML = `
            ✓ Mensagem enviada com sucesso!<br>
            Obrigado pelo contato.
        `;

        // ============================
        // REGISTRAR ATIVIDADE
        // ============================

        if (typeof Auth !== "undefined" && Auth.isLogged()) {

            Auth.addActivity("📨 Enviou uma mensagem pelo contato");

        }


        mensagemSucesso.style.display = "block";


        form.reset();



        // mantém dados do usuário logado

        if (typeof Auth !== "undefined" && Auth.isLogged()) {

            const usuario = Auth.getUser();

            nome.value = usuario.nome || "";
            email.value = usuario.email || "";

        }


    });


});