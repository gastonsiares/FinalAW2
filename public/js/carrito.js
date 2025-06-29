import { actualizarCantidadNavbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('carritoContainer');
    const totalSpan = document.getElementById('totalCarrito');
    const comprarBtn = document.getElementById('comprarBtn');
    const direccionInput = document.getElementById('direccion');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function renderCarrito() {
        container.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            container.innerHTML = '<p class="text-gray-600">El carrito está vacío</p>';
            totalSpan.textContent = '0.00';
            return;
        }

        carrito.forEach((producto, index) => {
            const precio = Number(producto.precio);
            const subtotal = precio * producto.cantidad;
            total += subtotal;

            const item = document.createElement('div');
            item.className = 'bg-white p-4 rounded shadow';

            item.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="w-20 h-20 object-cover rounded" />
                        <div>
                            <h3 class="text-lg font-semibold">${producto.nombre}</h3>
                            <p class="text-gray-600">${producto.descripcion}</p>
                            <p class="text-green-600 font-bold">$${subtotal.toFixed(2)}</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <button class="disminuir px-2 bg-gray-300">-</button>
                                <span>${producto.cantidad}</span>
                                <button class="aumentar px-2 bg-gray-300">+</button>
                                <button class="eliminar text-red-600 ml-4">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            item.querySelector('.aumentar').addEventListener('click', () => {
                carrito[index].cantidad++;
                actualizarStorageYRender();
            });

            item.querySelector('.disminuir').addEventListener('click', () => {
                if (carrito[index].cantidad > 1) {
                    carrito[index].cantidad--;
                    actualizarStorageYRender();
                }
            });

            item.querySelector('.eliminar').addEventListener('click', () => {
                carrito.splice(index, 1);
                actualizarStorageYRender();
            });

            container.appendChild(item);
        });

        totalSpan.textContent = total.toFixed(2);
    }

    function actualizarStorageYRender() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderCarrito();
        actualizarCantidadNavbar();
    }

    //Comprar
    comprarBtn.addEventListener('click', async () => {
        const direccion = direccionInput.value.trim();
        if (!direccion) {
            alert('Debes ingresar una dirección de envío.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes estar logueado para comprar.');
            return;
        }

        try {
            const res = await fetch('/ventas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ direccion, productos: carrito })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Compra realizada con éxito');
                localStorage.removeItem('carrito');
                location.reload();
            } else {
                alert(data.msg || 'Error al procesar la compra');
            }
        } catch (err) {
            console.error('Error al comprar:', err);
            alert('Error en la conexión con el servidor');
        }
    });

    renderCarrito();
});
