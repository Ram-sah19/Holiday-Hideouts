const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// IMPORTANT: import correctly
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["client", "company", "admin"],
        default: "client"
    },
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],
    phone: String,
    bio: String,
    profilePicture: {
        url: String,
        filename: String
    }
}, { timestamps: true });

// Apply plugin
userSchema.plugin(passportLocalMongoose, { usernameQueryFields: ["email"] });

module.exports = mongoose.model("User", userSchema);
// module.exports = User;