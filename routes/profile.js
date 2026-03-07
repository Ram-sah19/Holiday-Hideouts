const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const profileController = require("../controllers/profile");
const multer = require("multer");
const { storage } = require("../cloud_config");
const upload = multer({ storage });

router.get("/profile", isLoggedIn, wrapAsync(profileController.showProfile));
router.get("/profile/edit", isLoggedIn, wrapAsync(profileController.editProfile));
router.put("/profile", isLoggedIn, upload.single("profilePicture"), wrapAsync(profileController.updateProfile));

module.exports = router;
