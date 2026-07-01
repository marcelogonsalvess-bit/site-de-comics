document.addEventListener("DOMContentLoaded", async () => {
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");

    if (!input || !results) return;

    const pagefind = await import("/pagefind/pagefind.js");

    input.addEventListener("input", async () => {
        const query = input.value.trim();

        if (query.length < 2) {
            results.innerHTML = "";
            return;
        }

        const search = await pagefind.search(query);

        if (!search.results.length) {
            results.innerHTML = "<p>Nenhum resultado encontrado.</p>";
            return;
        }

        const items = await Promise.all(
            search.results.slice(0, 8).map(result => result.data())
        );

        results.innerHTML = items.map(item => `
            <a href="${item.url}" class="search-result">
                <strong>${item.meta.title}</strong>
            </a>
        `).join("");
    });
});