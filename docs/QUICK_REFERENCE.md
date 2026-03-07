# Quick Reference Guide

## 🚀 Start Server
```bash
npm run dev
```

## 🔑 Create Admin User
```javascript
// MongoDB Shell or Compass
db.users.updateOne(
  { username: "admin" },
  { $set: { role: "admin" } }
)
```

## 📍 Routes Reference

### Public Routes
- `GET /` - Homepage (redirects to /listings)
- `GET /listings` - All listings with search/filter
- `GET /listings/:id` - Listing details
- `GET /signup` - Signup page
- `GET /login` - Login page
- `POST /signup` - Create account
- `POST /login` - Login
- `GET /logout` - Logout

### User Routes (Login Required)
- `GET /listings/new` - Create listing form
- `POST /listings` - Create listing
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Booking Routes (Login Required)
- `GET /listings/:id/availability?checkIn=&checkOut=` - Check availability
- `POST /listings/:id/book` - Create booking
- `GET /bookings` - My bookings
- `GET /bookings/:id` - Booking details
- `DELETE /bookings/:id` - Cancel booking

### Favorites Routes (Login Required)
- `POST /listings/:id/favorite` - Add to favorites
- `DELETE /listings/:id/favorite` - Remove from favorites
- `GET /favorites` - View favorites

### Profile Routes (Login Required)
- `GET /profile` - View profile
- `GET /profile/edit` - Edit profile form
- `PUT /profile` - Update profile

### Review Routes (Login Required)
- `POST /listings/:id/reviews` - Add review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Admin Routes (Admin Only)
- `GET /admin` - Admin dashboard
- `GET /admin/listings` - Manage listings
- `DELETE /admin/listings/:id` - Delete listing
- `GET /admin/users` - Manage users
- `POST /admin/users/:id/ban` - Ban user

## 🔍 Search & Filter Parameters

```
GET /listings?search=beach&minPrice=1000&maxPrice=5000&propertyType=villa&guests=4
```

Parameters:
- `search` - Search in title, location, country
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `propertyType` - apartment, house, villa, cabin, hotel, resort
- `guests` - Minimum number of guests

## 📊 Database Models

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: "user" | "admin",
  favorites: [ObjectId],
  phone: String,
  bio: String,
  profilePicture: { url, filename }
}
```

### Listing
```javascript
{
  title: String,
  description: String,
  image: { url, filename },
  price: Number,
  location: String,
  country: String,
  propertyType: String,
  maxGuests: Number,
  amenities: [String],
  owner: ObjectId,
  reviews: [ObjectId],
  bookedDates: [{ checkIn, checkOut }]
}
```

### Booking
```javascript
{
  listing: ObjectId,
  user: ObjectId,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  status: "pending" | "confirmed" | "cancelled" | "completed",
  paymentStatus: "pending" | "paid" | "refunded",
  paymentId: String
}
```

### Review
```javascript
{
  rating: Number (1-5),
  comment: String,
  author: ObjectId,
  listing: ObjectId
}
```

### Notification
```javascript
{
  user: ObjectId,
  type: "booking" | "message" | "review" | "cancellation",
  message: String,
  link: String,
  read: Boolean
}
```

## 🎨 UI Components

### Navbar Links
- Home
- All Listings
- Add Listing (logged in)
- My Bookings (logged in)
- ❤️ Favorites (logged in)
- Profile (logged in)
- Admin (admin only)
- Login/Signup or Logout

### Listing Card
- Image
- Title
- Price per night
- Property type
- Max guests
- Link to details

### Booking Form
- Check-in date
- Check-out date
- Number of guests
- Reserve button

### Profile Tabs
- My Listings
- My Bookings
- My Reviews

## 🔐 Middleware

### isLoggedIn
Checks if user is authenticated

### isOwner
Checks if user owns the listing

### isReviewAuthor
Checks if user wrote the review

### isAdmin
Checks if user has admin role

### validateListing
Validates listing data with Joi

### validateReview
Validates review data with Joi

## 💡 Common Tasks

### Add Sample Listing
```javascript
{
  title: "Beach Villa",
  description: "Beautiful villa by the beach",
  price: 5000,
  location: "Goa",
  country: "India",
  propertyType: "villa",
  maxGuests: 6,
  amenities: ["WiFi", "Pool", "Parking"]
}
```

### Test Booking
1. Login as user
2. Go to listing
3. Fill dates (future dates)
4. Enter guests (≤ maxGuests)
5. Click Reserve

### Test Admin
1. Create user
2. Set role to "admin" in DB
3. Login
4. Click "Admin" in navbar

## 🐛 Debugging

### Check Logs
```bash
# Server logs in terminal
# Browser console for client errors
```

### Common Issues
1. **Favorites not working**: User must be logged in
2. **Booking fails**: Check dates are in future
3. **Admin panel not visible**: Check user role in DB
4. **Images not uploading**: Check Cloudinary credentials

## 📝 Testing Checklist

- [ ] Register new user
- [ ] Login
- [ ] Create listing
- [ ] Search listings
- [ ] Filter by price
- [ ] Filter by type
- [ ] View listing details
- [ ] Add to favorites
- [ ] Create booking
- [ ] View my bookings
- [ ] Cancel booking
- [ ] Add review
- [ ] Edit profile
- [ ] Upload profile picture
- [ ] Admin: View dashboard
- [ ] Admin: Delete listing
- [ ] Logout

## 🎯 Demo Flow

1. **Homepage** → Show search and filters
2. **Search** → Type "beach" → Show results
3. **Filter** → Set price range → Show filtered
4. **Listing** → Click card → Show details
5. **Favorite** → Click ❤️ → Added
6. **Book** → Fill form → Reserve
7. **Bookings** → View in navbar
8. **Profile** → Show dashboard
9. **Admin** → Login as admin → Show panel

## 📞 Support

Check these files for details:
- `FEATURES.md` - Complete feature list
- `IMPLEMENTATION.md` - Implementation details
- `README.md` - Project overview

Happy coding! 🚀
