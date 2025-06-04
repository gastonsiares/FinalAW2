document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('ventasContainer');

    fetch('http://localhost:3000/ventas')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                container.innerHTML = '<p class="text-gray-600">No hay ventas registradas.</p>';
                return;
            }

            data.forEach(venta => {
                const div = document.createElement('div');
                div.className = 'bg-white p-4 rounded shadow';

                const productosHTML = venta.productos.map(p => `
          <li>${p.cantidad} x ID ${p.id} ($${p.precio_unitario})</li>
        `).join('');

                div.innerHTML = `
          <h3 class="font-bold text-lg">Venta #${venta.id}</h3>
          <p><strong>Usuario ID:</strong> ${venta.id_usuario}</p>
          <p><strong>Fecha:</strong> ${venta.fecha}</p>
          <p><strong>Dirección:</strong> ${venta.direccion}</p>
          <p><strong>Total:</strong> $${venta.total.toFixed(2)}</p>
          <ul class="list-disc list-inside mt-2">${productosHTML}</ul>
        `;

                container.appendChild(div);
            });
        })
        .catch(err => {
            container.innerHTML = `<p class="text-red-600">Error al cargar las ventas: ${err.message}</p>`;
        });
});
