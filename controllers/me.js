const bcrypt = require("bcrypt");
const uploadToImgBB = require("../services/imageUploader");
const pool = require("../services/db");
const validators = require("../services/valid");

const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query(
      "SELECT id, name, surname, phone_number, email, profile_image_path FROM users WHERE id = $1",
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
    const { email } = req.body;
    if (email)
      return res.status(400).json({ error: "you cant update your email" });

    const { name, surname, phone_number, password, profile_image_path } =
      req.body;
    if (!name && !surname && !phone_number && !password && !profile_image_path)
      return res
        .status(400)
        .json({ error: "please provide at least one attribute" });

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
      if (!validators.ValidatePhoneNumber(phone_number))
        return res
          .status(400)
          .json({ error: "please provide a valid phone_number" });
      query += ` phone_number = $${paramCount},`;
      queryParams.push(phone_number);
      paramCount++;
    }

    if (password) {
      if (!validators.ValidatePassword(password))
        return res
          .status(400)
          .json({ error: "please provide a valid password" });
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
    const response = await pool.query(query, queryParams);

    res.status(200).json(response.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const deleteUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    await pool.query("delete from ads where user_id = $1", [userId]);
    await pool.query("delete from users where id = $1", [userId]);

    res.status(200).json(`User with ID ${userId} deleted successfully`);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
        ads.date,
        ads.image_path,
        cities.city_name as city_name,
        states.state_name as state_name
      FROM ads
      INNER JOIN states ON ads.state_id = states.id
      INNER JOIN cities ON ads.city_id = cities.id
      WHERE user_id = $1
      ORDER BY ads.date DESC`,
      [userId]
    );
    res.status(200).json({ rowCount: response.rowCount, rows: response.rows });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getUserAdDetailed = async (req, res) => {
  const userId = req.userId;
  const Adid = req.params.id;
  if (!Adid) return res.status(400).json({ error: "please provide a Ad id" });
  try {
    if (!validators.ValidateNumber(Adid))
      return res.status(400).json({ error: "please provide a valid Ad id" });

    const response = await pool.query("SELECT user_id FROM ads WHERE id = $1", [
      Adid,
    ]);

    if (response.rowCount === 0)
      return res.status(404).json({ error: `ad with id ${Adid} not fund` });

    if (response.rows[0].user_id !== userId)
      return res.status(401).json({ error: "you dont have this ads" });

    const q = await pool.query(
      `SELECT
    ads.id,
    ads.title,
    ads.description,
    ads.price,
    ads.date,
    ads.image_path,
    cities.city_name as city_name,
    states.state_name as state_name,
    categories.category_name as category_name,
    users.id as user_id
  FROM ads
  INNER JOIN cities ON ads.city_id = cities.id
  INNER JOIN states ON ads.state_id = states.id
  INNER JOIN categories ON ads.category_id = categories.id
  INNER JOIN users ON ads.user_id = users.id
  WHERE ads.id = $1`,
      [Adid]
    );
    res.status(200).json(q.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const postAd = async (req, res) => {
  const userId = req.userId;
  const { title, description, price, image_path, category_id, city_id } =
    req.body;
  if (!title) return res.status(400).json({ error: "please provide a title" });
  if (!description)
    return res.status(400).json({ error: "please provide a description" });
  if (!price) return res.status(400).json({ error: "please provide a price" });
  if (!category_id)
    return res.status(400).json({ error: "please provide a category id" });
  if (!city_id)
    return res.status(400).json({ error: "please provide a city id" });
  try {
    if (!validators.ValidateNumber(price))
      return res.status(400).json({ error: "please provide a valid price" });

    if (!validators.ValidateNumber(category_id))
      return res
        .status(400)
        .json({ error: "please provide a valid category id" });

    if (Number(category_id) < 1 || Number(category_id) > 8)
      return res
        .status(400)
        .json({ error: "please provide a valid category id betwen 1 and 8" });

    if (!validators.ValidateNumber(city_id))
      return res.status(400).json({ error: "please provide a valid city id" });

    if (Number(city_id) < 1 || Number(city_id) > 81)
      return res
        .status(400)
        .json({ error: "please provide a valid city id betwen 1 and 81" });

    const image_Url = await uploadToImgBB(image_path);
    const result = await pool.query(
      "INSERT INTO ads (user_id, title, description, price, image_path, category_id , city_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, price",
      [userId, title, description, price, image_Url, category_id, city_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const patchAd = async (req, res) => {
  const userId = req.userId;
  const Adid = req.params.id;
  if (!Adid) return res.status(400).json({ error: "please provide a Ad id" });
  const {
    title,
    description,
    price,
    image_path,
    category_id,
    city_id,
    state_id,
  } = req.body;

  if (
    !title &&
    !description &&
    !price &&
    !image_path &&
    !category_id &&
    !city_id &&
    !state_id
  )
    return res
      .status(400)
      .json({ error: "please provide at least one attribute" });

  try {
    if (!validators.ValidateNumber(Adid))
      return res.status(400).json({ error: "please provide a valid Ad id" });

    const first_response = await pool.query(
      "SELECT user_id FROM ads WHERE id = $1",
      [Adid]
    );
    if (first_response.rowCount === 0)
      return res.status(404).json({ error: `ad with id ${Adid} not fund` });

    if (first_response.rows[0].user_id !== userId)
      return res.status(401).json({ error: "you dont have this ads" });

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
      if (!validators.ValidateNumber(price))
        return res.status(400).json({ error: "please provide a valid price" });
      query += ` price = $${paramCount},`;
      queryParams.push(price);
      paramCount++;
    }

    if (category_id) {
      if (!validators.ValidateNumber(category_id))
        return res
          .status(400)
          .json({ error: "please provide a valid category id" });

      if (Number(category_id) < 1 || Number(category_id) > 8)
        return res
          .status(400)
          .json({ error: "please provide a valid category id betwen 1 and 8" });
      query += ` category_id = $${paramCount},`;
      queryParams.push(category_id);
      paramCount++;
    }

    if (city_id) {
      if (!validators.ValidateNumber(city_id))
        return res
          .status(400)
          .json({ error: "please provide a valid city id" });

      if (Number(city_id) < 1 || Number(city_id) > 81)
        return res
          .status(400)
          .json({ error: "please provide a valid city id betwen 1 and 81" });
      query += ` city_id = $${paramCount},`;
      queryParams.push(city_id);
      paramCount++;
    }

    if (state_id) {
      if (!validators.ValidateNumber(state_id))
        return res
          .status(400)
          .json({ error: "please provide a valid state id" });

      if (Number(state_id) < 1 || Number(state_id) > 3)
        return res
          .status(400)
          .json({ error: "please provide a valid state id betwen 1 and 3" });
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
    const response = await pool.query(query, queryParams);

    res.status(200).json(response.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const deleteAd = async (req, res) => {
  const userId = req.userId;
  const Adid = req.params.id;
  if (!Adid) return res.status(400).json({ error: "please provide a Ad id" });
  try {
    if (!validators.ValidateNumber(Adid))
      return res.status(400).json({ error: "please provide a valid Ad id" });
    const response = await pool.query("SELECT user_id FROM ads WHERE id = $1", [
      Adid,
    ]);

    if (response.rowCount === 0)
      return res.status(404).json({ error: `ad with id ${Adid} not found` });

    if (response.rows[0].user_id !== userId)
      return res.status(401).json({ error: "you dont have this ads" });

    await pool.query("delete FROM ads WHERE id = $1", [Adid]);
    res.status(200).json(`Ad with ID ${Adid} deleted successfully`);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getUserProfile,
  patchUserProfile,
  deleteUserProfile,
  getUserAds,
  postAd,
  getUserAdDetailed,
  patchAd,
  deleteAd,
};
