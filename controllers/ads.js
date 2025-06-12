const pool = require("../services/db");

const getAllAds = async (req, res) => {
  try {
    // Extract query parameters
    const {
      category,
      city,
      minPrice,
      maxPrice,
      startDate,
      search,
      sortBy = "date", // Default sorting by date
      sortOrder = "DESC", // Default order DESC (newest first)
    } = req.query;

    // Base query
    let query = `
      SELECT 
        ads.id,
        ads.title,
        ads.description,
        ads.price,
        to_char(ads.date, 'YYYY-MM-DD') as date,
        ads.image_path,
        cities.city_name as city_name,
        categories.category_name as category_name
      FROM ads
      INNER JOIN cities ON ads.city_id = cities.id
      LEFT JOIN categories ON ads.category_id = categories.id
      WHERE ads.state_id = 1
    `;

    // Array to hold query parameters
    const queryParams = [];
    let paramCount = 1;

    // Add filters conditionally
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
      query += ` AND ads.price >= $${paramCount}`;
      queryParams.push(parseFloat(minPrice));
      paramCount++;
    }

    if (maxPrice) {
      query += ` AND ads.price <= $${paramCount}`;
      queryParams.push(parseFloat(maxPrice));
      paramCount++;
    }

    if (startDate) {
      query += ` AND ads.date >= $${paramCount}`;
      queryParams.push(startDate);
      paramCount++;
    }

    if (search) {
      query += ` AND (ads.title ILIKE $${paramCount} OR ads.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Validate and apply sorting (prevent SQL injection)
    const validSortColumns = ["date", "price", "title"]; // Allowed columns for sorting
    const validSortOrders = ["ASC", "DESC"];

    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "date";
    const sortDirection = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    query += ` ORDER BY ads.${sortColumn} ${sortDirection}`;

    // Execute query
    const response = await pool.query(query, queryParams);

    if (response.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No ads found matching your criteria" });
    }

    res.status(200).json({ rowCount: response.rowCount, rows: response.rows });
  } catch (err) {
    console.error("Error fetching ads:", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getAdsDetailed = async (req, res) => {
  const Ad_id = req.params.id;
  try {
    const response = await pool.query(
      `SELECT
    ads.id,
    ads.title,
    ads.description,
    ads.price,
    to_char(ads.date, 'YYYY-MM-DD') as date,
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
      return res.status(404).json(`ads with id = ${Ad_id} not found`);
    res.status(200).json(response.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getAdsByUser = async (req, res) => {
  const usr_id = req.params.id;
  try {
    const response = await pool.query(
      `SELECT 
        ads.id,
        ads.title,
        ads.price,
        to_char(ads.date, 'YYYY-MM-DD') as date,
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
        .json(`user with id = ${usr_id} douse not have any ad`);
    res.status(200).json({ rowCount: response.rowCount, rows: response.rows });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = { getAllAds, getAdsDetailed, getAdsByUser };
