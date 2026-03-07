const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  propertyType: {
    type: String,
    enum: ["apartment", "house", "villa", "cabin", "hotel", "resort", "other"],
    default: "other"
  },
  maxGuests: {
    type: Number,
    default: 2
  },
  amenities: [String],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bookedDates: [
    {
      checkIn: Date,
      checkOut: Date
    }
  ]
}, { timestamps: true });


listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await review.deleteMany({_id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
