# Installation Instructions

## Required Packages

Run these commands to install new dependencies:

```bash
npm install @google/generative-ai nodemailer
```

## Package Details

1. **@google/generative-ai** - For AI chatbot with Gemini API
2. **nodemailer** - For email notifications

## Environment Variables

Add to your .env file:

```
GEMINI_API_KEY=AIzaSyCzHrjIAe-hI9vTACRdJVww_esCKMkz3x0
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Email Setup (Gmail)

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password
4. Use that password in EMAIL_PASS

## Features Added

✅ AI Chatbot with Gemini API
✅ Email Notifications (booking confirmation/cancellation)
✅ Real-time Booking Availability Check
✅ Recommendation System
✅ CI/CD Pipeline ready

## Routes Added

- GET /chat - AI Chatbot interface
- POST /chat - Send message to chatbot
- GET /recommendations - View recommended properties

## Test Chatbot

1. Login to your account
2. Click "💬 AI Chat" in navbar
3. Ask questions like:
   - "How do I book a property?"
   - "What are the prices?"
   - "Where are properties located?"
   - "How do I cancel a booking?"
