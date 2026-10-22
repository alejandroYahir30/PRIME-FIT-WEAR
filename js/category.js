
/* =========================================
   PRIME FIT WEAR
   Catálogo, inventario, galería y modal
   Colecciones: Hombre / Mujer / Unisex
========================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const products = [...document.querySelectorAll(".men-product-card")];
    const filters = [...document.querySelectorAll(".product-filter")];

    const modal = document.getElementById("product-modal");
    const dialog = modal?.querySelector(".product-modal__dialog");
    const modalImage = document.getElementById("product-modal-image");
    const modalTitle = document.getElementById("product-modal-title");
    const modalPrice = document.getElementById("product-modal-price");
    const modalDescription = document.getElementById("product-modal-description");
    const modalStock = document.getElementById("product-modal-stock");
    const modalSizes = document.getElementById("product-modal-sizes");
    const modalSelectedSize = document.getElementById("product-modal-selected-size");
    const modalAction = document.getElementById("product-modal-action");
    const modalCounter = document.getElementById("product-modal-counter");
    const modalThumbnails = document.getElementById("product-modal-thumbnails");

    const previousButton = modal?.querySelector("[data-gallery-prev]");
    const nextButton = modal?.querySelector("[data-gallery-next]");

    const collection = document.body.dataset.collection ||
        (document.body.classList.contains("category-page--women")
            ? "women"
            : document.body.classList.contains("category-page--unisex")
                ? "unisex"
                : "men");

    const API_ORIGIN = `${window.location.protocol}//${window.location.hostname || "localhost"}:3000`;

    let activeProduct = null;
    let activeImageIndex = 0;
    let selectedSize = "";
    let previousFocus = null;

    /* =========================================
       PRODUCTOS DE DEMOSTRACIÓN
    ========================================= */

    const menProducts = [
        {
            stock: 18,
            sizes: ["S", "M", "L", "XL"],
            description: "Playera oversized de estilo urbano, ideal para combinar comodidad y un look deportivo.",
            images: [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        {
            stock: 12,
            sizes: ["S", "M", "L", "XL"],
            description: "Playera de entrenamiento con una estética limpia, pensada para acompañarte durante tu rutina.",
            images: [
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        {
            stock: 9,
            sizes: ["S", "M", "L", "XL"],
            description: "Short deportivo pensado para facilitar el movimiento durante el entrenamiento.",
            images: [
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        {
            stock: 7,
            sizes: ["S", "M", "L", "XL"],
            description: "Hoodie esencial para crear capas y completar un outfit deportivo o casual.",
            images: [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        {
            stock: 15,
            sizes: ["S", "M", "L", "XL"],
            description: "Pantalón deportivo versátil para entrenar o crear un conjunto cómodo para todos los días.",
            images: [
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        {
            stock: 11,
            sizes: ["S", "M", "L", "XL"],
            description: "Tank deportivo de diseño minimalista para entrenamientos y conjuntos casuales.",
            images: [
                "https://images.unsplash.com/photo-1565693413579-8a187a6b7a14?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        }
    ];

    const womenProducts = {
        "prime-sculpt-leggings": {
            stock: 14,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Leggings de silueta estilizada para entrenamientos y looks deportivos.",
            images: [
                "https://images.unsplash.com/photo-1506629905607-d9c297d2c5c5?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-sports-bra": {
            stock: 10,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Top deportivo de diseño minimalista para tus sesiones de entrenamiento.",
            images: [
                "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-seamless-top": {
            stock: 16,
            sizes: ["XS", "S", "M", "L"],
            description: "Top seamless de estética limpia y versátil.",
            images: [
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-training-shorts-women": {
            stock: 9,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Short de entrenamiento con libertad de movimiento.",
            images: [
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-essential-hoodie-women": {
            stock: 7,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Hoodie esencial de estilo casual para complementar conjuntos deportivos.",
            images: [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-performance-tee-women": {
            stock: 11,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Playera deportiva minimalista para entrenamientos y actividades cotidianas.",
            images: [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        }
    };

    const unisexProducts = {
        "prime-oversized-tee": {
            stock: 18,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Playera oversized unisex de estilo urbano y silueta relajada.",
            images: [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-essential-jogger": {
            stock: 12,
            sizes: ["S", "M", "L", "XL"],
            description: "Jogger unisex minimalista para entrenamientos y actividades cotidianas.",
            images: [
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-training-tee": {
            stock: 9,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Playera de entrenamiento ligera y versátil.",
            images: [
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-active-shorts": {
            stock: 0,
            sizes: ["S", "M", "L", "XL"],
            description: "Short deportivo unisex. Agotado en la demostración.",
            images: [
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-core-hoodie": {
            stock: 7,
            sizes: ["S", "M", "L", "XL"],
            description: "Hoodie unisex de corte relajado para conjuntos deportivos y casuales.",
            images: [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85"
            ]
        },
        "prime-everyday-tank": {
            stock: 11,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Tank unisex de estética limpia y deportiva.",
            images: [
                "https://images.unsplash.com/photo-1565693413579-8a187a6b7a14?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        }
    };

    /* =========================================
       UTILIDADES
    ========================================= */

    function normalizarURL(url) {
        if (!url) return "";

        url = String(url).trim();

        if (url.startsWith("/")) {
            return `${API_ORIGIN}${url}`;
        }

        return url
            .replace(/^https?:\/\/localhost:3000/i, API_ORIGIN)
            .replace(/^https?:\/\/127\.0\.0\.1:3000/i, API_ORIGIN);
    }

    function formatPrice(value) {
        return value || "Precio por confirmar";
    }

    function getProductName(card) {
        return card.querySelector("h3")?.textContent.trim() || "Producto PRIME";
    }

    function getProductPrice(card) {
        return card.querySelector(".men-product-card__price")?.textContent.trim()
            || "Precio por confirmar";
    }

    function getProductData(card, index) {
        // Primero comprobar si la tarjeta viene del administrador.
        if (card.dataset.apiProductData) {
            try {
                return JSON.parse(card.dataset.apiProductData);
            } catch (error) {
                console.error("No se pudieron leer los datos del producto:", error);
                return null;
            }
        }

        const id = card.dataset.productId;

        if (collection === "women") {
            return womenProducts[id] || null;
        }

        if (collection === "unisex") {
            return unisexProducts[id] || null;
        }

        return menProducts[index] || null;
    }

    /* =========================================
       CARGAR PRODUCTOS DEL ADMINISTRADOR
    ========================================= */

    async function cargarProductosPublicados() {
        try {
            const categoriaAPI = {
                men: "hombre",
                women: "mujer",
                unisex: "unisex"
            }[collection];

            const respuesta = await fetch(
                `${API_ORIGIN}/api/productos/admin/todos`
            );

            if (!respuesta.ok) {
                throw new Error(`Error HTTP ${respuesta.status}`);
            }

            const resultado = await respuesta.json();
            const grid = document.querySelector(".men-products-grid");

            if (!grid) {
                console.warn("No se encontró .men-products-grid en esta página.");
                return;
            }

            const plantilla = grid.querySelector(".men-product-card");

            if (!plantilla) {
                console.warn("No se encontró una tarjeta de producto para clonar.");
                return;
            }

            const publicados = (resultado.productos || []).filter(producto => {
                const categoria = producto.categoria ?? producto["categoría"];

                const estaPublicado =
                    producto.publicado === true ||
                    Number(producto.publicado) === 1;

                const estaActivo =
                    producto.activo === true ||
                    Number(producto.activo) === 1;

                return (
                    estaPublicado &&
                    estaActivo &&
                    categoria === categoriaAPI
                );
            });

            publicados.forEach(producto => {
                if (grid.querySelector(`[data-api-product-id="${producto.id}"]`)) {
                    return;
                }

                const tarjeta = plantilla.cloneNode(true);

                tarjeta.dataset.apiProductId = String(producto.id);
                tarjeta.dataset.productId = `api-${producto.id}`;
                tarjeta.dataset.category = categoriaAPI;

                const nombre = tarjeta.querySelector("h3");
                if (nombre) nombre.textContent = producto.nombre;

                const precio = tarjeta.querySelector(".men-product-card__price");
                if (precio) {
                    precio.textContent = new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN"
                    }).format(Number(producto.precio) || 0);
                }

                const tallasProducto = producto.tallas || [];
                const imagenesProducto = producto.imagenes || producto["imágenes"] || [];

                const stockTotal = tallasProducto.reduce(
                    (total, talla) => total + Number(talla.stock || 0),
                    0
                );

                const imagenPrincipal =
                    imagenesProducto.find(imagen =>
                        imagen.imagen_principal === true ||
                        Number(imagen.imagen_principal) === 1
                    ) || imagenesProducto[0];

                const imagenes = imagenesProducto
                    .map(imagen => normalizarURL(imagen.url))
                    .filter(Boolean);

                const visual = tarjeta.querySelector(".men-product-card__visual");

                if (visual && imagenPrincipal) {
                    let imagen = visual.querySelector(".men-product-card__cover");

                    if (!imagen) {
                        imagen = visual.querySelector("img");

                        if (!imagen) {
                            imagen = document.createElement("img");
                            visual.prepend(imagen);
                        }

                        imagen.classList.add("men-product-card__cover");
                    }

                    imagen.src = normalizarURL(imagenPrincipal.url);
                    imagen.alt = producto.nombre;
                    imagen.loading = "lazy";
                }

                // La tarjeta guarda sus datos reales para el modal.
                tarjeta.dataset.apiProductData = JSON.stringify({
                    stock: stockTotal,
                    sizes: tallasProducto
                        .filter(item => Number(item.stock) > 0)
                        .map(item => item.talla),
                    description: producto.descripcion ||
                        "Prenda deportiva PRIME FIT WEAR.",
                    images: imagenes.length
                        ? imagenes
                        : imagenPrincipal
                            ? [normalizarURL(imagenPrincipal.url)]
                            : []
                });

                grid.appendChild(tarjeta);
                products.push(tarjeta);
            });

        } catch (error) {
            console.error("Error al cargar productos del administrador:", error);
        }
    }

    // Esperar la respuesta de la API antes de preparar las tarjetas.
    await cargarProductosPublicados();

    /* =========================================
       AÑO DEL PIE DE PÁGINA
    ========================================= */

    const year = document.getElementById("current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /* =========================================
       ESTADO VISUAL DEL INVENTARIO
    ========================================= */

    function renderCardInventory(card, data) {
        const visual = card.querySelector(".men-product-card__visual");
        if (!visual) return;

        const soldOut = Number(data.stock) <= 0;

        card.classList.toggle("is-sold-out", soldOut);
        card.dataset.stock = String(data.stock);
        visual.classList.toggle("is-sold-out", soldOut);

        let badge = visual.querySelector(".men-product-card__stock-badge");

        if (soldOut) {
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "men-product-card__stock-badge";
                visual.appendChild(badge);
            }

            badge.textContent = "AGOTADO";
        } else if (badge) {
            badge.remove();
        }

        let availability = card.querySelector(".men-product-card__availability");

        if (!availability) {
            availability = document.createElement("p");
            availability.className = "men-product-card__availability";

            const color = card.querySelector(".men-product-card__color");

            if (color) {
                color.insertAdjacentElement("afterend", availability);
            } else {
                card.appendChild(availability);
            }
        }

        availability.classList.toggle("is-available", !soldOut);
        availability.classList.toggle("is-unavailable", soldOut);

        availability.textContent = soldOut
            ? "AGOTADO · 0 UNIDADES"
            : `DISPONIBLE · ${data.stock} ${data.stock === 1 ? "UNIDAD" : "UNIDADES"}`;

        let sizeList = card.querySelector(".men-product-card__sizes");

        if (!sizeList) {
            sizeList = document.createElement("div");
            sizeList.className = "men-product-card__sizes";
            sizeList.setAttribute("aria-label", "Tallas del producto");
            availability.insertAdjacentElement("afterend", sizeList);
        }

        sizeList.replaceChildren();

        const sizeLabel = document.createElement("span");
        sizeLabel.className = "men-product-card__sizes-label";
        sizeLabel.textContent = "TALLAS";
        sizeList.appendChild(sizeLabel);

        (data.sizes || []).forEach(size => {
            const sizeItem = document.createElement("span");
            sizeItem.className = "men-product-card__size";
            sizeItem.textContent = size;

            if (soldOut) sizeItem.classList.add("is-disabled");

            sizeList.appendChild(sizeItem);
        });

        visual.setAttribute(
            "aria-label",
            soldOut
                ? `Ver detalles de ${getProductName(card)}. Producto agotado.`
                : `Ver detalles de ${getProductName(card)}`
        );
    }

    /* =========================================
       PREPARAR TODAS LAS TARJETAS
    ========================================= */

    products.forEach((card, index) => {
        const data = getProductData(card, index);
        const visual = card.querySelector(".men-product-card__visual");

        if (!data || !visual) {
            console.warn("No se encontraron datos para:", card.dataset.productId || index);
            return;
        }

        card.dataset.productIndex = String(index);

        renderCardInventory(card, data);

        visual.setAttribute("data-product-view", "");
        visual.setAttribute("aria-haspopup", "dialog");
        visual.setAttribute("role", "button");
        visual.setAttribute("tabindex", "0");

        let cover = visual.querySelector(".men-product-card__cover");

        if (!cover) {
            cover = visual.querySelector("img");

            if (!cover) {
                cover = document.createElement("img");
                visual.prepend(cover);
            }

            cover.classList.add("men-product-card__cover");
        }

        if (data.images?.[0]) {
            cover.src = normalizarURL(data.images[0]);
        }

        cover.alt = getProductName(card);
        cover.loading = "lazy";
        cover.decoding = "async";

        cover.addEventListener("error", () => {
            cover.classList.add("image-unavailable");
        });

        cover.addEventListener("load", () => {
            cover.classList.remove("image-unavailable");
        });

        const abrir = event => {
            event.preventDefault();
            openProduct(card, data, visual);
        };

        visual.addEventListener("click", abrir);

        visual.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                abrir(event);
            }
        });
    });

    /* =========================================
       ABRIR PRODUCTO
    ========================================= */

    function openProduct(card, data, trigger) {
        if (!modal || !dialog || !modalImage || !modalTitle || !modalSizes) {
            console.error("No se encontró la estructura necesaria del modal.");
            return;
        }

        activeProduct = { card, data };
        activeImageIndex = 0;
        selectedSize = "";
        previousFocus = trigger;

        const soldOut = Number(data.stock) <= 0;
        const name = getProductName(card);
        const price = getProductPrice(card);
        const color = card.querySelector(".men-product-card__color")?.textContent.trim() || "";

        modalTitle.textContent = name;

        if (modalPrice) modalPrice.textContent = formatPrice(price);

        if (modalDescription) {
            modalDescription.textContent = color
                ? `${data.description} Colores: ${color}.`
                : data.description;
        }

        if (modalStock) {
            modalStock.textContent = soldOut
                ? "Producto agotado · 0 unidades disponibles"
                : `${data.stock} ${data.stock === 1 ? "unidad disponible" : "unidades disponibles"}`;
        }

        if (modalAction) {
            modalAction.disabled = soldOut;
            modalAction.textContent = soldOut
                ? "PRODUCTO AGOTADO"
                : "SELECCIONA UNA TALLA";
        }

        if (modalSelectedSize) {
            modalSelectedSize.textContent = "Selecciona una talla";
        }

        renderThumbnails(data.images || []);
        renderSizes(data.sizes || [], Number(data.stock));
        showImage(0);

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("product-modal-open");

        dialog.focus();
    }

    /* =========================================
       MINIATURAS DE LA GALERÍA
    ========================================= */

    function renderThumbnails(images) {
        if (!modalThumbnails) return;

        modalThumbnails.replaceChildren();

        images.forEach((src, index) => {
            const thumbnail = document.createElement("button");
            const image = document.createElement("img");

            thumbnail.type = "button";
            thumbnail.className = "product-modal__thumbnail";
            thumbnail.setAttribute("aria-label", `Mostrar fotografía ${index + 1}`);

            image.src = normalizarURL(src);
            image.alt = "";
            image.loading = "lazy";
            image.decoding = "async";

            thumbnail.appendChild(image);
            thumbnail.addEventListener("click", () => showImage(index));

            modalThumbnails.appendChild(thumbnail);
        });
    }

    /* =========================================
       MOSTRAR FOTOGRAFÍA
    ========================================= */

    function showImage(index) {
        if (!activeProduct || !modalImage) return;

        const images = activeProduct.data.images || [];
        if (!images.length) return;

        activeImageIndex = (index + images.length) % images.length;

        modalImage.onerror = () => {
            modalImage.alt = "No se pudo cargar esta fotografía.";
        };

        modalImage.src = normalizarURL(images[activeImageIndex]);
        modalImage.alt =
            `${getProductName(activeProduct.card)}, fotografía ${activeImageIndex + 1}`;

        if (modalCounter) {
            modalCounter.textContent =
                `${String(activeImageIndex + 1).padStart(2, "0")} / ` +
                `${String(images.length).padStart(2, "0")}`;
        }

        if (modalThumbnails) {
            [...modalThumbnails.children].forEach((button, buttonIndex) => {
                const active = buttonIndex === activeImageIndex;

                button.classList.toggle("is-active", active);
                button.setAttribute("aria-current", String(active));
            });
        }
    }

    /* =========================================
       TALLAS DEL MODAL
    ========================================= */

    function renderSizes(sizes, stock) {
        if (!modalSizes) return;

        modalSizes.replaceChildren();

        sizes.forEach(size => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "product-modal__size";
            button.textContent = size;
            button.setAttribute("aria-pressed", "false");
            button.disabled = stock <= 0;

            button.addEventListener("click", () => {
                if (stock <= 0) return;

                selectedSize = size;

                [...modalSizes.querySelectorAll("button")].forEach(other => {
                    const active = other === button;

                    other.classList.toggle("is-selected", active);
                    other.setAttribute("aria-pressed", String(active));
                });

                if (modalSelectedSize) {
                    modalSelectedSize.textContent = `Talla seleccionada: ${size}`;
                }

                if (modalAction) {
                    modalAction.disabled = false;
                    modalAction.textContent = `TALLA ${size} SELECCIONADA`;
                }
            });

            modalSizes.appendChild(button);
        });
    }

    /* =========================================
       CERRAR PRODUCTO
    ========================================= */

    function closeProduct() {
        if (!modal || modal.hidden) return;

        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("product-modal-open");

        activeProduct = null;
        selectedSize = "";

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }

        previousFocus = null;
    }

    modal?.querySelectorAll("[data-modal-close]").forEach(element => {
        element.addEventListener("click", closeProduct);
    });

    /* =========================================
       CONTROLES DE GALERÍA
    ========================================= */

    previousButton?.addEventListener("click", () => {
        if (activeProduct) showImage(activeImageIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        if (activeProduct) showImage(activeImageIndex + 1);
    });

    document.addEventListener("keydown", event => {
        if (!modal || modal.hidden) return;

        if (event.key === "Escape") closeProduct();
        if (event.key === "ArrowLeft") showImage(activeImageIndex - 1);
        if (event.key === "ArrowRight") showImage(activeImageIndex + 1);
    });

    /* =========================================
       ACCIÓN PROVISIONAL DEL MODAL
       Todavía no procesa compras.
    ========================================= */

    modalAction?.addEventListener("click", () => {
        if (!activeProduct || !selectedSize || activeProduct.data.stock <= 0) {
            return;
        }

        modalAction.textContent = `TALLA ${selectedSize} SELECCIONADA`;
    });

    /* =========================================
       FILTROS
    ========================================= */

    filters.forEach(filter => {
        filter.addEventListener("click", () => {
            const category = filter.dataset.filter || "all";

            filters.forEach(button => {
                const active = button === filter;

                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            let visibleCount = 0;

            products.forEach(card => {
                const matches =
                    category === "all" ||
                    card.dataset.category === category;

                card.hidden = !matches;

                if (matches) visibleCount++;
            });

            const count = document.getElementById("product-count");

            if (count) {
                count.textContent = String(visibleCount).padStart(2, "0");
            }
        });
    });
});
