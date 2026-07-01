document.addEventListener("DOMContentLoaded", async () => {
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");

    if (!input || !results) return;

    const pagefind = await import("/pagefind/pagefind.js");
    let currentResults = [];

    input.addEventListener("input", async () => {
        const query = input.value.trim();

        if (query.length < 2) {
            results.innerHTML = "";
            return;
        }
    input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && currentResults.length > 0) {
        window.location.href = currentResults[0].url;
    }
});

        const search = await pagefind.search(query);

        if (!search.results.length) {
            results.innerHTML = "<p>Nenhum resultado encontrado.</p>";
            return;
        }

        const items = await Promise.all(
            search.results.slice(0, 8).map(result => result.data())
        );
        currentResults = items;

        results.innerHTML = items.map(item => `
            <a href="${item.url}" class="search-result">
                <strong>${item.meta.title}</strong>
            </a>
        `).join("");
    });

// Fecha os resultados ao clicar fora da busca
        document.addEventListener("click", (event) => {
            if (!event.target.closest(".busca")) {
                results.innerHTML = "";
             }
        });

});