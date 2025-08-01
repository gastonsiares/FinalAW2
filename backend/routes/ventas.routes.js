import { Router } from 'express';
import connection from '../connection.js';
import { verificarToken } from '../middleware/auth.js';

const router = Router();

//Registrar una nueva venta
router.post('/', verificarToken, async (req, res) => {
    const { direccion, productos } = req.body;
    const id_usuario = req.user.id;

    if (!direccion || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const fecha = new Date();

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const [ventaResult] = await conn.query(
            'INSERT INTO ventas (id_usuario, fecha, direccion, total) VALUES (?, ?, ?, ?)',
            [id_usuario, fecha, direccion, total]
        );
        const id_venta = ventaResult.insertId;

        for (const producto of productos) {
            await conn.query(
                'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [id_venta, producto.id, producto.cantidad, producto.precio]
            );
        }

        await conn.commit();
        res.status(201).json({ msg: 'Venta registrada con éxito', id_venta });
    } catch (error) {
        await conn.rollback();
        console.error('Error al registrar venta:', error.message);
        res.status(500).json({ error: 'Error al registrar la venta' });
    } finally {
        conn.release();
    }
});

// Obtener ventas del usuario actual
router.get('/mis-ventas', verificarToken, async (req, res) => {
    const id_usuario = req.user.id;

    try {
        const [ventas] = await connection.query(
            'SELECT * FROM ventas WHERE id_usuario = ? ORDER BY fecha DESC',
            [id_usuario]
        );
        res.status(200).json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas del usuario:', error.message);
        res.status(500).json({ error: 'Error al obtener ventas' });
    }
});

//Obtener todas las ventas (solo para admin)
router.get('/admin', verificarToken, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    try {
        const [ventas] = await connection.query(`
            SELECT v.*, u.username 
            FROM ventas v
            JOIN users u ON v.id_usuario = u.id
            ORDER BY v.fecha DESC
        `);
        res.status(200).json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas para admin:', error.message);
        res.status(500).json({ error: 'Error al obtener ventas' });
    }
});

//NUEVA RUTA: Historial de compras detallado del usuario logueado
router.get('/historial', verificarToken, async (req, res) => {
    const idUsuario = req.user.id;

    try {
        const [ventas] = await connection.query(
            `SELECT v.id, v.fecha, v.total, 
                    GROUP_CONCAT(p.nombre, ' (x', dv.cantidad, ')') AS productos
             FROM ventas v
             JOIN detalle_ventas dv ON v.id = dv.id_venta
             JOIN productos p ON dv.id_producto = p.id
             WHERE v.id_usuario = ?
             GROUP BY v.id
             ORDER BY v.fecha DESC`, 
             [idUsuario]
        );

        res.status(200).json(ventas);
    } catch (error) {
        console.error('Error al obtener historial:', error.message);
        res.status(500).json({ error: 'Error al consultar historial de compras' });
    }
});

export default router;
