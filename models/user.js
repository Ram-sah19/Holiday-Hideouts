const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// esbuild (used by Netlify) wraps CJS modules as { default: fn }.
// We use .default if present (bundled), otherwise fall back to the raw export (local dev).
const _plm = require("passport-local-mongoose");
const passportLocalMongoose = _plm.default || _plm;


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