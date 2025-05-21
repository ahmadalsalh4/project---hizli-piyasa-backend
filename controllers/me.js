const pool = require('../services/db');

const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      'SELECT id, name, surname, phone_number, email FROM users WHERE id = $1', 
      [userId]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchUserProfile = async (req, res) => {
  try {
    res.status(200).json('not implemented yet Profile patched');
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

module.exports = { getUserProfile ,patchUserProfile};