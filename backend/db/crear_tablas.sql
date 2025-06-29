-- Nombre de la base de datos tienda_aw2

-- Eliminar tablas si ya existen (orden correcto por claves foráneas)
DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') DEFAULT 'cliente'
);
-- Insertar usuarios preexistentes
-- contraseñas: 1:123456789 2:12345678
INSERT INTO usuarios (id, name, lastname, email, username, pass, rol) VALUES
(1, 'Gaston', 'Siares', 'gastons@gmail.com', 'GastonSiares', '$2b$08$PTPCMioAclsgj49idtZHze/ypSo8lhA4.EIvhiOHrER70HoOQj32q', 'admin'),
(2, 'Facundo', 'Nievas', 'Facu1@gmail.com', 'Facu1', '$2b$08$VZRIEAer3G6U.hSmvVQODu1G/usmTrIJH2di0vTWxPbazpiFAZRte', 'cliente');
-- Crear tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(255)
);

-- Crear tabla de ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    direccion VARCHAR(255) NOT NULL,
    total DECIMAL(10,2),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Crear tabla de detalle de ventas
CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);
