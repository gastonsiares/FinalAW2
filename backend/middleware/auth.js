import jwt from 'jsonwebtoken';

const SECRET = "CWBj4eQ9HnI59YttGKMhXJOZByri63tMZf2jLXKmIFi6IoPShLcB7WyyVfkaoOEL"; 

export function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}
