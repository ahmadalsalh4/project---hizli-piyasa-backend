const express = require("express");
const router = express.Router();
const container = require("../services/container");
const meController = require("../controllers/me")(container);
const auth = container.get("auth");

router.get("/", auth, meController.getUserProfile);
router.patch("/", auth, meController.patchUserProfile);
router.delete("/", auth, meController.deleteUserProfile);

router.get("/ads", auth, meController.getUserAds);
router.post("/ads", auth, meController.postAd);
router.get("/ads/:id", auth, meController.getUserAdDetailed);
router.patch("/ads/:id", auth, meController.patchAd);
router.delete("/ads/:id", auth, meController.deleteAd);

module.exports = router;
