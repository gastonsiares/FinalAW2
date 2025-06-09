// public/js/carrito.js
document.addEventListener('DOMContentLoaded', () => {
    const carritoContainer = document.getElementById('carritoContainer');
    const totalSpan = document.getElementById('totalCarrito');
    const btnComprar = document.getElementById('comprarBtn');
    const direccionInput = document.getElementById('direccion');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const token = localStorage.getItem('token');

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

        if (!token) {
            alert('Debes iniciar sesión para realizar una compra.');
            window.location.href = '/auth/login.html';
            return;
        }

        const direccion = direccionInput.value.trim();
        if (!direccion) {
            alert('Por favor ingresá una dirección de envío.');
            return;
        }

        const orden = {
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orden)
        })
            .then(res => {
                if (res.ok) {
                    alert('¡Compra realizada con éxito!');
                    localStorage.removeItem('carrito');
                    location.reload();
                } else if (res.status === 401 || res.status === 403) {
                    alert('No estás autorizado. Inicia sesión nuevamente.');
                    localStorage.removeItem('token');
                    window.location.href = '/auth/login.html';
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
