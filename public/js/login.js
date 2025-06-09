// public/js/login.js
document.getElementById('formLogin').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
        userName: document.getElementById('username').value,
        pass: document.getElementById('pass').value
    };

    fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        if (result.status) {
            localStorage.setItem('token', result.token); // ✅ Guardar token
            alert('Login exitoso');
            window.location.href = '/pages/home.html'; // Redirigir al home
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });
});
