const Listing = require("../models/listing.js");
const express = require('express');
const router = express.Router();


module.exports.index = async (req, res) => {
    const { search, minPrice, maxPrice, guests } = req.query;
    
    let query = {};
    
    if (search) {
        query.$or = [
            { location: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } }
        ];
    }
    
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (guests) {
        query.$or = query.$or || [];
        query.$or.push(
            { maxGuests: { $gte: Number(guests) } },
            { maxGuests: { $exists: false } },
            { maxGuests: null }
        );
    }
    
    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings, search, minPrice, maxPrice, guests });
};
//  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1625505826533-5c80ca7d1577?ixlib=rb-4.0.3';
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ path: "reviews",
         populate: { 
            path: "author"
        } 
    })
    .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image= { url, filename };
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings`);
};

module.exports.Editform =async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    let originalImageUrl = listing.image.url;
    originalImageUrl =originalImageUrl.replace("/uploads","/upload/w_250");
    res.render("listings/edit", { listing, originalImageUrl});
};

module.exports.renderUpdateForm= async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing has beend upadated by the user..");

    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing= async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing has been deleted by the user");
    res.redirect("/listings");
};