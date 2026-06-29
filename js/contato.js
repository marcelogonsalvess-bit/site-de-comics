
const modal = document.getElementById("modalContato");
const openBtn = document.getElementById("openContato");
const closeBtn = document.getElementById("closeContato");

const form = document.getElementById("formContato");
const statusMsg = document.getElementById("statusMsg");

// abre / fecha com toggle
openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.toggle("ativo");
});

// fecha botão X
closeBtn.addEventListener("click", () => {
    modal.classList.remove("ativo");
});

// fecha clicando fora
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("ativo");
    }
});

// envio
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    try {
        const res = await fetch("https://formsubmit.co/ajax/marcelo@marcelogonsalves.com.br", {
            method: "POST",
            body: data
        });

        if (res.ok) {
            statusMsg.innerText = "Mensagem enviada com sucesso!";
            form.reset();

            // fecha modal após enviar
            modal.classList.remove("ativo");
        } else {
            statusMsg.innerText = "Erro ao enviar.";
        }

    } catch (err) {
        statusMsg.innerText = "Erro de conexão.";
    }
});