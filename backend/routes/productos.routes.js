
const express = require("express");
const router = express.Router();

const db = require("../config/database");

const CATEGORIAS_VALIDAS = ["hombre", "mujer", "unisex"];

const URL_BASE = (process.env.URL_BASE || `http://localhost:${process.env.PORT || 3000}`)
    .replace(/\/+$/, "");

// Obtener las imágenes de un producto.
async function obtenerImagenes(productoId, conexion = db) {
    const [imagenes] = await conexion.execute(
        `SELECT
            id,
            producto_id,
            perfil,
            ruta,
            imagen_principal,
            orden,
            fecha_creacion
         FROM producto_imagenes
         WHERE producto_id = ?
         ORDER BY imagen_principal DESC, orden ASC, id ASC`,
        [productoId]
    );

    return imagenes.map((imagen) => ({
        ...imagen,
        url: `${URL_BASE}${imagen.ruta}`
    }));
}

// Validar y normalizar los datos recibidos de un producto.
function validarProducto(datos, requiereTallas = true) {
    const {
        nombre,
        categoria,
        precio,
        descripcion,
        tallas,
        publicado,
        activo
    } = datos;

    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        nombre.trim().length > 150
    ) {
        return {
            error: "El nombre es obligatorio y debe tener máximo 150 caracteres"
        };
    }

    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
        return {
            error: "La categoría debe ser hombre, mujer o unisex"
        };
    }

    const precioNumero = Number(precio);

    if (
        precio === undefined ||
        precio === null ||
        precio === "" ||
        !Number.isFinite(precioNumero) ||
        precioNumero < 0
    ) {
        return {
            error: "El precio debe ser un número mayor o igual a cero"
        };
    }

    if (
        descripcion !== undefined &&
        descripcion !== null &&
        typeof descripcion !== "string"
    ) {
        return {
            error: "La descripción debe ser texto"
        };
    }

    if (descripcion && descripcion.length > 10000) {
        return {
            error: "La descripción no puede superar los 10000 caracteres"
        };
    }

    if (
        publicado !== undefined &&
        publicado !== true &&
        publicado !== false &&
        publicado !== 0 &&
        publicado !== 1
    ) {
        return {
            error: "El estado publicado debe ser verdadero o falso"
        };
    }

    if (
        activo !== undefined &&
        activo !== true &&
        activo !== false &&
        activo !== 0 &&
        activo !== 1
    ) {
        return {
            error: "El estado activo debe ser verdadero o falso"
        };
    }

    const resultado = {
        nombre: nombre.trim(),
        categoria,
        precio: precioNumero,
        descripcion: descripcion?.trim() || null,
        publicado:
            publicado === undefined
                ? false
                : publicado === true || publicado === 1,
        activo:
            activo === undefined
                ? true
                : activo === true || activo === 1
    };

    if (requiereTallas || tallas !== undefined) {
        if (!Array.isArray(tallas)) {
            return {
                error: "Debes enviar un arreglo de tallas"
            };
        }

        const tallasNormalizadas = [];
        const tallasRegistradas = new Set();

        for (const item of tallas) {
            if (
                !item ||
                typeof item.talla !== "string" ||
                !item.talla.trim() ||
                item.talla.trim().length > 20 ||
                !Number.isSafeInteger(item.stock) ||
                item.stock < 0
            ) {
                return {
                    error: "Cada talla debe tener un nombre válido y un stock entero no negativo"
                };
            }

            const talla = item.talla.trim();
            const clave = talla.toLowerCase();

            if (tallasRegistradas.has(clave)) {
                return {
                    error: `La talla ${talla} está repetida`
                };
            }

            tallasRegistradas.add(clave);

            tallasNormalizadas.push({
                talla,
                stock: item.stock
            });
        }

        resultado.tallas = tallasNormalizadas;
    }

    return {
        producto: resultado
    };
}


// GET /api/productos
// Consultar productos publicados y activos, incluidas sus imágenes.
router.get("/", async (req, res) => {
    try {
        const { categoria } = req.query;

        if (categoria && !CATEGORIAS_VALIDAS.includes(categoria)) {
            return res.status(400).json({
                success: false,
                mensaje: "La categoría debe ser hombre, mujer o unisex"
            });
        }

        let sql = `
            SELECT
                p.id,
                p.nombre,
                p.categoria,
                p.precio,
                p.descripcion,
                p.publicado,
                p.activo,
                p.fecha_creacion,
                p.fecha_actualizacion
            FROM productos p
            WHERE p.publicado = TRUE
              AND p.activo = TRUE
        `;

        const parametros = [];

        if (categoria) {
            sql += " AND p.categoria = ?";
            parametros.push(categoria);
        }

        sql += " ORDER BY p.fecha_creacion DESC";

        const [productos] = await db.query(sql, parametros);

        for (const producto of productos) {
            producto.imagenes = await obtenerImagenes(producto.id);

            producto.imagen_principal =
                producto.imagenes.find(
                    (imagen) =>
                        imagen.imagen_principal === 1 ||
                        imagen.imagen_principal === true
                ) || producto.imagenes[0] || null;
        }

        return res.json({
            success: true,
            total: productos.length,
            productos
        });
    } catch (error) {
        console.error(
            "Error al consultar productos:",
            error.message
        );

        return res.status(500).json({
            success: false,
            mensaje: "Error al consultar los productos"
        });
    }
});


// POST /api/productos
// Crear un producto como borrador, con tallas e inventario.
router.post("/", async (req, res) => {
    const validacion = validarProducto({
        ...req.body,
        publicado: false,
        activo: true
    });

    if (validacion.error) {
        return res.status(400).json({
            success: false,
            mensaje: validacion.error
        });
    }

    const producto = validacion.producto;
    let conexion;

    try {
        conexion = await db.getConnection();
        await conexion.beginTransaction();

        const [resultado] = await conexion.execute(
            `INSERT INTO productos
                (nombre, categoria, precio, descripcion, publicado, activo)
             VALUES (?, ?, ?, ?, FALSE, TRUE)`,
            [
                producto.nombre,
                producto.categoria,
                producto.precio,
                producto.descripcion
            ]
        );

        const productoId = resultado.insertId;

        for (const item of producto.tallas) {
            await conexion.execute(
                `INSERT INTO producto_tallas
                    (producto_id, talla, stock)
                 VALUES (?, ?, ?)`,
                [productoId, item.talla, item.stock]
            );
        }

        await conexion.commit();

        return res.status(201).json({
            success: true,
            mensaje: "Producto creado como borrador",
            producto: {
                id: productoId,
                ...producto,
                publicado: false,
                activo: true,
                tallas: producto.tallas,
                imagenes: [],
                imagen_principal: null
            }
        });
    } catch (error) {
        if (conexion) {
            try {
                await conexion.rollback();
            } catch (rollbackError) {
                console.error(
                    "Error al revertir:",
                    rollbackError.message
                );
            }
        }

        console.error(
            "Error al crear producto:",
            error.message
        );

        return res.status(500).json({
            success: false,
            mensaje: "No se pudo crear el producto"
        });
    } finally {
        if (conexion) conexion.release();
    }
});


// GET /api/productos/admin/todos
// Consultar todos los productos con sus tallas e imágenes.
router.get("/admin/todos", async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT
                p.id,
                p.nombre,
                p.categoria,
                p.precio,
                p.descripcion,
                p.publicado,
                p.activo,
                p.fecha_creacion,
                p.fecha_actualizacion
            FROM productos p
            ORDER BY p.fecha_creacion DESC
        `);

        for (const producto of productos) {
            const [tallas] = await db.execute(
                `SELECT talla, stock
                 FROM producto_tallas
                 WHERE producto_id = ?
                 ORDER BY talla`,
                [producto.id]
            );

            producto.tallas = tallas;
            producto.imagenes = await obtenerImagenes(producto.id);

            producto.imagen_principal =
                producto.imagenes.find(
                    (imagen) =>
                        imagen.imagen_principal === 1 ||
                        imagen.imagen_principal === true
                ) || producto.imagenes[0] || null;
        }

        return res.json({
            success: true,
            total: productos.length,
            productos
        });
    } catch (error) {
        console.error(
            "Error al consultar todos los productos:",
            error.message
        );

        return res.status(500).json({
            success: false,
            mensaje: "No se pudieron consultar los productos"
        });
    }
});


// PUT /api/productos/:id
// Editar información, tallas, inventario y estado de publicación.
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            mensaje: "El ID del producto no es válido"
        });
    }

    const validacion = validarProducto(req.body);

    if (validacion.error) {
        return res.status(400).json({
            success: false,
            mensaje: validacion.error
        });
    }

    const producto = validacion.producto;
    let conexion;

    try {
        conexion = await db.getConnection();
        await conexion.beginTransaction();

        const [existentes] = await conexion.execute(
            "SELECT id FROM productos WHERE id = ? FOR UPDATE",
            [id]
        );

        if (existentes.length === 0) {
            await conexion.rollback();

            return res.status(404).json({
                success: false,
                mensaje: "El producto no existe"
            });
        }

        await conexion.execute(
            `UPDATE productos
             SET nombre = ?,
                 categoria = ?,
                 precio = ?,
                 descripcion = ?,
                 publicado = ?,
                 activo = ?
             WHERE id = ?`,
            [
                producto.nombre,
                producto.categoria,
                producto.precio,
                producto.descripcion,
                producto.publicado ? 1 : 0,
                producto.activo ? 1 : 0,
                id
            ]
        );

        await conexion.execute(
            "DELETE FROM producto_tallas WHERE producto_id = ?",
            [id]
        );

        for (const item of producto.tallas) {
            await conexion.execute(
                `INSERT INTO producto_tallas
                    (producto_id, talla, stock)
                 VALUES (?, ?, ?)`,
                [id, item.talla, item.stock]
            );
        }

        await conexion.commit();

        const imagenes = await obtenerImagenes(id);

        return res.json({
            success: true,
            mensaje: "Producto actualizado correctamente",
            producto: {
                id,
                ...producto,
                imagenes,
                imagen_principal:
                    imagenes.find(
                        (imagen) =>
                            imagen.imagen_principal === 1 ||
                            imagen.imagen_principal === true
                    ) || imagenes[0] || null
            }
        });
    } catch (error) {
        if (conexion) {
            try {
                await conexion.rollback();
            } catch (rollbackError) {
                console.error(
                    "Error al revertir:",
                    rollbackError.message
                );
            }
        }

        console.error(
            "Error al actualizar producto:",
            error.message
        );

        return res.status(500).json({
            success: false,
            mensaje: "No se pudo actualizar el producto"
        });
    } finally {
        if (conexion) conexion.release();
    }
});


/*
 * DELETE /api/productos/:id
 * Desactivar un producto sin eliminarlo de MySQL.
 *
 * IMPORTANTE:
 * Esta ruta aún no tiene autenticación.
 * Mantener el backend en desarrollo local.
 */
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            mensaje: "El ID del producto no es válido"
        });
    }

    try {
        const [resultado] = await db.execute(
            `UPDATE productos
             SET activo = FALSE,
                 publicado = FALSE
             WHERE id = ? AND activo = TRUE`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "El producto no existe o ya está desactivado"
            });
        }

        return res.json({
            success: true,
            mensaje: "Producto desactivado correctamente",
            id
        });
    } catch (error) {
        console.error(
            "Error al desactivar producto:",
            error.message
        );

        return res.status(500).json({
            success: false,
            mensaje: "No se pudo desactivar el producto"
        });
    }
});


module.exports = router;
