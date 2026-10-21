
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const router = express.Router();
const db = require("../config/database");

const carpetaUploads = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(carpetaUploads)) {
    fs.mkdirSync(carpetaUploads, { recursive: true });
}

const PERFILES_VALIDOS = [
    "frente",
    "espalda",
    "lateral",
    "detalle",
    "otro"
];

const TIPOS_VALIDOS = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

const almacenamiento = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, carpetaUploads);
    },
    filename: (req, file, callback) => {
        const extension = TIPOS_VALIDOS[file.mimetype];

        if (!extension) {
            return callback(
                new Error("Formato no permitido. Usa JPG, PNG o WEBP.")
            );
        }

        callback(null, `${crypto.randomUUID()}${extension}`);
    }
});

const subirImagen = multer({
    storage: almacenamiento,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, callback) => {
        if (!TIPOS_VALIDOS[file.mimetype]) {
            return callback(
                new Error("Formato no permitido. Usa JPG, PNG o WEBP.")
            );
        }

        callback(null, true);
    }
});

function validarId(valor) {
    const id = Number(valor);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// GET /api/imagenes/producto/:productoId
// Consultar las imágenes de un producto.
router.get("/producto/:productoId", async (req, res) => {
    const productoId = validarId(req.params.productoId);

    if (!productoId) {
        return res.status(400).json({
            success: false,
            mensaje: "El ID del producto no es válido"
        });
    }

    try {
        const [imagenes] = await db.execute(
            `SELECT id, producto_id, perfil, ruta,
                    imagen_principal, orden, fecha_creacion
             FROM producto_imagenes
             WHERE producto_id = ?
             ORDER BY imagen_principal DESC, orden ASC, id ASC`,
            [productoId]
        );

        return res.json({
            success: true,
            total: imagenes.length,
            imagenes
        });
    } catch (error) {
        console.error("Error al consultar imágenes:", error.message);

        return res.status(500).json({
            success: false,
            mensaje: "No se pudieron consultar las imágenes"
        });
    }
});

// POST /api/imagenes/producto/:productoId
// Subir una imagen. El archivo debe enviarse en el campo "imagen".
router.post(
    "/producto/:productoId",
    (req, res, next) => {
        subirImagen.single("imagen")(req, res, (error) => {
            if (!error) return next();

            const mensaje = error instanceof multer.MulterError
                ? error.code === "LIMIT_FILE_SIZE"
                    ? "La imagen no puede superar los 5 MB"
                    : "No se pudo procesar el archivo"
                : error.message;

            return res.status(400).json({
                success: false,
                mensaje
            });
        });
    },
    async (req, res) => {
        const productoId = validarId(req.params.productoId);

        if (!productoId) {
            if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(400).json({
                success: false,
                mensaje: "El ID del producto no es válido"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                mensaje: 'Debes adjuntar un archivo en el campo "imagen"'
            });
        }

        const perfil = req.body.perfil || "otro";
        const orden = req.body.orden === undefined
            ? 0
            : Number(req.body.orden);
        const principal = ["true", "1", "on"].includes(
            String(req.body.imagen_principal).toLowerCase()
        );

        if (!PERFILES_VALIDOS.includes(perfil)) {
            fs.unlink(req.file.path, () => {});
            return res.status(400).json({
                success: false,
                mensaje: "El perfil no es válido"
            });
        }

        if (!Number.isSafeInteger(orden) || orden < 0) {
            fs.unlink(req.file.path, () => {});
            return res.status(400).json({
                success: false,
                mensaje: "El orden debe ser un entero no negativo"
            });
        }

        let conexion;

        try {
            conexion = await db.getConnection();
            await conexion.beginTransaction();

            const [productos] = await conexion.execute(
                "SELECT id FROM productos WHERE id = ? FOR UPDATE",
                [productoId]
            );

            if (productos.length === 0) {
                await conexion.rollback();
                fs.unlink(req.file.path, () => {});

                return res.status(404).json({
                    success: false,
                    mensaje: "El producto no existe"
                });
            }

            if (principal) {
                await conexion.execute(
                    `UPDATE producto_imagenes
                     SET imagen_principal = FALSE
                     WHERE producto_id = ?`,
                    [productoId]
                );
            }

            const ruta = `/uploads/${req.file.filename}`;

            const [resultado] = await conexion.execute(
                `INSERT INTO producto_imagenes
                    (producto_id, perfil, ruta, imagen_principal, orden)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    productoId,
                    perfil,
                    ruta,
                    principal ? 1 : 0,
                    orden
                ]
            );

            await conexion.commit();

            return res.status(201).json({
                success: true,
                mensaje: "Imagen subida correctamente",
                imagen: {
                    id: resultado.insertId,
                    producto_id: productoId,
                    perfil,
                    ruta,
                    url: `http://localhost:${process.env.PORT || 3000}${ruta}`,
                    imagen_principal: principal,
                    orden
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

            fs.unlink(req.file.path, () => {});
            console.error("Error al guardar imagen:", error.message);

            return res.status(500).json({
                success: false,
                mensaje: "No se pudo guardar la imagen"
            });
        } finally {
            if (conexion) conexion.release();
        }
    }
);

// PUT /api/imagenes/:id/principal
// Marcar una imagen como principal para su producto.
router.put("/:id/principal", async (req, res) => {
    const imagenId = validarId(req.params.id);

    if (!imagenId) {
        return res.status(400).json({
            success: false,
            mensaje: "El ID de la imagen no es válido"
        });
    }

    let conexion;

    try {
        conexion = await db.getConnection();
        await conexion.beginTransaction();

        const [imagenes] = await conexion.execute(
            `SELECT id, producto_id
             FROM producto_imagenes
             WHERE id = ?
             FOR UPDATE`,
            [imagenId]
        );

        if (imagenes.length === 0) {
            await conexion.rollback();
            return res.status(404).json({
                success: false,
                mensaje: "La imagen no existe"
            });
        }

        const productoId = imagenes[0].producto_id;

        await conexion.execute(
            `UPDATE producto_imagenes
             SET imagen_principal = FALSE
             WHERE producto_id = ?`,
            [productoId]
        );

        await conexion.execute(
            `UPDATE producto_imagenes
             SET imagen_principal = TRUE
             WHERE id = ?`,
            [imagenId]
        );

        await conexion.commit();

        return res.json({
            success: true,
            mensaje: "Imagen principal actualizada",
            id: imagenId
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

        console.error("Error al cambiar imagen principal:", error.message);

        return res.status(500).json({
            success: false,
            mensaje: "No se pudo cambiar la imagen principal"
        });
    } finally {
        if (conexion) conexion.release();
    }
});

// DELETE /api/imagenes/:id
// Eliminar el registro y el archivo asociado.
router.delete("/:id", async (req, res) => {
    const imagenId = validarId(req.params.id);

    if (!imagenId) {
        return res.status(400).json({
            success: false,
            mensaje: "El ID de la imagen no es válido"
        });
    }

    let conexion;
    let rutaArchivo = null;

    try {
        conexion = await db.getConnection();
        await conexion.beginTransaction();

        const [imagenes] = await conexion.execute(
            `SELECT id, producto_id, ruta
             FROM producto_imagenes
             WHERE id = ?
             FOR UPDATE`,
            [imagenId]
        );

        if (imagenes.length === 0) {
            await conexion.rollback();
            return res.status(404).json({
                success: false,
                mensaje: "La imagen no existe"
            });
        }

        const imagen = imagenes[0];
        rutaArchivo = path.basename(imagen.ruta);

        await conexion.execute(
            "DELETE FROM producto_imagenes WHERE id = ?",
            [imagenId]
        );

        await conexion.commit();

        const rutaSegura = path.join(carpetaUploads, rutaArchivo);

        fs.unlink(rutaSegura, (error) => {
            if (error && error.code !== "ENOENT") {
                console.error(
                    "No se pudo eliminar el archivo:",
                    error.message
                );
            }
        });

        return res.json({
            success: true,
            mensaje: "Imagen eliminada correctamente",
            id: imagenId
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

        console.error("Error al eliminar imagen:", error.message);

        return res.status(500).json({
            success: false,
            mensaje: "No se pudo eliminar la imagen"
        });
    } finally {
        if (conexion) conexion.release();
    }
});

module.exports = router;
