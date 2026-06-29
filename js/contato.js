document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formContato");
    const statusMsg = document.getElementById("statusMsg");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = new FormData(form);

        try {

            const res = await fetch("https://formsubmit.co/ajax/marcelo@marcelogonsalves.com.br", {
                method: "POST",
                body: data
            });

            if (res.ok) {

                statusMsg.textContent = "Mensagem enviada com sucesso!";
                statusMsg.style.color = "lime";
                form.reset();

            } else {

                statusMsg.textContent = "Erro ao enviar.";
                statusMsg.style.color = "red";

            }

        } catch {

            statusMsg.textContent = "Erro de conexão.";
            statusMsg.style.color = "red";

        }

    });

});