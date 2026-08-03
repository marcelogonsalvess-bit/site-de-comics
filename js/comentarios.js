// ============================
// COMENTÁRIOS
// ============================


function renderizarComentarios(comentarios) {

    const lista = document.getElementById("listaComentarios");

    const contador = document.getElementById("contadorComentarios");

    if (contador) {
        contador.innerText = comentarios.length;
    }

    const usuarioLogado = window.usuarioAtual || null;


    if (!lista) return;



    if (comentarios.length === 0) {

        lista.innerHTML = `
            <p>
                Ainda não há comentários.
            </p>
        `;

        return;

    }



    lista.innerHTML = "";


    comentarios.forEach(comentario => {

        const comentarioLongo =
        comentario.comentario.length > 300;

        lista.innerHTML += `

            <div class="comentario ${usuarioLogado && comentario.id_usuario === usuarioLogado.id ? 'meu-comentario' : ''}">


                <img
                    src="../../../img/avatars/${comentario.perfis?.avatar || 'avatar1.jpg'}"
                    class="comentario-avatar"
                >


                <div class="comentario-conteudo">


                    <strong>
                        ${comentario.perfis?.nome || 'Usuário'}
                    </strong>


                    <p class="texto-comentario">
                        ${comentario.comentario}
                    </p>

                    ${
                        comentarioLongo
                        ?
                        `
                        <button class="btn-ler-mais-comentario">
                            Ler mais
                        </button>
                        `
                        :
                        ""
                    }


                    <small>
                        ${new Date(comentario.criado_em).toLocaleString("pt-BR")}
                    </small>

                    <div class="comentario-curtidas">

                        <button
                            class="btn-curtir-comentario"
                            data-id="${comentario.id}">

                            <i class="fa-regular fa-thumbs-up"></i>

                        </button>

                        <span class="contador-curtidas">

                            ${comentario.curtidas_comentarios?.length || 0}

                        </span>

                    </div>


                    ${
                    usuarioLogado && comentario.id_usuario === usuarioLogado.id

                    ?

                    `

                    <button
                        class="btn-excluir-comentario"
                        data-id="${comentario.id}">
                        Excluir
                    </button>


                    <button
                        class="btn-editar-comentario"
                        data-id="${comentario.id}">
                        Editar
                    </button>

                    `

                    :

                    ""

                    }



                </div>


            </div>

        `;


    });


}


function ativarBotoesComentarios(idHQ) {


    document.querySelectorAll(".btn-excluir-comentario")

    .forEach(botao => {


        botao.addEventListener("click", async () => {


            const confirmar = confirm(
                "Deseja realmente excluir este comentário?"
            );


            if (!confirmar) return;



            const idComentario = botao.dataset.id;



            await supabaseClient

                .from("comentarios")

                .delete()

                .eq("id", idComentario);



            const novosComentarios =
                await carregarComentarios(idHQ);



            renderizarComentarios(novosComentarios);


            ativarBotoesComentarios(idHQ);


        });


    });




    document.querySelectorAll(".btn-editar-comentario")

    .forEach(botao => {


        botao.addEventListener("click", () => {


            const idComentario = botao.dataset.id;


            const comentario =
                botao
                .closest(".comentario")
                .querySelector("p");


            const textoAtual =
                comentario.innerText;



            comentario.innerHTML = `

                <textarea class="campo-edicao-comentario">
                    ${textoAtual}
                </textarea>


                <button
                    class="btn-salvar-edicao"
                    data-id="${idComentario}">
                    Salvar
                </button>

            `;


            const btnSalvar =
                comentario.parentElement
                .querySelector(".btn-salvar-edicao");



            btnSalvar.addEventListener("click", async () => {


                const novoTexto =
                    comentario.parentElement
                    .querySelector(".campo-edicao-comentario")
                    .value.trim();



                await supabaseClient

                .from("comentarios")

                .update({
                    comentario: novoTexto
                })

                .eq("id", idComentario);



                const novosComentarios =
                    await carregarComentarios(idHQ);



                renderizarComentarios(novosComentarios);


                ativarBotoesComentarios(idHQ);


            });


        });


    });




// ============================
// LER MAIS COMENTÁRIO
// ============================

document.querySelectorAll(".btn-ler-mais-comentario")

.forEach(botao => {


    botao.addEventListener("click", () => {


        const texto =
            botao
            .closest(".comentario")
            .querySelector(".texto-comentario");


        texto.classList.toggle("expandido");


        if (texto.classList.contains("expandido")) {

            botao.innerText = "Mostrar menos";

        } else {

            botao.innerText = "Ler mais";

        }


    });


});

// ============================
// CURTIR COMENTÁRIO
// ============================

document.querySelectorAll(".btn-curtir-comentario")

.forEach(botao => {

    botao.addEventListener("click", async () => {

        if (!window.usuarioAtual) {

            alert("Faça login para curtir comentários.");

            return;

        }


        const idComentario =
            botao.dataset.id;


        const { data: curtidaExistente } =
            await supabaseClient

            .from("curtidas_comentarios")

            .select("id")

            .eq("id_comentario", idComentario)

            .eq("id_usuario", window.usuarioAtual.id)

            .maybeSingle();


        if (curtidaExistente) {

            await supabaseClient

                .from("curtidas_comentarios")

                .delete()

                .eq("id", curtidaExistente.id);

        } else {

            await supabaseClient

                .from("curtidas_comentarios")

                .insert({

                    id_comentario: idComentario,

                    id_usuario: window.usuarioAtual.id

                });

        }


        const novosComentarios =
            await carregarComentarios(idHQ);


        renderizarComentarios(novosComentarios);

        ativarBotoesComentarios(idHQ);

    });

});

}

// ============================
// CARREGAR COMENTÁRIOS
// ============================


async function carregarComentarios(idHQ) {


    const { data: comentarios, error } =
        await supabaseClient

        .from("comentarios")

        .select(`
            id,
            comentario,
            criado_em,
            id_usuario,
            perfis (
                nome,
                avatar
            ),
            curtidas_comentarios (
                id_usuario
            )
        `)

        .eq("id_hq", idHQ)

        .order("criado_em", { ascending: false });



    if (error) {

        console.error(
            "Erro ao carregar comentários:",
            error
        );

        return [];

    }


    return comentarios;


}






document.addEventListener("catalogoCarregado", async () => {


    console.log("comentarios.js carregou");



    const idHQ = window.idHQAtual;



    const {
        data: { user }

    } = await supabaseClient.auth.getUser();



    window.usuarioAtual = user;



    const comentarios = await carregarComentarios(idHQ);



    renderizarComentarios(comentarios);

    if (sessionStorage.getItem("voltarComentarios")) {

        sessionStorage.removeItem("voltarComentarios");


        setTimeout(() => {

            const secaoComentarios =
                document.getElementById("comentarios");


            if (secaoComentarios) {

                secaoComentarios.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }, 700);

    }

    ativarBotoesComentarios(idHQ);


    // ============================
    // CAMPO NOVO COMENTÁRIO
    // ============================



    const novoComentario =
        document.getElementById("novoComentario");



    if (!novoComentario) return;




    if (!user) {


        novoComentario.innerHTML = `

            <div class="aviso-login-comentario">

                <div class="icone-login-comentario">
                    💬
                </div>


                <h3>
                    Quer participar da conversa?
                </h3>


                <p>
                    Faça login para deixar um comentário.
                </p>


                <button id="btnLoginComentario">
                    Entrar
                </button>

            </div>

        `;

        const btnLoginComentario =
            document.getElementById("btnLoginComentario");


        if (btnLoginComentario) {

            btnLoginComentario.addEventListener("click", () => {


                sessionStorage.setItem(
                    "voltarComentarios",
                    "true"
                );


                const btnAbrirLogin =
                    document.querySelector("#openLogin");


                if (btnAbrirLogin) {

                    btnAbrirLogin.click();

                }


            });

        }


    } else {



        novoComentario.innerHTML = `

            <p class="aviso-comentario"></p>

            <textarea
                id="campoComentario"
                placeholder="Escreva seu comentário..."
                maxlength="1000">
            </textarea>

            <p class="contador-caracteres">
                1000 caracteres restantes
            </p>


            <button id="btnEnviarComentario">
                Enviar comentário
            </button>


        `;



        const btnEnviar =
            document.getElementById("btnEnviarComentario");



        const campo =
            document.getElementById("campoComentario");

        const contador =
            document.querySelector(".contador-caracteres");


        campo.addEventListener("input", () => {


            const restantes =
                1000 - campo.value.length;


            if (contador) {

                contador.innerText =
                    `${restantes} caracteres restantes`;

            }


});

        campo.addEventListener("input", () => {

            const aviso =
                document.querySelector(".aviso-comentario");


            if (aviso) {

                aviso.innerText = "";

            }

        });


        btnEnviar.addEventListener(
            "click",
            async () => {



                const texto =
                    campo.value.trim();



                if (!texto) {

                    const aviso =
                        document.querySelector(".aviso-comentario");


                    if (aviso) {

                        aviso.innerText =
                            "Digite um comentário.";

                    }


                    return;

                }





                const { error } =
                    await supabaseClient

                    .from("comentarios")

                    .insert({

                        id_usuario: user.id,

                        id_hq: idHQ,

                        comentario: texto

                    });





                if (error) {


                    console.error(error);


                    return;

                }





                campo.value = "";

                campo.focus();

                const novosComentarios =
                    await carregarComentarios(idHQ);



                renderizarComentarios(novosComentarios);



            }

        );



    }



});