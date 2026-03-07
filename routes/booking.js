const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/bookings");

router.get("/listings/:id/availability", wrapAsync(bookingController.checkAvailability));
router.post("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.createBooking));
router.get("/bookings", isLoggedIn, wrapAsync(bookingController.myBookings));
router.get("/bookings/:id", isLoggedIn, wrapAsync(bookingController.showBooking));
router.delete("/bookings/:id", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;
