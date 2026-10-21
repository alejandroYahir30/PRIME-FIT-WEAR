
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/database");
const productosRoutes = require("./routes/productos.routes");
const imagenesRoutes = require("./routes/imagenes.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración general
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir las imágenes guardadas en backend/uploads
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Rutas de productos
app.use("/api/productos", productosRoutes);
app.use("/api/imagenes", imagenesRoutes);

// Verificar servidor y conexión con MySQL
app.get("/api/estado", async (req, res) => {
    try {
        const [resultado] = await db.query("SELECT 1 AS conexion");

        res.json({
            success: true,
            mensaje: "Servidor de PRIME FIT WEAR funcionando correctamente",
            baseDatos: resultado[0].conexion === 1
                ? "Conectada correctamente"
                : "Sin conexión"
        });
    } catch (error) {
        console.error(
            "Error de conexión con MySQL:",
            error.message
        );

        res.status(500).json({
            success: false,
            mensaje:
                "El servidor funciona, pero no pudo conectarse a MySQL"
        });
    }
});

// Ruta para comprobar que la API responde
app.get("/", (req, res) => {
    res.json({
        success: true,
        mensaje: "API de PRIME FIT WEAR"
    });
});

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        mensaje: "Ruta no encontrada"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(
        `Servidor iniciado en http://localhost:${PORT}`
    );
});
