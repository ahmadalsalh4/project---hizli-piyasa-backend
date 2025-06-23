const express = require("express");
const router = express.Router();
const container = require("../services/container");
const authController = require("../controllers/authenticat")(container);

router.post("/login", authController.Postlogin);
router.post("/register", authController.Postregister);

module.exports = router;
