const pool = require("../services/db");
const validators = require("../services/valid");

const getAllAds = async (req, res) => {
  const {
    category,
    city,
    minPrice,
    maxPrice,
    startDate,
    search,
    sortBy,
    sortOrder,
  } = req.query;
  try {
    let query = `
      SELECT 
        ads.id,
        ads.title,
        ads.description,
        ads.price,
        ads.date,
        ads.image_path,
        cities.city_name as city_name,
        categories.category_name as category_name
      FROM ads
      INNER JOIN cities ON ads.city_id = cities.id
      LEFT JOIN categories ON ads.category_id = categories.id
      WHERE ads.state_id = 1
    `;

    const queryParams = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category_name = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }

    if (city) {
      query += ` AND cities.city_name = $${paramCount}`;
      queryParams.push(city);
      paramCount++;
    }

    if (minPrice) {
      if (!validators.ValidateNumber(minPrice))
        return res
          .status(400)
          .json({ error: "please provide a valid minPrice" });
      query += ` AND ads.price >= $${paramCount}`;
      queryParams.push(parseFloat(minPrice));
      paramCount++;
    }

    if (maxPrice) {
      if (!validators.ValidateNumber(maxPrice))
        return res
          .status(400)
          .json({ error: "please provide a valid maxPrice" });
      query += ` AND ads.price <= $${paramCount}`;
      queryParams.push(parseFloat(maxPrice));
      paramCount++;
    }

    if (startDate) {
      if (!validators.ValidISODateTime(startDate))
        return res
          .status(400)
          .json({ error: "please provide a valid startDate" });
      query += ` AND ads.date >= $${paramCount}`;
      queryParams.push(startDate);
      paramCount++;
    }

    if (search) {
      query += ` AND (ads.title ILIKE $${paramCount} OR ads.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    const validSortColumns = ["date", "price", "title"];
    let sortColumn;
    if (!sortBy) sortColumn = "date";
    else {
      if (validSortColumns.includes(sortBy)) sortColumn = sortBy;
      else sortColumn = "date";
    }

    const validSortOrders = ["ASC", "DESC"];
    let sortDirection;
    if (!sortOrder) sortDirection = "DESC";
    else {
      if (validSortOrders.includes(sortOrder.toUpperCase()))
        sortDirection = sortOrder.toUpperCase();
      else sortDirection = "DESC";
    }

    query += ` ORDER BY ads.${sortColumn} ${sortDirection}`;
    const response = await pool.query(query, queryParams);

    if (response.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No ads found matching your criteria" });
    }

    res.status(200).json({ rowCount: response.rowCount, rows: response.rows });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getAdsDetailed = async (req, res) => {
  const Ad_id = req.params.id;
  if (!Ad_id) return res.status(400).json({ error: "please provide a Ad id" });
  try {
    if (!validators.ValidateNumber(Ad_id))
      return res.status(400).json({ error: "please provide a valid Ad id" });
    const response = await pool.query(
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
  WHERE ads.state_id = 1 and ads.id = $1`,
      [Ad_id]
    );
    if (response.rowCount === 0)
      return res
        .status(404)
        .json({ error: `ads with id = ${Ad_id} not found` });
    res.status(200).json(response.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getAdsByUser = async (req, res) => {
  const usr_id = req.params.id;
  if (!usr_id)
    return res.status(400).json({ error: "please provide a user id" });
  try {
    if (!validators.ValidateNumber(usr_id))
      return res.status(400).json({ error: "please provide a valid user id" });
    const response = await pool.query(
      `SELECT
        ads.id,
        ads.title,
        ads.price,
        ads.date,
        ads.image_path,
        cities.city_name as city_name
        FROM ads
      INNER JOIN cities ON ads.city_id = cities.id
      WHERE ads.state_id = 1 and user_id = $1
      ORDER BY ads.date DESC`,
      [usr_id]
    );

    if (response.rowCount === 0)
      return res
        .status(404)
        .json({ error: `user with id = ${usr_id} douse not have any ad` });
    const userdata = await pool.query(
      "SELECT name, surname, phone_number, profile_image_path FROM users WHERE id = $1",
      [usr_id]
    );
    res.status(200).json({
      userdata: userdata.rows[0],
      rowCount: response.rowCount,
      rows: response.rows,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = { getAllAds, getAdsDetailed, getAdsByUser };
