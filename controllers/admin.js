const Listing = require("../models/listing");
const User = require("../models/user");
const Booking = require("../models/booking");

module.exports.dashboard = async (req, res) => {
    const totalListings = await Listing.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const recentBookings = await Booking.find().populate("listing user").sort({ createdAt: -1 }).limit(10);
    
    res.render("users/adminDashboard.ejs", { totalListings, totalUsers, totalBookings, recentBookings });
};

module.exports.allListings = async (req, res) => {
    const listings = await Listing.find().populate("owner");
    res.render("users/adminListings.ejs", { listings });
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/admin/listings");
};

module.exports.allUsers = async (req, res) => {
    const users = await User.find();
    res.render("users/adminUsers.ejs", { users });
};

module.exports.banUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { role: "banned" });
    req.flash("success", "User banned");
    res.redirect("/admin/users");
};
