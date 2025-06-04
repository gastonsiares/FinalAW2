import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/productos.json');

// GET /productos
router.get('/', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf-8');
    const productos = JSON.parse(data);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos' });
  }
});

// POST /productos
router.post('/', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf-8');
    const productos = JSON.parse(data);

    const nuevo = {
      id: Date.now(),
      ...req.body
    };

    productos.push(nuevo);
    await writeFile(filePath, JSON.stringify(productos, null, 2));
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el producto' });
  }
});

export default router;
