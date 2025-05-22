const pool = require('../services/db');
const bcrypt = require('bcrypt');
const uploadToImgBB = require('../services/imageUploader');

const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      'SELECT id, name, surname, phone_number, email, profile_image_path FROM users WHERE id = $1', 
      [userId]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchUserProfile = async (req, res) => {
  try {
  const userId = req.userId;
  const { name, surname, phone_number, password, profile_image_path } = req.body;

  let query = `
      UPDATE users
        SET 
    `;

    const queryParams = [];
    let paramCount = 1;

    if (name) {
      query += ` name = $${paramCount},`;
      queryParams.push(name);
      paramCount++;
    }

    if (surname) {
      query += ` surname = $${paramCount},`;
      queryParams.push(surname);
      paramCount++;
    }

    if (phone_number) {
      query += ` phone_number = $${paramCount},`;
      queryParams.push(phone_number);
      paramCount++;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ` password = $${paramCount},`;
      queryParams.push(hashedPassword);
      paramCount++;
    }

    if (profile_image_path) {
      const image_Url = await uploadToImgBB(profile_image_path);
      query += ` profile_image_path = $${paramCount},`;
      queryParams.push(image_Url);
      paramCount++;
    }
    query = query.slice(0, -1);

    query += `  WHERE id = $${paramCount}`;
    queryParams.push(userId);
    paramCount++;

    query += ` RETURNING id, name, surname, phone_number, email, profile_image_path`;
    console.log(paramCount);
    console.log(query);
    const response = await pool.query(query, queryParams);

    res.status(200).json(response.rows[0]);
    }catch (err) {
    res.status(500).json({ 
      error: err.message 
    });
  }
};

const deleteUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    await pool.query(
      'DELETE FROM users WHERE id = $1', 
      [userId]
    );

    res.status(200).json(`User deleted successfully`);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};







const getUserAds = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await pool.query(
      `SELECT
        ads.id,
        ads.title,
        ads.price,
        to_char(ads.date, 'YYYY-MM-DD') as date,
        ads.image_path,
        cities.city_name as city_name,
        states.state_name as state_name
      FROM ads
      INNER JOIN states ON ads.state_id = states.id
      INNER JOIN cities ON ads.city_id = cities.id
      WHERE user_id = $1
      ORDER BY ads.date DESC`,[userId]
    );
    res.status(200).json({rowCount : response.rowCount, rows : response.rows});
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

const postAd = async (req, res) => {
  const userId = req.userId;
  const {title, description, price, image_path, category_id , city_id  } = req.body;
  try {
    const image_Url = await uploadToImgBB(image_path);
    const result = await pool.query(
      'INSERT INTO ads (user_id, title, description, price, image_path, category_id , city_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, price',
      [userId,title, description, Number(price), image_Url, Number(category_id) , Number(city_id)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

const patchAd = async (req, res) => {
  try {
  const userId = req.userId;
  const Adid = req.params.id;
  const { title, description, price, image_path, category_id, city_id, state_id } = req.body;

  const first_response = await pool.query(
      'SELECT user_id FROM ads WHERE id = $1', 
      [Adid]
    );
    if(first_response.rows[0].user_id !== userId)
        return res.status(401).json('you dont have this ads');

  let query = `
      UPDATE ads
        SET 
    `;

    const queryParams = [];
    let paramCount = 1;

    if (title) {
      query += ` title = $${paramCount},`;
      queryParams.push(title);
      paramCount++;
    }

    if (description) {
      query += ` description = $${paramCount},`;
      queryParams.push(description);
      paramCount++;
    }

    if (price) {
      query += ` price = $${paramCount},`;
      queryParams.push(price);
      paramCount++;
    }

    if (category_id >= 1 && category_id <= 7 ) {
      query += ` category_id = $${paramCount},`;
      queryParams.push(category_id);
      paramCount++;
    }

    if (city_id >= 1 && city_id <= 81 ) {
      query += ` city_id = $${paramCount},`;
      queryParams.push(city_id);
      paramCount++;
    }

    if (state_id >= 1 && state_id <= 3 ) {
      query += ` state_id = $${paramCount},`;
      queryParams.push(state_id);
      paramCount++;
    }

    if (image_path) {
      const image_Url = await uploadToImgBB(image_path);
      query += ` image_path = $${paramCount},`;
      queryParams.push(image_Url);
      paramCount++;
    }
    query = query.slice(0, -1);

    query += `  WHERE id = $${paramCount}`;
    queryParams.push(Adid);
    paramCount++;

    query += ` AND user_id = $${paramCount}`;
    queryParams.push(userId);
    paramCount++;

    query += ` RETURNING id, title, description, price,to_char(ads.date, 'YYYY-MM-DD') as date, image_path, category_id, city_id, state_id, user_id`;
    console.log(paramCount);
    console.log(query);
    const response = await pool.query(query, queryParams);

    res.status(200).json(response.rows[0]);
    }catch (err) {
    res.status(500).json({ 
      error: err.message 
    });
  }
};

const deleteAd = async (req, res) => {
  const userId = req.userId;
  const Adid = req.params.id;
  try {
    const response = await pool.query(
      'SELECT user_id FROM ads WHERE id = $1', 
      [Adid]
    );
    if(response.rows[0].user_id !== userId)
        return res.status(401).json('you dont have this ads');
    
    await pool.query('delete FROM ads WHERE id = $1', [Adid]);
    res.status(200).json(`Ad with ID ${Adid} deleted successfully`);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

module.exports = { getUserProfile ,patchUserProfile, deleteUserProfile, getUserAds, postAd, patchAd, deleteAd };