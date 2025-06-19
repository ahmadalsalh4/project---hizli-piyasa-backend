const pool = require("../services/db");
const uploadToImgBB = require("../services/imageUploader");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Postlogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Postregister = async (req, res) => {
  const { name, surname, phone_number, email, password, profile_image_path } =
    req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const image_Url = await uploadToImgBB(profile_image_path);
    const result = await pool.query(
      "INSERT INTO users (name, surname, phone_number, email, password, profile_image_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, surname, phone_number, email, profile_image_path",
      [name, surname, phone_number, email, hashedPassword, image_Url]
    );
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({ token: token, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = { Postregister, Postlogin };
