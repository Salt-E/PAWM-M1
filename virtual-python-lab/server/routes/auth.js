const express = require('express');
const supabase = require('../supabaseClient');
const router = express.Router();

// Route registrasi
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
      return res.status(400).json({ success: false, message: error.message });
  }

  // Ambil ID pengguna yang baru terdaftar
    const userId = data.user.id;

    // Masukkan data ke dalam tabel user_progress
    const { error: progressError } = await supabase
        .from('user_progress')
        .insert([
            {
                user_id: userId, // Gunakan user_id yang baru terdaftar
                page: 'start',    // Anda bisa menambahkan nilai untuk 'page' atau atribut lain sesuai kebutuhan
                progress: 0,      // Nilai default untuk progress
                is_completed: false, // Status default
            }
        ]);

    // Jika gagal menyimpan progress
    if (progressError) {
        return res.status(400).json({ error: progressError.message });
    }

    // Kirim response sukses jika semua berjalan lancar
    res.status(200).json({ message: 'User registered and progress saved successfully', success: true, user: data.user });
});

// Route login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
      return res.status(400).json({ success: false, message: error.message });
  }
  // console.log("Data: ",data);
  res.status(200).json({ success: true, user: data.user,  access_token: data.session.access_token});

});

// Route logout
router.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
      return res.status(400).json({ success: false, message: error.message });
  }
  
  res.status(200).json({ success: true, message: "Logged out successfully" });
});


router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
      // Verifikasi token dan ambil data pengguna dari Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
          return res.status(401).json({ success: false, message: "Invalid token" });
      }

      // Mengirim respons dengan email pengguna
      res.status(200).json({ success: true, user: { email: user.email, id: user.id } });
  } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;


