async function carregarComponente(id, arquivo) {
    const elemento = document.getElementById(id);

    if (!elemento) return;

    const resposta = await fetch(arquivo);
    elemento.innerHTML = await resposta.text();
}

carregarComponente("header", "/components/header.html");
carregarComponente("footer", "/components/footer.html");