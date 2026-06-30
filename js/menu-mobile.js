const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".header nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("menu-aberto");
    });
}