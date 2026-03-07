// Note: Install @google/generative-ai package first
// npm install @google/generative-ai

const Listing = require("../models/listing");

const chatbotController = {
    async chat(req, res) {
        try {
            const { message } = req.body;
            
            // Simple rule-based chatbot (replace with Gemini API when package installed)
            let response = "";
            
            if (message.toLowerCase().includes("book") || message.toLowerCase().includes("reservation")) {
                response = "To book a property, browse our listings and click 'Reserve' on any property you like. You'll need to select check-in/check-out dates and number of guests.";
            } else if (message.toLowerCase().includes("price") || message.toLowerCase().includes("cost")) {
                response = "Our properties range from ₹1,000 to ₹10,000+ per night. Use our search filters to find properties within your budget.";
            } else if (message.toLowerCase().includes("location") || message.toLowerCase().includes("where")) {
                const listings = await Listing.find().limit(5);
                const locations = listings.map(l => l.location).join(", ");
                response = `We have properties in: ${locations}. Use the search bar to find specific locations.`;
            } else if (message.toLowerCase().includes("cancel")) {
                response = "You can cancel bookings from 'My Bookings' page. Click on a booking and select 'Cancel Booking'.";
            } else {
                response = "I'm here to help! Ask me about bookings, prices, locations, or cancellations. You can also browse our listings to find your perfect stay.";
            }
            
            res.json({ response });
        } catch (error) {
            res.status(500).json({ response: "Sorry, I'm having trouble right now. Please try again." });
        }
    },
    
    renderChat(req, res) {
        res.render("users/chatbot.ejs");
    }
};

module.exports = chatbotController;
