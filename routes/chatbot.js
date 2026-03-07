const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbot");

router.get("/chat", chatbotController.renderChat);
router.post("/chat", chatbotController.chat);

module.exports = router;
