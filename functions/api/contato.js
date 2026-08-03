export async function onRequestPost(context) {

    try {

        const { request, env } = context;

        const {
            nome,
            email,
            assunto,
            mensagem
        } = await request.json();


        if (
            !nome ||
            !email ||
            !mensagem
        ) {

            return new Response(
                JSON.stringify({
                    sucesso: false,
                    erro: "Dados inválidos."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }


        const resposta = await fetch(
            "https://api.resend.com/emails",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    from: "Fundação Comics <onboarding@resend.dev>",

                    to: [
                        "marcelo@marcelogonsalves.com.br"
                    ],

                    reply_to: email,

                    subject: assunto || "Contato pelo site",

                    html: `
                        <h2>Nova mensagem pelo site</h2>

                        <p><strong>Nome:</strong> ${nome}</p>

                        <p><strong>E-mail:</strong> ${email}</p>

                        <p><strong>Assunto:</strong> ${assunto || "-"}</p>

                        <hr>

                        <p>${mensagem.replace(/\n/g, "<br>")}</p>
                    `
                })
            }
        );


        if (!resposta.ok) {

            const erro = await resposta.text();

            console.error(erro);

            return new Response(
                JSON.stringify({
                    sucesso: false
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }


        return new Response(
            JSON.stringify({
                sucesso: true
            }),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (erro) {

        console.error(erro);

        return new Response(
            JSON.stringify({
                sucesso: false
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }

}