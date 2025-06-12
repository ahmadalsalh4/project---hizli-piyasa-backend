const express = require("express");
const router = express.Router();
const { Postlogin, Postregister } = require("../controllers/authenticat");

router.post("/login", Postlogin);
router.post("/register", Postregister);

module.exports = router;
