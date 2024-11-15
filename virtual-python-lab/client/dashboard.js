document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('access_token');
    const userEmailElement = document.getElementById('user-email');
    const userProgressElement = document.getElementById('user-progress');

    // Cek apakah token ada, jika tidak, arahkan ke halaman login
    if (!token) {
        alert("Anda harus login terlebih dahulu!");
        window.location.href = "login.html";
        return;
    }

    // Ambil data profil pengguna menggunakan token
    try {
        const response = await fetch('/api/auth/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (result.success) {
            const user = result.user;
            // Tampilkan email pengguna
            userEmailElement.textContent = `Welcome, ${user.email}`;
            localStorage.setItem('user_id', user.id);

            // Ambil progress dari API
            const userId = user.id; // ID pengguna dari JSON
            const progressResponse = await fetch(`/api/progress/${userId}`);
            
            if (!progressResponse.ok) {
                throw new Error(`HTTP Error: ${progressResponse.status} - ${progressResponse.statusText}`);
            }

            const progressResult = await progressResponse.json();

            if (Array.isArray(progressResult) && progressResult.length > 0) {
                // Tampilkan progress pengguna
                userProgressElement.textContent = "Progress pengguna:";
                progressResult.forEach((item) => {
                    const progressText = document.createElement("p");
                    progressText.textContent = `Page: ${item.page}, Progress: ${item.progress}%`;
                    userProgressElement.appendChild(progressText);
                });
            } else {
                userProgressElement.textContent = "No progress data available.";
            }
        } else {
            alert("Gagal memuat profil. Silakan login ulang.");
            localStorage.removeItem('access_token');
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error loading profile:", error);
        alert("Terjadi kesalahan saat mengambil data profil.");
    }
});

// Tombol logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    // Hapus token dari localStorage dan arahkan ke halaman login
    localStorage.removeItem('access_token');
    alert("Logout berhasil!");
    window.location.href = "index.html";
});
