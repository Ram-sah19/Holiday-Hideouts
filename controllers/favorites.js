const User = require("../models/user");
const Listing = require("../models/listing");

module.exports.addToFavorites = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user.favorites.includes(id)) {
        user.favorites.push(id);
        await user.save();
        req.flash("success", "Added to favorites!");
    }
    
    res.redirect(`/listings/${id}`);
};

module.exports.removeFromFavorites = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    
    user.favorites = user.favorites.filter(fav => fav.toString() !== id);
    await user.save();
    
    req.flash("success", "Removed from favorites");
    res.redirect("/favorites");
};

module.exports.showFavorites = async (req, res) => {
    const user = await User.findById(req.user._id).populate("favorites");
    res.render("users/favorites.ejs", { favorites: user.favorites });
};
