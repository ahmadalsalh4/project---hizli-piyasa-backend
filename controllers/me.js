const pool = require('../config/db');

const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      'SELECT id, name, surname, phone_number, email FROM users WHERE id = $1', 
      [userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      'update name, surname, phone_number, email FROM users WHERE id = $1', 
      [userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserProfile ,patchUserProfile};