const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const favoritesController = require("../controllers/favorites");

router.post("/listings/:id/favorite", isLoggedIn, wrapAsync(favoritesController.addToFavorites));
router.delete("/listings/:id/favorite", isLoggedIn, wrapAsync(favoritesController.removeFromFavorites));
router.get("/favorites", isLoggedIn, wrapAsync(favoritesController.showFavorites));

module.exports = router;
