<script>
const btn = document.getElementById("mainDownload");

btn.addEventListener("click", function(e) {
    e.preventDefault();

    const original = this.innerHTML;

    this.innerHTML = `
        <span class="icon">⏳</span>
        <div class="text">
            <span class="title">Preparando download...</span>
            <span class="subtitle">Aguarde alguns segundos</span>
        </div>
        <span class="status">LOADING</span>
    `;

    this.style.pointerEvents = "none";

    setTimeout(() => {
        this.innerHTML = `
            <span class="icon">✔</span>
            <div class="text">
                <span class="title">Download iniciado</span>
                <span class="subtitle">Se não abrir, use o espelho</span>
            </div>
            <span class="status">OK</span>
        `;

        this.style.background = "linear-gradient(135deg, #d9ffd9, #ffffff)";

        setTimeout(() => {
            this.innerHTML = original;
            this.style.pointerEvents = "auto";
            this.style.background = "";
        }, 3000);

    }, 2000);
});
</script>



<script>
const btn = document.getElementById("downloadBtn");
const countEl = document.getElementById("downloadCount");

const API = "https://SEU-WORKER.workers.dev";

const id = btn.dataset.id;

// carrega contador ao abrir a página
async function loadCount() {
    try {
        const res = await fetch(`${API}/count?id=${id}`);
        const data = await res.json();
        countEl.textContent = data.count ?? 0;
    } catch (err) {
        countEl.textContent = "0";
    }
}

loadCount();

// clique no download
btn.addEventListener("click", async function(e) {
    e.preventDefault();

    // registra download no backend
    try {
        await fetch(`${API}/download`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        });
    } catch (err) {
        console.log("Erro ao registrar download");
    }

    // atualiza UI instantaneamente (UX)
    let current = parseInt(countEl.textContent || "0");
    countEl.textContent = current + 1;

    // redireciona para o arquivo
    window.location.href = this.href;
});
</script>