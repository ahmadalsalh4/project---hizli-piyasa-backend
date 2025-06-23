const express = require("express");
const router = express.Router();
const container = require("../services/container");
const adsController = require("../controllers/ads")(container);

router.get("/", adsController.getAllAds);
router.get("/:id", adsController.getAdsDetailed);
router.get("/user/:id", adsController.getAdsByUser);

module.exports = router;
