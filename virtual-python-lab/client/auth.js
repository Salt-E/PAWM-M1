document.addEventListener('DOMContentLoaded', () => {

    // Event listener untuk form login
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();  

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginMessage = document.getElementById('loginMessage');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (result.success) {
                loginMessage.textContent = "Login berhasil! Mengalihkan...";
                loginMessage.style.color = "green";
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 2000);
            } else {
                loginMessage.textContent = `Login gagal: ${result.message}`;
                loginMessage.style.color = "red";
            }
        } catch (error) {
            console.error("Login error:", error);
            loginMessage.textContent = "Terjadi kesalahan saat login. Coba lagi.";
            loginMessage.style.color = "red";
        }
    });

    // Event listener untuk form register
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();  
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const registerMessage = document.getElementById('registerMessage');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (result.success) {
                // Jika berhasil
                registerMessage.textContent = "Registrasi berhasil! Silakan login.";
                registerMessage.style.color = "green";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                // Jika gagal
                registerMessage.textContent = `Registrasi gagal: ${result.message}`;
                registerMessage.style.color = "red";
            }
        } catch (error) {
            console.error("Register error:", error);
            registerMessage.textContent = "Terjadi kesalahan saat registrasi. Coba lagi.";
            registerMessage.style.color = "red";
        }
    });
});