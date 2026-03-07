# MVC Architecture - Wanderlust Project

## ✅ Your Project Follows MVC Pattern

### **M - Models** (Data Layer)
Located in: `models/`

```
models/
├── user.js          - User data schema
├── listing.js       - Property listings schema
├── booking.js       - Booking data schema
├── review.js        - Review data schema
├── notification.js  - Notification schema
└── message.js       - Message schema
```

**Purpose**: Define data structure and database interactions

---

### **V - Views** (Presentation Layer)
Located in: `views/`

```
views/
├── layouts/
│   └── boilerplate.ejs    - Main layout template
├── includes/
│   ├── navbar.ejs         - Navigation bar
│   ├── footer.ejs         - Footer
│   └── flash.ejs          - Flash messages
├── listings/
│   ├── index.ejs          - All listings
│   ├── show.ejs           - Single listing
│   ├── new.ejs            - Create listing form
│   ├── edit.ejs           - Edit listing form
│   └── recommendations.ejs - Recommendations
└── users/
    ├── signup.ejs         - Signup form
    ├── login.ejs          - Login form
    ├── profile.ejs        - User profile
    ├── bookings.ejs       - User bookings
    ├── favorites.ejs      - Favorites list
    ├── chatbot.ejs        - AI chatbot
    └── admin*.ejs         - Admin views
```

**Purpose**: Display data to users (HTML/EJS templates)

---

### **C - Controllers** (Business Logic Layer)
Located in: `controllers/`

```
controllers/
├── users.js         - User authentication logic
├── listings.js      - Listing CRUD + search/filter
├── bookings.js      - Booking management
├── reviews.js       - Review management
├── favorites.js     - Favorites logic
├── profile.js       - Profile management
├── admin.js         - Admin panel logic
├── chatbot.js       - AI chatbot logic
└── recommendations.js - Recommendation algorithm
```

**Purpose**: Handle business logic and connect Models with Views

---

## 🔄 MVC Flow in Your Project

### Example: Creating a Booking

1. **User Action** (View)
   - User fills booking form in `views/listings/show.ejs`
   - Submits POST request to `/listings/:id/book`

2. **Route** (Router)
   - `routes/booking.js` receives request
   - Calls `bookingController.createBooking`

3. **Controller** (Business Logic)
   - `controllers/bookings.js` processes request
   - Validates data
   - Checks availability
   - Calculates price

4. **Model** (Data)
   - `models/booking.js` saves to database
   - `models/listing.js` updates booked dates

5. **Response** (View)
   - Redirects to `views/users/bookingShow.ejs`
   - Shows booking confirmation

---

## 📁 Additional MVC Components

### **Routes** (URL Mapping)
Located in: `routes/`

```
routes/
├── user.js          - /signup, /login, /logout
├── listing.js       - /listings/*
├── booking.js       - /bookings/*
├── review.js        - /listings/:id/reviews/*
├── favorites.js     - /favorites
├── profile.js       - /profile
├── admin.js         - /admin/*
└── chatbot.js       - /chat
```

**Purpose**: Map URLs to controller functions

---

### **Middleware** (Request Processing)
Located in: `middleware.js`

```javascript
- isLoggedIn       - Check authentication
- isOwner          - Check listing ownership
- isAdmin          - Check admin role
- isCompany        - Check company role
- validateListing  - Validate listing data
- validateReview   - Validate review data
```

**Purpose**: Process requests before reaching controllers

---

### **Utils** (Helper Functions)
Located in: `utils/`

```
utils/
├── wrapAsync.js      - Async error handling
├── ExpressError.js   - Custom error class
└── emailService.js   - Email notifications
```

**Purpose**: Reusable utility functions

---

## 🎯 MVC Benefits in Your Project

1. **Separation of Concerns**
   - Models handle data
   - Views handle presentation
   - Controllers handle logic

2. **Maintainability**
   - Easy to find and fix bugs
   - Clear file organization
   - Modular code structure

3. **Scalability**
   - Easy to add new features
   - Can modify one layer without affecting others
   - Team-friendly structure

4. **Testability**
   - Controllers can be tested independently
   - Models can be unit tested
   - Views can be tested separately

---

## 📊 MVC Architecture Diagram

```
┌─────────────────────────────────────────────┐
│              User Browser                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              Routes (URL Mapping)            │
│  /listings, /bookings, /profile, etc.       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│           Middleware (Processing)            │
│  Authentication, Validation, etc.            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Controllers (Business Logic)         │
│  Process requests, call models               │
└──────────┬─────────────────────┬─────────────┘
           │                     │
           ▼                     ▼
┌──────────────────┐    ┌──────────────────┐
│  Models (Data)   │    │  Views (UI)      │
│  MongoDB Schema  │    │  EJS Templates   │
└──────────────────┘    └──────────────────┘
```

---

## ✅ Your Project Structure is Perfect MVC!

### Models ✅
- User, Listing, Booking, Review, Notification, Message

### Views ✅
- EJS templates for all pages
- Layouts and includes for reusability

### Controllers ✅
- Separate controllers for each feature
- Clean business logic separation

### Routes ✅
- RESTful routing
- Organized by feature

### Middleware ✅
- Authentication
- Authorization
- Validation

---

## 🎓 MVC Best Practices You're Following

1. ✅ **Fat Models, Thin Controllers**
   - Models contain data logic
   - Controllers stay focused

2. ✅ **DRY (Don't Repeat Yourself)**
   - Reusable components
   - Shared layouts

3. ✅ **Single Responsibility**
   - Each file has one purpose
   - Clear separation

4. ✅ **RESTful Routes**
   - Standard HTTP methods
   - Predictable URLs

5. ✅ **Modular Code**
   - Easy to maintain
   - Easy to extend

---

## 🚀 Your MVC Project is Production-Ready!

No changes needed - your architecture is already following MVC pattern perfectly!

**Key Points:**
- ✅ Models in `models/`
- ✅ Views in `views/`
- ✅ Controllers in `controllers/`
- ✅ Routes in `routes/`
- ✅ Middleware in `middleware.js`
- ✅ Utils in `utils/`

**Perfect MVC implementation!** 🎉
