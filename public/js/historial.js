document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const container = document.getElementById('historialContainer');

  if (!token) {
    alert('Debes iniciar sesión para ver tu historial');
    return window.location.href = '/auth/login.html';
  }

  try {
    const res = await fetch('/ventas/historial', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) {
      alert('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      localStorage.removeItem('token');
      return window.location.href = '/auth/login.html';
    }

    const historial = await res.json();
    console.log('Historial recibido:', historial);

    if (!Array.isArray(historial) || historial.length === 0) {
      container.innerHTML = `<p class="text-gray-600">No tenés compras registradas aún.</p>`;
      return;
    }

    historial.forEach(venta => {
      const productosArray = venta.productos.split(',');
      const productosFormateados = productosArray
        .map(p => `<li class="ml-4 list-disc">${p.trim()}</li>`)
        .join('');

      const fecha = new Date(venta.fecha);
      const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()} - ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;

      const totalFormateado = Number(venta.total).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      const div = document.createElement('article');
      div.className = "border p-4 rounded shadow bg-gray-50";
      div.innerHTML = `
        <p><strong>🆔 N° Venta:</strong> ${venta.id}</p>
        <p><strong>📅 Fecha:</strong> ${fechaFormateada}</p>
        <p><strong>🛍️ Productos:</strong></p>
        <ul>${productosFormateados}</ul>
        <p class="mt-2"><strong>💵 Total:</strong> $${totalFormateado}</p>
      `;

      const btn = document.createElement('button');
      btn.textContent = '📥 Descargar comprobante';
      btn.className = 'mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700';
      btn.addEventListener('click', async () => {
        try {
          const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm');
          const doc = new jsPDF();

          doc.setFontSize(14);
          doc.text('Comprobante de Compra', 10, 20);
          doc.setFontSize(12);
          doc.text(`N° Venta: ${venta.id}`, 10, 30);
          doc.text(`Fecha: ${fechaFormateada}`, 10, 40);
          doc.text(`Total: $${totalFormateado}`, 10, 50);
          doc.text('Productos:', 10, 60);

          productosArray.forEach((prod, i) => {
            doc.text(`• ${prod.trim()}`, 15, 70 + i * 10);
          });

          doc.save(`venta-${venta.id}.pdf`);
        } catch (err) {
          console.error('Error al generar PDF:', err);
          alert('Ocurrió un error al generar el comprobante.');
        }
      });

      div.appendChild(btn);
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-red-600">Error al cargar el historial de compras.</p>`;
  }
});
