document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegister');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            lastname: document.getElementById('lastname').value,
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            pass: document.getElementById('pass').value,
        };

        try {
            const res = await fetch('/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (result.status) {
                alert('Usuario registrado correctamente');
                window.location.href = '/auth/login.html';
            } else {
                alert(result.msg || 'Error al registrar');
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert('Error en la conexión');
        }
    });
});
