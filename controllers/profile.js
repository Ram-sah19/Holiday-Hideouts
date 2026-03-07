const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/review");

module.exports.showProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    const myListings = await Listing.find({ owner: req.user._id });
    const myBookings = await Booking.find({ user: req.user._id }).populate("listing");
    const myReviews = await Review.find({ author: req.user._id });
    
    res.render("users/profile.ejs", { user, myListings, myBookings, myReviews });
};

module.exports.editProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render("users/editProfile.ejs", { user });
};

module.exports.updateProfile = async (req, res) => {
    const { phone, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { phone, bio });
    
    if (req.file) {
        user.profilePicture = {
            url: req.file.path,
            filename: req.file.filename
        };
        await user.save();
    }
    
    req.flash("success", "Profile updated!");
    res.redirect("/profile");
};
