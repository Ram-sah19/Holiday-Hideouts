const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const recommendationController = require("../controllers/recommendations");

router.get("/recommendations", isLoggedIn, wrapAsync(recommendationController.getRecommendations));

module.exports = router;
