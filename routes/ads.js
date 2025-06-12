const express = require("express");
const router = express.Router();
const {
  getAllAds,
  getAdsDetailed,
  getAdsByUser,
} = require("../controllers/ads");

router.get("/", getAllAds);
router.get("/:id", getAdsDetailed);
router.get("/user/:id", getAdsByUser);

module.exports = router;
