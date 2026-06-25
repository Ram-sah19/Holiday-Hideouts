require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = process.env.Atlas_URL || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const favoritesRouter = require("./routes/favorites.js");
const profileRouter = require("./routes/profile.js");
const adminRouter = require("./routes/admin.js");
const chatbotRouter = require("./routes/chatbot.js");
const recommendationsRouter = require("./routes/recommendations.js");

// Disable Mongoose's command buffering globally.
// Without this, Mongoose queues queries for up to 10s while connecting — causing
// the "buffering timed out" error on serverless cold starts.
mongoose.set('bufferCommands', false);

// Serverless-safe MongoDB connection with caching.
// Lambda containers persist between warm invocations, so we reuse the connection.
let isConnected = false;

async function connectDB() {
    if (isConnected && mongoose.connection.readyState === 1) {
        return; // already connected — reuse
    }
    isConnected = false;
    await mongoose.connect(MONGO_URL, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 8000,
    });
    isConnected = true;
    console.log("Connected to DB ✅");
}

// Kick off connection at module load (speeds up first request on warm starts)
connectDB().catch(err => console.error("Initial DB connect failed:", err.message));


// App configuration
// In Netlify Lambda, __dirname is /var/task/netlify/functions (the bundled file location).
// LAMBDA_TASK_ROOT is /var/task (the project root), so we use it when available.
const ROOT_DIR = process.env.LAMBDA_TASK_ROOT || __dirname;

app.set("view engine", "ejs");
app.set("views", path.join(ROOT_DIR, "views"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(ROOT_DIR, "public")));

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DB-guard: ensure MongoDB is connected before any route runs.
// Critical for serverless cold starts — the module-level connectDB() call may
// not have finished by the time the first request arrives.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("DB connection failed on request:", err.message);
        res.status(503).send("Service temporarily unavailable. Please try again in a moment.");
    }
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Root route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Test chatbot route
app.get("/chat", (req, res) => {
    res.render("users/chatbot.ejs");
});

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const Listing = require("./models/listing.js");
        
        let response = "";
        const lowerMsg = message.toLowerCase();
        
        // Greetings
        if (lowerMsg.match(/^(hi|hello|hey|good morning|good evening|good afternoon)$/)) {
            const greetings = [
                "Hey there! 👋 How can I help you find your perfect stay today?",
                "Hello! 😊 Looking for a great place to stay? I'm here to help!",
                "Hi! Welcome to Wanderlust! What kind of property are you looking for?"
            ];
            response = greetings[Math.floor(Math.random() * greetings.length)];
            return res.json({ response });
        }
        
        // Thank you
        if (lowerMsg.includes("thank") || lowerMsg.includes("thanks")) {
            response = "You're very welcome! 😊 Feel free to ask if you need anything else. Happy to help!";
            return res.json({ response });
        }
        
        // Check if asking about specific property by name
        const allListings = await Listing.find();
        const mentionedProperty = allListings.find(l => 
            lowerMsg.includes(l.title.toLowerCase()) || 
            lowerMsg.includes(l.location.toLowerCase())
        );
        
        if (mentionedProperty) {
            response = `Oh, the **${mentionedProperty.title}**! That's one of our favorites! 🏡\n\n`;
            response += `It's nestled in beautiful ${mentionedProperty.location}, ${mentionedProperty.country}. `;
            response += `At just **₹${mentionedProperty.price.toLocaleString('en-IN')} per night**, it's a great deal!\n\n`;
            response += `📍 Location: ${mentionedProperty.location}\n`;
            response += `🏠 Type: ${mentionedProperty.propertyType || 'Property'}\n`;
            response += `👥 Sleeps: ${mentionedProperty.maxGuests || 2} guests\n\n`;
            if (mentionedProperty.description) {
                response += `${mentionedProperty.description}\n\n`;
            }
            response += `Interested? I can help you book it right away! Just let me know your dates. 📅`;
            return res.json({ response });
        }
        
        // Try Gemini API for natural conversation
        if (process.env.GEMINI_API_KEY) {
            try {
                const { GoogleGenerativeAI } = require("@google/generative-ai");
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                
                const listings = await Listing.find().limit(5);
                const listingsContext = listings.map(l => 
                    `${l.title} in ${l.location} (${l.propertyType}) - ₹${l.price}/night`
                ).join(', ');
                
                const prompt = `You are Maya, a friendly and enthusiastic travel assistant for Wanderlust booking platform. 
                
You're helpful, conversational, and use emojis occasionally. You speak naturally like a human friend helping someone plan their trip.
                
Available properties in our database: ${listingsContext}
                
User says: "${message}"
                
Respond warmly and naturally. If they ask about properties, mention specific ones from the list. If they ask general travel questions, answer helpfully. Keep responses conversational, friendly, and not too long (2-4 sentences usually).`;
                
                const result = await model.generateContent(prompt);
                const aiResponse = await result.response;
                response = aiResponse.text();
                return res.json({ response });
            } catch (error) {
                console.log("Gemini API error:", error.message);
            }
        }
        
        // Fallback responses with personality
        if (lowerMsg.includes("property") || lowerMsg.includes("listing") || lowerMsg.includes("show")) {
            const listings = await Listing.find().limit(5);
            if (listings.length > 0) {
                response = "Awesome! Let me show you some amazing places! 🏖️\n\n";
                listings.forEach((l, i) => {
                    response += `${i + 1}. **${l.title}** \n   📍 ${l.location}, ${l.country}\n   💰 ₹${l.price}/night\n\n`;
                });
                response += "Which one catches your eye? I can tell you more about any of them! 😊";
            }
        }
        else if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("cheap") || lowerMsg.includes("budget")) {
            const listings = await Listing.find().sort({ price: 1 }).limit(3);
            if (listings.length > 0) {
                response = "Looking for great value? Smart choice! 💰 Here are our best budget-friendly options:\n\n";
                listings.forEach((l, i) => {
                    response += `${i + 1}. **${l.title}** - Just ₹${l.price.toLocaleString('en-IN')}/night in ${l.location} 🌟\n`;
                });
                response += "\nAll of these are fantastic value! Want to know more about any of them?";
            }
        }
        else if (lowerMsg.includes("book") || lowerMsg.includes("reservation") || lowerMsg.includes("reserve")) {
            response = "Great! Booking is super simple! 🎉\n\n";
            response += "Here's what you do:\n";
            response += "1️⃣ Browse our listings\n";
            response += "2️⃣ Click on the property you love\n";
            response += "3️⃣ Pick your dates and number of guests\n";
            response += "4️⃣ Hit 'Reserve' and you're all set!\n\n";
            response += "You'll get instant confirmation! 📧 Need help picking a property?";
        }
        else if (lowerMsg.includes("where") || lowerMsg.includes("location")) {
            const listings = await Listing.find().limit(10);
            const locations = [...new Set(listings.map(l => `${l.location}, ${l.country}`))];
            response = "We've got some incredible destinations! 🌍\n\n";
            response += locations.map((l, i) => `${i + 1}. ${l}`).join('\n');
            response += "\n\nWhich destination speaks to you? I can show you what we have there! ✨";
        }
        else if (lowerMsg.includes("help") || lowerMsg.includes("what can you")) {
            response = "Hey! I'm here to make your travel planning easy! 😊\n\n";
            response += "I can help you:\n";
            response += "✨ Find properties in any location\n";
            response += "💰 Check prices and find deals\n";
            response += "📅 Guide you through booking\n";
            response += "🗺️ Give travel tips and recommendations\n\n";
            response += "Just ask me anything! What are you looking for today?";
        }
        else {
            const listings = await Listing.find().limit(3);
            response = "Hmm, I'm not quite sure what you're asking, but I'm here to help! 🤔\n\n";
            response += "You can ask me things like:\n";
            response += "• 'Show me properties in Goa'\n";
            response += "• 'What are the cheapest options?'\n";
            response += "• 'Tell me about [property name]'\n";
            response += "• 'How do I book?'\n\n";
            if (listings.length > 0) {
                response += "Or check out these popular spots:\n";
                listings.forEach(l => {
                    response += `• ${l.title} - ₹${l.price}/night\n`;
                });
            }
            response += "\nWhat would you like to know? 😊";
        }
        
        res.json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Oops! 😅 Something went wrong on my end. Mind trying that again?" });
    }
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/", bookingRouter);
app.use("/", favoritesRouter);
app.use("/", profileRouter);
app.use("/", adminRouter);
app.use("/", recommendationsRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});


// Start server only when running directly (not in Netlify)
if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;