// ============================
// REDIRECIONAMENTO URL HQ
// ============================

const caminho = window.location.pathname;


if (caminho.startsWith("/hqs/")) {


    const partes = caminho.split("/");


    const arquivo = partes.pop();


    const slug = arquivo.replace(".html", "");


    if (slug) {

        window.location.href =
            `/pages/hq.html?slug=${slug}`;

    }

}