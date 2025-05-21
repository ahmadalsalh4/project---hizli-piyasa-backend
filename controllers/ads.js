const pool = require('../services/db');

const getAllAds = async (req, res) => {
  try {
    res.status(200).json('all ads');
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

const getAdsDetailed = async (req, res) => {
  try {
    const adId = req.params.id;
    res.status(200).json(`ads detailed ${adId}`);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

const getUserDetailed = async (req, res) => {
  try {
    const userId = req.params.id;
    res.status(200).json(`all user ${userId} ads`);
  } catch (err) {
    res.status(500).json({ 
      error: err.message });
  }
};

module.exports = { getAllAds, getAdsDetailed, getUserDetailed };