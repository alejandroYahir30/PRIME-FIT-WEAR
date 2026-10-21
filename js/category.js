/* =========================================
   PRIME FIT WEAR
   Catálogo, inventario, galería y modal
   Colecciones: Hombre / Mujer / Unisex
========================================= */

document.addEventListener("DOMContentLoaded", () => {
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

    let activeProduct = null;
    let activeImageIndex = 0;
    let selectedSize = "";
    let previousFocus = null;

    /* =========================================
       DATOS DE HOMBRE
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

    /* =========================================
       DATOS DE MUJER
    ========================================= */

    const womenProducts = {
        "prime-sculpt-leggings": {
            stock: 14,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Leggings de silueta estilizada para entrenamientos y looks deportivos. Diseñados para acompañar tus movimientos con comodidad.",
            images: [
                "https://images.unsplash.com/photo-1506629905607-d9c297d2c5c5?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-sports-bra": {
            stock: 10,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Top deportivo de diseño minimalista, pensado para complementar tus sesiones de entrenamiento y tus conjuntos activewear.",
            images: [
                "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-seamless-top": {
            stock: 16,
            sizes: ["XS", "S", "M", "L"],
            description: "Top seamless de estética limpia y versátil, ideal para combinar con leggings y prendas deportivas.",
            images: [
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-training-shorts-women": {
            stock: 9,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Short de entrenamiento pensado para ofrecer libertad de movimiento y un estilo deportivo fácil de combinar.",
            images: [
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-essential-hoodie-women": {
            stock: 7,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Hoodie esencial de estilo casual, ideal para complementar tus conjuntos deportivos antes o después de entrenar.",
            images: [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-performance-tee-women": {
            stock: 11,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Playera deportiva de diseño minimalista para entrenamientos, actividades cotidianas y conjuntos casuales.",
            images: [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        }
    };

    /* =========================================
       DATOS DE UNISEX
       PRIME Active Shorts queda agotado
       para demostrar el estado sin stock.
    ========================================= */

    const unisexProducts = {
        "prime-oversized-tee": {
            stock: 18,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Playera oversized unisex de estilo urbano. Su silueta relajada combina con prendas deportivas y outfits casuales.",
            images: [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-essential-jogger": {
            stock: 12,
            sizes: ["S", "M", "L", "XL"],
            description: "Jogger unisex de estilo minimalista, diseñado para aportar comodidad en tus entrenamientos y actividades cotidianas.",
            images: [
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-training-tee": {
            stock: 9,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Playera de entrenamiento ligera y versátil, ideal para acompañarte durante tus rutinas y actividades diarias.",
            images: [
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-active-shorts": {
            stock: 0,
            sizes: ["S", "M", "L", "XL"],
            description: "Short deportivo unisex de diseño funcional. Este producto se encuentra agotado en la demostración.",
            images: [
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-core-hoodie": {
            stock: 7,
            sizes: ["S", "M", "L", "XL"],
            description: "Hoodie unisex de corte relajado, ideal para completar conjuntos deportivos y looks casuales.",
            images: [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85"
            ]
        },

        "prime-everyday-tank": {
            stock: 11,
            sizes: ["XS", "S", "M", "L", "XL"],
            description: "Tank unisex de estética limpia y deportiva, pensado para entrenar o combinar con prendas esenciales.",
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

    function getProductData(card, index) {
        const id = card.dataset.productId;

        if (collection === "women") {
            return womenProducts[id] || null;
        }

        if (collection === "unisex") {
            return unisexProducts[id] || null;
        }

        return menProducts[index] || null;
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

        const soldOut = data.stock <= 0;

        card.classList.toggle("is-sold-out", soldOut);
        card.dataset.stock = String(data.stock);

        visual.classList.toggle("is-sold-out", soldOut);

        // Crear etiqueta de agotado sin duplicarla.
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

        // Disponibilidad debajo de la información del producto.
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

        // Tallas visibles en la propia tarjeta.
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

        data.sizes.forEach(size => {
            const sizeItem = document.createElement("span");
            sizeItem.className = "men-product-card__size";
            sizeItem.textContent = size;

            if (soldOut) {
                sizeItem.classList.add("is-disabled");
            }

            sizeList.appendChild(sizeItem);
        });

        // Impedir la selección de compra si está agotado.
        visual.setAttribute("aria-label", soldOut
            ? `Ver detalles de ${getProductName(card)}. Producto agotado.`
            : `Ver detalles de ${getProductName(card)}`);
    }

    /* =========================================
       PREPARAR TARJETAS
    ========================================= */

    products.forEach((card, index) => {
        const data = getProductData(card, index);
        const visual = card.querySelector(".men-product-card__visual");

        if (!data || !visual) {
            console.warn(
                "No se encontraron datos para:",
                card.dataset.productId || index
            );
            return;
        }

        card.dataset.productIndex = String(index);

        renderCardInventory(card, data);

        visual.setAttribute("data-product-view", "");
        visual.setAttribute("aria-haspopup", "dialog");

        let cover = visual.querySelector(".men-product-card__cover");

        if (!cover) {
            cover = document.createElement("img");
            cover.className = "men-product-card__cover";
            cover.alt = "";
            cover.loading = "lazy";
            cover.decoding = "async";
            visual.prepend(cover);
        }

        cover.src = data.images[0];

        cover.addEventListener("error", () => {
            cover.classList.add("image-unavailable");
        });

        cover.addEventListener("load", () => {
            cover.classList.remove("image-unavailable");
        });

        visual.addEventListener("click", event => {
            event.preventDefault();
            openProduct(card, data, visual);
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

        const soldOut = data.stock <= 0;
        const name = getProductName(card);
        const price = getProductPrice(card);
        const color = card.querySelector(".men-product-card__color")?.textContent.trim() || "";

        modalTitle.textContent = name;

        if (modalPrice) {
            modalPrice.textContent = formatPrice(price);
        }

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

        renderThumbnails(data.images);
        renderSizes(data.sizes, data.stock);
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

            image.src = src;
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

        const images = activeProduct.data.images;
        if (!images?.length) return;

        activeImageIndex = (index + images.length) % images.length;

        modalImage.onerror = () => {
            modalImage.alt = "No se pudo cargar esta fotografía.";
        };

        modalImage.src = images[activeImageIndex];
        modalImage.alt = `${getProductName(activeProduct.card)}, fotografía ${activeImageIndex + 1}`;

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