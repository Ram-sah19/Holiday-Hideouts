# Holiday-Hideouts - Travel Listing Platform

A full-stack MERN application for listing and reviewing travel destinations with advanced features.

## ✨ Features

- 🔐 User authentication (Client/Company/Admin roles)
- 📝 Property listings with search & filters
- 📅 Booking system with real-time availability
- ❤️ Favorites/Wishlist
- 👤 User profiles
- 🛡️ Admin panel
- 🤖 AI Chatbot (Gemini API)
- 📧 Email notifications
- 🎯 Smart recommendations
- 🌙 Dark mode UI

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start server
npm run dev
```

## 📁 Project Structure

```
├── controllers/     # Business logic
├── models/         # Database schemas
├── routes/         # API routes
├── views/          # EJS templates
├── public/         # Static files
├── utils/          # Helper functions
└── docs/           # Documentation
```

## 📚 Documentation

All documentation is in the `docs/` folder:

- [Features Guide](docs/FEATURES.md)
- [Installation Guide](docs/INSTALLATION.md)
- [MVC Architecture](docs/MVC_ARCHITECTURE.md)
- [MongoDB Queries](docs/MONGODB_QUERIES.md)
- [Quick Reference](docs/QUICK_REFERENCE.md)
- [Testing Guide](docs/TESTING.md)
- [Role System](docs/ROLES.md)
- [New Features](docs/NEW_FEATURES.md)
- [Implementation Details](docs/IMPLEMENTATION.md)
- [Final Summary](docs/FINAL_SUMMARY.md)

## 🎯 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: EJS, Bootstrap 5
- **Authentication**: Passport.js
- **File Upload**: Cloudinary, Multer
- **AI**: Google Gemini API
- **Email**: Nodemailer

## 🔑 Environment Variables

```
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
MAP_TOKEN=your_mapbox_token
MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
SESSION_SECRET=your_secret
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

## 👥 User Roles

- **Client**: Browse, book, favorite properties
- **Company**: Add and manage listings
- **Admin**: Full system access

## 📞 Support

Check the [docs/](docs/) folder for detailed guides.

## 📄 License

ISC

---

**Built with ❣️ for GSoC Project**
