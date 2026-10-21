
/* =========================================
   PRIME FIT WEAR — LOADER CORREGIDO
========================================= */

const loader = document.getElementById("loader");
const menuToggle = document.getElementById("menuToggle");
const navbarLinks = document.querySelector(".navbar__links");

// Mostrar la página desde el inicio.
document.body.classList.add("is-loading");

let loaderFinished = false;

function hideLoader() {
    if (loaderFinished) return;

    loaderFinished = true;

    if (loader) {
        loader.classList.add("is-hidden");

        // Retirar completamente la pantalla de carga.
        window.setTimeout(() => {
            loader.remove();
        }, 700);
    }

    document.body.classList.remove("is-loading");
}

// No esperar a que terminen de cargar todas las imágenes.
// Mostrar la página después de un tiempo breve.
window.setTimeout(hideLoader, 1600);

// También ocultar la pantalla si el navegador ya terminó de cargar.
if (document.readyState === "complete") {
    hideLoader();
} else {
    window.addEventListener("load", hideLoader, { once: true });
}

// MENÚ MÓVIL

if (menuToggle && navbarLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navbarLinks.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );
    });

    navbarLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navbarLinks.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menú");
        });
    });
}

// AÑO AUTOMÁTICO

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}
