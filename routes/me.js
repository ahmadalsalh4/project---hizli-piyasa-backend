const express = require("express");
const router = express.Router();
const container = require("../services/container");
const authController = require("../controllers/me")(container);
const auth = container.get("auth");

router.get("/", auth, authController.getUserProfile);
router.patch("/", auth, authController.patchUserProfile);
router.delete("/", auth, authController.deleteUserProfile);

router.get("/ads", auth, authController.getUserAds);
router.post("/ads", auth, authController.postAd);
router.get("/ads/:id", auth, authController.getUserAdDetailed);
router.patch("/ads/:id", auth, authController.patchAd);
router.delete("/ads/:id", auth, authController.deleteAd);

module.exports = router;
