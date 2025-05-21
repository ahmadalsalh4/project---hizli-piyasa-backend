const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const { getUserProfile ,patchUserProfile} = require('../controllers/me');

router.get('/', auth, getUserProfile);
router.patch('/', auth, patchUserProfile);
//router.delete('/', auth, deleteUserProfile);
//router.get('/ads', auth, getUserAds);

//router.post('/ads', auth, postAd);
//router.patch('/ads/:id', auth, patchAd);
//router.delete('/ads/:id', auth, deleteAd);

module.exports = router;