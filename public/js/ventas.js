// public/js/ventas.js
document.addEventListener('DOMContentLoaded', () => {
    const ventasContainer = document.getElementById('ventasContainer');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión para ver tus ventas.');
        window.location.href = '/auth/login.html';
        return;
    }

    fetch('http://localhost:3000/ventas/mis-ventas', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.status === 401 || res.status === 403) {
                alert('Sesión expirada. Iniciá sesión de nuevo.');
                localStorage.removeItem('token');
                window.location.href = '/auth/login.html';
            }
            return res.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                ventasContainer.innerHTML = '<p class="text-gray-600">No tenés ventas registradas aún.</p>';
                return;
            }

            data.forEach(venta => {
                const ventaDiv = document.createElement('div');
                ventaDiv.className = 'bg-white p-4 rounded shadow';

                let productosHTML = '';
                venta.productos.forEach(prod => {
                    productosHTML += `
            <li>
              ${prod.nombre} - ${prod.cantidad} x $${prod.precio_unitario.toFixed(2)}
            </li>`;
                });

                ventaDiv.innerHTML = `
          <h3 class="font-bold text-lg mb-1">Venta #${venta.id}</h3>
          <p><strong>Fecha:</strong> ${new Date(venta.fecha).toLocaleString()}</p>
          <p><strong>Dirección:</strong> ${venta.direccion}</p>
          <p><strong>Total:</strong> $${venta.total.toFixed(2)}</p>
          <ul class="list-disc pl-5 mt-2">${productosHTML}</ul>
        `;

                ventasContainer.appendChild(ventaDiv);
            });
        })
        .catch(err => {
            console.error('Error al cargar ventas:', err);
            ventasContainer.innerHTML = '<p class="text-red-500">Ocurrió un error al obtener tus ventas.</p>';
        });
});

// Botón para imprimir
// document.getElementById('btnImprimir').addEventListener('click', () => {
//     window.print();
// });

// Botón para descargar PDF
// document.getElementById('btnPDF').addEventListener('click', () => {
//     const ventas = document.getElementById('ventasContainer');
//     const opt = {
//         margin: 0.5,
//         filename: 'mis_ventas.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };

//     html2pdf().set(opt).from(ventas).save();
// });
