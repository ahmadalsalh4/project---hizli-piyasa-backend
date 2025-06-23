const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uploadToImgBB = require("../services/imageUploader");
const pool = require("../services/db");
const validators = require("../services/valid");

const Postlogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ error: "please provide a email" });
  if (!password)
    return res.status(401).json({ error: "please provide a password" });

  try {
    if (!validators.ValidateEmail(email))
      return res.status(400).json({ error: "please provide a valid email" });
    if (!validators.ValidatePassword(password))
      return res.status(400).json({ error: "please provide a valid password" });
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0)
      return res
        .status(404)
        .json({ error: "user not found or password is invalid" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword)
      return res
        .status(404)
        .json({ error: "user not found or password is invalid" });

    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Postregister = async (req, res) => {
  const { name, surname, phone_number, email, password, profile_image_path } =
    req.body;
  if (!name) return res.status(400).json({ error: "please provide a name" });
  if (!surname)
    return res.status(400).json({ error: "please provide a surname" });
  if (!phone_number)
    return res.status(400).json({ error: "please provide a phone_number" });
  if (!email) return res.status(400).json({ error: "please provide a email" });
  if (!password)
    return res.status(400).json({ error: "please provide a password" });
  try {
    if (!validators.ValidatePhoneNumber(phone_number))
      return res
        .status(400)
        .json({ error: "please provide a valid phone_number" });
    if (!validators.ValidateEmail(email))
      return res.status(400).json({ error: "please provide a valid email" });
    if (!validators.ValidatePassword(password))
      return res.status(400).json({ error: "please provide a valid password" });

    const validq = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );
    if (validq.rowCount !== 0)
      return res
        .status(400)
        .json({ error: "please try another email or password" });

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
