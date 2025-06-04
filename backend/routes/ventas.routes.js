import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/ventas.json');

// GET para ver todas las ventas
router.get('/', async (req, res) => {
    try {
        const ventasRaw = await readFile(filePath, 'utf-8');
        const ventas = JSON.parse(ventasRaw);
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer ventas' });
    }
});

// POST para guardar una nueva venta
router.post('/', async (req, res) => {
    try {
        const ventasRaw = await readFile(filePath, 'utf-8');
        const ventas = JSON.parse(ventasRaw);

        const nuevaVenta = {
            id: Date.now(),
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
