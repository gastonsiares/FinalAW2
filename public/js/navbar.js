document.addEventListener('DOMContentLoaded', async () => {
    const placeholder = document.getElementById('navbar');
    if (!placeholder) return;

    const res = await fetch('/components/navbar.html');
    const html = await res.text();
    placeholder.innerHTML = html;

    const navbarUser = document.getElementById('navbarUser');
    const token = localStorage.getItem('token');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalCantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    if (token) {
        try {
            const response = await fetch('/user/decodeToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            const data = await response.json();

            if (data.username) {
                let links = `
          <div class="flex items-center space-x-12">
            <span>👋 Hola, <strong>${data.username}</strong></span>
            <a href="/pages/carrito.html" class="text-blue-600 underline">
              🛒Carrito <span id="carritoCantidad" class="ml-1 bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-sm">${totalCantidad}</span>
            </a>
        `;

                if (data.rol === 'admin') {
                    links += `
            <a href="/pages/ventas.html" class="text-purple-600 underline">📊 Ver ventas</a>
          `;
                }

                links += `
            <button id="logoutBtn" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white">Cerrar sesión</button>
          </div>
        `;

                navbarUser.innerHTML = links;

                document.getElementById('logoutBtn').addEventListener('click', () => {
                    localStorage.removeItem('token');
                    window.location.href = '/auth/login.html';
                });

                return;
            }
        } catch (error) {
            console.warn('Token inválido o expirado');
        }
    }

    navbarUser.innerHTML = `
    <div class="flex items-center space-x-4">
      <a href="/auth/login.html" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">Login</a>
      <a href="/auth/register.html" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">Registrarse</a>
    </div>
  `;
});

export function actualizarCantidadNavbar() {
    const carritoCantidad = document.getElementById('carritoCantidad');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carritoCantidad) {
        carritoCantidad.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    }
}
