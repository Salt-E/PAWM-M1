const express = require('express');
const supabase = require('../supabaseClient');
const router = express.Router();

// Route untuk menyimpan progres pengguna
router.post('/save', async (req, res) => {
  const { userId, page, progress, isCompleted } = req.body;

  const { data, error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, page, progress, is_completed: isCompleted });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Progress saved successfully" });
});

// Route untuk mengambil progres pengguna
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  const { data, error } = await supabase
    .from('user_progress')
    .select('progress, page')
    .eq('user_id', userId)

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
});

module.exports = router;