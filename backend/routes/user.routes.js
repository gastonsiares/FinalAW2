import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connection from '../connection.js';

const router = Router();
const SECRET = 'CWBj4eQ9HnI59YttGKMhXJOZByri63tMZf2jLXKmIFi6IoPShLcB7WyyVfkaoOEL';

// LOGIN
router.post('/login', async (req, res) => {
  const { username, pass } = req.body;

  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ status: false, msg: 'Usuario no encontrado' });
    }

    const isValid = bcrypt.compareSync(pass, user.pass);
    if (!isValid) {
      return res.status(401).json({ status: false, msg: 'Contraseña incorrecta' });
    }

    //Incluye rol en el token
    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      SECRET,
      { expiresIn: '24h' }
    );


    res.status(200).json({ token, status: true });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ status: false, msg: 'Error interno del servidor' });
  }
});

// REGISTRO
router.post('/register', async (req, res) => {
  const { name, lastname, email, username, pass, rol = 'cliente' } = req.body;

  try {
    const [existing] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ status: false, msg: 'El usuario ya existe' });
    }

    const hashedPass = bcrypt.hashSync(pass, 8);

    await connection.query(
      'INSERT INTO users (name, lastname, email, username, pass, rol) VALUES (?, ?, ?, ?, ?, ?)',
      [name, lastname, email, username, hashedPass, rol]
    );

    res.status(201).json({ status: true, msg: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ status: false, msg: 'Error al registrar usuario' });
  }
});


// DECODIFICAR TOKEN
router.post('/decodeToken', (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET);
    res.status(200).json(decoded);
  } catch (err) {
    res.status(401).json({ status: false, msg: 'Token inválido' });
  }
});

export default router;
