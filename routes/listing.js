const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, isCompany} = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloud_config.js");
const upload = multer({ storage });



router.route("/")
    .get( wrapAsync(listingsController.index ))
    .post(isLoggedIn,
    isCompany,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingsController.createListing)
);


// New listing form
router.get("/new", isLoggedIn, isCompany, listingsController.renderNewForm );


router.route("/:id")
    .get(wrapAsync(listingsController.showListings))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingsController.renderUpdateForm)
    )
    .delete(isLoggedIn,
    isOwner, wrapAsync(listingsController.destroyListing)
);



//edit route
router.get("/:id/edit",isLoggedIn, 
    isOwner,
    wrapAsync(listingsController.Editform));
module.exports = router;