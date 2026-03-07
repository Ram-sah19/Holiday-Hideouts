const Booking = require("../models/booking");
const Listing = require("../models/listing");
const Notification = require("../models/notification");
const emailService = require("../utils/emailService");

module.exports.checkAvailability = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;
    
    const listing = await Listing.findById(id);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const isAvailable = !listing.bookedDates.some(booking => 
        (checkInDate >= booking.checkIn && checkInDate < booking.checkOut) ||
        (checkOutDate > booking.checkIn && checkOutDate <= booking.checkOut) ||
        (checkInDate <= booking.checkIn && checkOutDate >= booking.checkOut)
    );
    
    res.json({ available: isAvailable });
};

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body;
    
    const listing = await Listing.findById(id);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Check availability
    const isAvailable = !listing.bookedDates.some(booking => 
        (checkInDate >= booking.checkIn && checkInDate < booking.checkOut) ||
        (checkOutDate > booking.checkIn && checkOutDate <= booking.checkOut) ||
        (checkInDate <= booking.checkIn && checkOutDate >= booking.checkOut)
    );
    
    if (!isAvailable) {
        req.flash("error", "Property not available for selected dates");
        return res.redirect(`/listings/${id}`);
    }
    
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const serviceFee = listing.price * nights * 0.1;
    const totalPrice = listing.price * nights + serviceFee;
    
    const booking = new Booking({
        listing: id,
        user: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalPrice,
        status: "confirmed"
    });
    
    await booking.save();
    
    listing.bookedDates.push({ checkIn: checkInDate, checkOut: checkOutDate });
    await listing.save();
    
    await Notification.create({
        user: listing.owner,
        type: "booking",
        message: `New booking for ${listing.title}`,
        link: `/bookings/${booking._id}`
    });
    
    // Send email notification
    try {
        await emailService.sendBookingConfirmation(booking, req.user, listing);
    } catch (error) {
        console.log("Email notification failed:", error);
    }
    
    req.flash("success", "Booking confirmed! Check your email for details.");
    res.redirect(`/bookings/${booking._id}`);
};

module.exports.showBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id)
        .populate("listing")
        .populate("user");
    res.render("users/bookingShow.ejs", { booking });
};

module.exports.myBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 });
    res.render("users/bookings.ejs", { bookings });
};

module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("listing");
    
    booking.status = "cancelled";
    await booking.save();
    
    const listing = await Listing.findById(booking.listing._id);
    listing.bookedDates = listing.bookedDates.filter(date => 
        !(date.checkIn.getTime() === booking.checkIn.getTime() && 
          date.checkOut.getTime() === booking.checkOut.getTime())
    );
    await listing.save();
    
    await Notification.create({
        user: booking.user,
        type: "cancellation",
        message: `Booking cancelled for ${booking.listing.title}`,
        link: `/bookings/${booking._id}`
    });
    
    req.flash("success", "Booking cancelled");
    res.redirect("/bookings");
};
