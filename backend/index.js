import express from 'express';
import productosRoutes from './routes/productos.routes.js';
import ventasRoutes from './routes/ventas.routes.js';
import userRoutes from './routes/user.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import connection from './connection.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

//Redirige a home.html cuando accedés a la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/home.html'));
});

//Rutas de la API
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
