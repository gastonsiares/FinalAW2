// public/js/navbar.js
document.addEventListener('DOMContentLoaded', async () => {
    const placeholder = document.getElementById('navbar');
    if (!placeholder) return;

    // Cargar HTML del navbar
    const res = await fetch('/components/navbar.html');
    const html = await res.text();
    placeholder.innerHTML = html;

    const navbarUser = document.getElementById('navbarUser');
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const response = await fetch('/user/decodeToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            const data = await response.json();

            if (data.username) {
                navbarUser.innerHTML = `
                    <span>👋 Hola, <strong>${data.username}</strong></span>
                    <button id="logoutBtn" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Cerrar sesión</button>
                `;

                document.getElementById('logoutBtn').addEventListener('click', () => {
                    localStorage.removeItem('token');
                    window.location.reload();
                });
                return;
            }
        } catch (error) {
            console.warn('Token inválido o expirado');
        }
    }

    // Si no hay token o es inválido:
    navbarUser.innerHTML = `
        <a href="/auth/login.html" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Login</a>
        <a href="/auth/register.html" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded ml-2">Registrarse</a>
    `;
});
