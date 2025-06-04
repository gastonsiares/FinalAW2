document.addEventListener('DOMContentLoaded', () => {
    const carritoContainer = document.getElementById('carritoContainer');
    const totalSpan = document.getElementById('totalCarrito');
    const btnComprar = document.getElementById('comprarBtn');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const usuarioActivo = 1; // Remplazar cuando usemos el login
    const direccion = "Av. Siempre Viva 742"; // Remplazar cuando usemos la direccion del usuario

    function renderCarrito() {
        carritoContainer.innerHTML = '';
        let total = 0;

        carrito.forEach((producto, index) => {
            total += producto.precio * producto.cantidad;

            const item = document.createElement('div');
            item.className = 'bg-white p-4 rounded shadow flex justify-between items-center';

            item.innerHTML = `
                <div>
                    <h2 class="font-bold">${producto.nombre}</h2>
                    <p>$${producto.precio.toFixed(2)} x ${producto.cantidad}</p>
                </div>
                <button class="text-red-600 hover:underline" data-index="${index}">Eliminar</button>
            `;

            carritoContainer.appendChild(item);
        });

        totalSpan.textContent = total.toFixed(2);

        // Botones para eliminar productos del carrito
        document.querySelectorAll('button[data-index]').forEach(btn => {
            btn.addEventListener('click', e => {
                const index = e.target.dataset.index;
                carrito.splice(index, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                renderCarrito();
            });
        });
    }

    renderCarrito();

    btnComprar.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const orden = {
            id_usuario: usuarioActivo,
            fecha: new Date().toISOString().split('T')[0],
            direccion,
            productos: carrito.map(p => ({
                id: p.id,
                cantidad: p.cantidad,
                precio_unitario: p.precio
            })),
            total: carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
        };

        fetch('http://localhost:3000/ventas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orden)
        })
        .then(res => {
            if (res.ok) {
                alert('¡Compra realizada con éxito!');
                localStorage.removeItem('carrito');
                location.reload();
            } else {
                alert('Error al procesar la compra');
            }
        })
        .catch(err => {
            console.error('Error al enviar la orden:', err);
            alert('Error al conectar con el servidor');
        });
    });
});
