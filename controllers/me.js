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
  try {
    res.status(200).json('not implemented yet Profile deleted');
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
  try {
    res.status(200).json('not implemented yet post Ad');
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