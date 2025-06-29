import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',            // Cambiar cuando tenga contraseña en MySQL
    database: 'tienda_aw2', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//Verificamos conexión inicial
try {
    const connection = await pool.getConnection();
    console.log('Conectado a la base de datos');
    connection.release();
} catch (err) {
    console.error('Error al conectar con la base de datos:', err);
}

export default pool;
