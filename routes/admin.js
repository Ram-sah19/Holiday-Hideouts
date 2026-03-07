const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");
const adminController = require("../controllers/admin");

router.get("/admin", isLoggedIn, isAdmin, wrapAsync(adminController.dashboard));
router.get("/admin/listings", isLoggedIn, isAdmin, wrapAsync(adminController.allListings));
router.delete("/admin/listings/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteListing));
router.get("/admin/users", isLoggedIn, isAdmin, wrapAsync(adminController.allUsers));
router.post("/admin/users/:id/ban", isLoggedIn, isAdmin, wrapAsync(adminController.banUser));

module.exports = router;
