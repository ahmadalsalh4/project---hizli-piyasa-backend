const pool = require('../services/db');

const getAllAds = async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT 
        ads.title,
        ads.price,
        to_char(ads.date, 'YYYY-MM-DD') as date,
        ads.image_path,
        cities.city_name as city_name
      FROM ads
      INNER JOIN cities ON ads.city_id = cities.id
      WHERE ads.state_id = 1
      ORDER BY ads.date DESC`
    );
    res.status(200).json(response.rows);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

const getAdsDetailed = async (req, res) => {
  const Ad_id = req.params.id
  try {
    const response = await pool.query(
      `SELECT 
        ads.title,
        ads.price,
        to_char(ads.date, 'YYYY-MM-DD') as date,
        ads.image_path,
        cities.city_name as city_name
      FROM ads
      INNER JOIN cities ON ads.city_id = cities.id
      WHERE ads.state_id = 1 and ads.id = $1
      ORDER BY ads.date DESC`,[Ad_id]
    );
    res.status(200).json(response.rows);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

const getAdsByUser = async (req, res) => {
  const usr_id = req.params.id
  try {
    const response = await pool.query(
      `SELECT 
        ads.title,
        ads.price,
        to_char(ads.date, 'YYYY-MM-DD') as date,
        ads.image_path,
        cities.city_name as city_name
      FROM ads
      INNER JOIN cities ON ads.city_id = cities.id
      WHERE ads.state_id = 1 and user_id = $1
      ORDER BY ads.date DESC`,[usr_id]
    );
    res.status(200).json(response.rows);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

module.exports = { getAllAds, getAdsDetailed, getAdsByUser };