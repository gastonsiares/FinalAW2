import { Router } from 'express';
import connection from '../connection.js';

const router = Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [rows] = await connection.query(
      'SELECT id, nombre, descripcion, categoria, precio, imagen FROM productos'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error al leer los productos' });
  }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  const { nombre, descripcion, categoria, precio, imagen } = req.body;

  if (!nombre || !categoria || !precio || !imagen) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const [result] = await connection.query(
      'INSERT INTO productos (nombre, descripcion, categoria, precio, imagen) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion || '', categoria, precio, imagen]
    );
    res.status(201).json({ msg: 'Producto agregado', id: result.insertId });
  } catch (error) {
    console.error('Error al agregar producto:', error.message);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Modificar un producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoria, precio, imagen } = req.body;

  if (!nombre || !categoria || !precio || !imagen) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const [result] = await connection.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, categoria = ?, precio = ?, imagen = ? WHERE id = ?',
      [nombre, descripcion || '', categoria, precio, imagen, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ msg: 'Producto actualizado' });
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await connection.query(
      'DELETE FROM productos WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ msg: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;
