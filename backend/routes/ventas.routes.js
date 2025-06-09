// backend/routes/ventas.routes.js
import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { verificarToken } from "../middleware/auth.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/ventas.json');

// Ruta protegida con JWT
router.post('/', verificarToken, async (req, res) => {
    try {
        const ventasRaw = await readFile(filePath, 'utf-8');
        const ventas = JSON.parse(ventasRaw);

        const nuevaVenta = {
            id: Date.now(),
            id_usuario: req.user.id, // lo toma del token
            fecha: new Date().toISOString().split('T')[0],
            ...req.body
        };

        ventas.push(nuevaVenta);
        await writeFile(filePath, JSON.stringify(ventas, null, 2));

        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la venta' });
    }
});

export default router;
