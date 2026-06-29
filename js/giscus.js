function loadGiscus() {
  const container = document.getElementById("comentarios");

  if (!container) return;

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.setAttribute("data-repo", "marcelogonsalvess-bit/site-de-comics");
  script.setAttribute("data-repo-id", "R_kgDOTH7-Qw");
  script.setAttribute("data-category", "General");
  script.setAttribute("data-category-id", "DIC_kwDOTH7-Q84DAIFw");
  script.setAttribute("data-mapping", "pathname");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-theme", "preferred_color_scheme");
  script.setAttribute("data-lang", "pt");
  script.crossOrigin = "anonymous";
  script.async = true;

  container.appendChild(script);
}

document.addEventListener("DOMContentLoaded", loadGiscus);