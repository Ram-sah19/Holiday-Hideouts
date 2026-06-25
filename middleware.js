const Listing = require('./models/listing');
const Review = require('./models/review'); 
const ExpressError = require('./utils/ExpressError');
const {listingSchema, reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
       if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
   let {error} = listingSchema.validate(req.body);
//    console.log(result); 
   if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
   let {error} = reviewSchema.validate(req.body);
//    console.log(result); 
   if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    if (req.user.role !== "admin") {
        req.flash("error", "Access denied. Admin only.");
        return res.redirect("/listings");
    }
    next();
};

module.exports.isCompany = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    if (req.user.role !== "company" && req.user.role !== "admin") {
        req.flash("error", "Only companies can add listings");
        return res.redirect("/listings");
    }
    next();
};