
Proyecto final AW2.

---

# Descripción general

Tienda 5-5 es una aplicación web de comercio electrónico desarrollada con tecnologías vistas durante el curso. Permite a los usuarios:

- Registrarse e iniciar sesión.
- Ver productos y agregarlos al carrito.
- Realizar compras (ventas).
- Ver su historial de compras.
- Descargar comprobantes de cada venta en formato PDF.

---

#Tecnologías utilizadas

- **Frontend:** HTML, JavaScript, Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Autenticación:** JWT
- **PDF Generator:** jsPDF
- **Control de sesión:** LocalStorage

---

##Funcionalidades generales

- Registro e inicio de sesión de usuarios con JWT.
- Productos organizados por categoría.
- Carrito de compras persistente en LocalStorage.
- Registro de ventas (usuario, productos, dirección, total).
- Visualización de historial de compras personales.
- **Nueva funcionalidad destacada:** generación de comprobante PDF por cada venta.

#Mejora significativa incorporada

# Descarga de comprobantes en PDF


Se incorporó la posibilidad de que el usuario **genere y descargue un comprobante PDF** por cada venta que aparece en su historial.

#¿Por qué es una mejora significativa?

- Aporta una funcionalidad realista y útil en cualquier sistema de e-commerce.
- Aplica conceptos clave del curso: manipulación del DOM, llamadas a API, programación modular.
- Introduce el uso de bibliotecas externas (`jsPDF`) para exportación de contenido.

