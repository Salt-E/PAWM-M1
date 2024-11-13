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

  res.status(200).json({ success: true, user: data.user });
});

// Route login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
      return res.status(400).json({ success: false, message: error.message });
  }
  
  res.status(200).json({ success: true, user: data.user });
});

// Route logout
router.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
      return res.status(400).json({ success: false, message: error.message });
  }
  
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = router;

