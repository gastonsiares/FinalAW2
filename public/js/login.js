document.getElementById('formLogin').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
    username: document.getElementById('username').value, // ✅ corregido, todo minúscula
    pass: document.getElementById('pass').value
};


    fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(result => {
            console.log('🔍 Respuesta del backend:', result); // 👉 agregar esto

            if (result.status) {
                localStorage.setItem('token', result.token);
                alert('Login exitoso');
                window.location.href = '/pages/home.html';
            } else {
                alert(result.msg || 'Usuario o contraseña incorrectos');
            }
        });

});
