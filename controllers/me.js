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

const deleteUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1', 
      [userId]
    );

    res.status(200).json(`users deleted`);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};







const getUserAds = async (req, res) => {
  try {
    res.status(200).json('not implemented yet get User Ads');
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

const postAd = async (req, res) => {
  const userId = req.userId;
  const {title, description, price, image_path, category_id , city_id  } = req.body;
  try {
    console.log(userId)
    const result = await pool.query(
      'INSERT INTO ads (user_id, title, description, price, image_path, category_id , city_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, price',
      [userId,title, description, Number(price), image_path, Number(category_id) , Number(city_id)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

const patchAd = async (req, res) => {
  try {
    res.status(200).json('not implemented yet patch Ad');
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

const deleteAd = async (req, res) => {
  try {
    res.status(200).json('not implemented yet delete Ad');
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};



module.exports = { getUserProfile ,patchUserProfile, deleteUserProfile, getUserAds, postAd, patchAd, deleteAd };