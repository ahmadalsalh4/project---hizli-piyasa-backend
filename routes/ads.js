const express = require('express');
const router = express.Router();
const { getAllAds, getAdsDetailed, getUserDetailed } = require('../controllers/ads');

router.get('/', getAllAds);
router.get('/:id', getAdsDetailed);
router.get('/user/:id', getUserDetailed);

module.exports = router;