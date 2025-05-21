const pool = require('../services/db');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { name, surname, phone_number, email, password,profile_image_path } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, surname, phone_number, email, password, profile_image_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, surname, phone_number, email',
      [name, surname, phone_number, email, hashedPassword, profile_image_path]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

module.exports = { register };
