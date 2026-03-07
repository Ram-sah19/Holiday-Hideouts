const Listing = require("../models/listing");
const Booking = require("../models/booking");

const recommendationController = {
    async getRecommendations(req, res) {
        try {
            const userId = req.user._id;
            
            // Get user's booking history
            const userBookings = await Booking.find({ user: userId }).populate("listing");
            
            // Get popular listings (most booked)
            const popularListings = await Booking.aggregate([
                { $group: { _id: "$listing", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);
            
            const popularIds = popularListings.map(p => p._id);
            const recommended = await Listing.find({ _id: { $in: popularIds } }).limit(6);
            
            // If user has bookings, recommend similar properties
            if (userBookings.length > 0) {
                const lastBooking = userBookings[userBookings.length - 1];
                const similarListings = await Listing.find({
                    propertyType: lastBooking.listing.propertyType,
                    _id: { $ne: lastBooking.listing._id }
                }).limit(6);
                
                res.render("listings/recommendations.ejs", { 
                    recommended: similarListings.length > 0 ? similarListings : recommended 
                });
            } else {
                res.render("listings/recommendations.ejs", { recommended });
            }
        } catch (error) {
            console.error(error);
            req.flash("error", "Unable to load recommendations");
            res.redirect("/listings");
        }
    }
};

module.exports = recommendationController;
