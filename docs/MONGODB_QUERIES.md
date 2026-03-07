# MongoDB Test Queries

## Create Admin User

```javascript
// After registering a user, make them admin
db.users.updateOne(
  { username: "admin" },
  { $set: { role: "admin" } }
)

// Or update by email
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## View All Users

```javascript
db.users.find().pretty()
```

## View All Listings

```javascript
db.listings.find().pretty()
```

## View All Bookings

```javascript
db.bookings.find().pretty()
```

## Add Sample Listing (if needed)

```javascript
db.listings.insertOne({
  title: "Luxury Beach Villa",
  description: "Stunning beachfront property with ocean views",
  image: {
    url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
    filename: "sample"
  },
  price: 5000,
  location: "Goa",
  country: "India",
  propertyType: "villa",
  maxGuests: 6,
  amenities: ["WiFi", "Pool", "Beach Access", "Parking"],
  owner: ObjectId("YOUR_USER_ID_HERE"),
  reviews: [],
  bookedDates: [],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Check User's Favorites

```javascript
db.users.findOne(
  { username: "testuser" },
  { favorites: 1 }
)
```

## View User's Bookings

```javascript
db.bookings.find({ user: ObjectId("USER_ID") }).pretty()
```

## View Listing's Bookings

```javascript
db.bookings.find({ listing: ObjectId("LISTING_ID") }).pretty()
```

## Cancel All Bookings (for testing)

```javascript
db.bookings.updateMany(
  {},
  { $set: { status: "cancelled" } }
)
```

## Clear Booked Dates from Listing

```javascript
db.listings.updateOne(
  { _id: ObjectId("LISTING_ID") },
  { $set: { bookedDates: [] } }
)
```

## View Notifications

```javascript
db.notifications.find().pretty()
```

## Mark All Notifications as Read

```javascript
db.notifications.updateMany(
  { user: ObjectId("USER_ID") },
  { $set: { read: true } }
)
```

## Delete All Bookings (reset)

```javascript
db.bookings.deleteMany({})
```

## Delete All Notifications (reset)

```javascript
db.notifications.deleteMany({})
```

## Find Listings by Property Type

```javascript
db.listings.find({ propertyType: "villa" }).pretty()
```

## Find Listings in Price Range

```javascript
db.listings.find({
  price: { $gte: 1000, $lte: 5000 }
}).pretty()
```

## Find Available Listings (no bookings)

```javascript
db.listings.find({
  bookedDates: { $size: 0 }
}).pretty()
```

## Count Total Users

```javascript
db.users.countDocuments()
```

## Count Total Listings

```javascript
db.listings.countDocuments()
```

## Count Total Bookings

```javascript
db.bookings.countDocuments()
```

## Find Admin Users

```javascript
db.users.find({ role: "admin" }).pretty()
```

## Add Multiple Sample Listings

```javascript
db.listings.insertMany([
  {
    title: "Mountain Cabin",
    description: "Cozy cabin in the mountains",
    image: { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233", filename: "cabin" },
    price: 3000,
    location: "Manali",
    country: "India",
    propertyType: "cabin",
    maxGuests: 4,
    amenities: ["Fireplace", "Mountain View"],
    owner: ObjectId("YOUR_USER_ID"),
    reviews: [],
    bookedDates: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "City Apartment",
    description: "Modern apartment in city center",
    image: { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", filename: "apartment" },
    price: 2000,
    location: "Mumbai",
    country: "India",
    propertyType: "apartment",
    maxGuests: 2,
    amenities: ["WiFi", "Gym", "Parking"],
    owner: ObjectId("YOUR_USER_ID"),
    reviews: [],
    bookedDates: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

## Update Listing with New Fields

```javascript
// If old listings don't have new fields
db.listings.updateMany(
  { propertyType: { $exists: false } },
  {
    $set: {
      propertyType: "other",
      maxGuests: 2,
      amenities: [],
      bookedDates: []
    }
  }
)
```

## Update Users with New Fields

```javascript
// If old users don't have new fields
db.users.updateMany(
  { role: { $exists: false } },
  {
    $set: {
      role: "user",
      favorites: []
    }
  }
)
```

## Find Bookings by Status

```javascript
// Confirmed bookings
db.bookings.find({ status: "confirmed" }).pretty()

// Pending bookings
db.bookings.find({ status: "pending" }).pretty()

// Cancelled bookings
db.bookings.find({ status: "cancelled" }).pretty()
```

## Find Upcoming Bookings

```javascript
db.bookings.find({
  checkIn: { $gte: new Date() },
  status: { $ne: "cancelled" }
}).sort({ checkIn: 1 }).pretty()
```

## Find Past Bookings

```javascript
db.bookings.find({
  checkOut: { $lt: new Date() }
}).sort({ checkOut: -1 }).pretty()
```

## Get User with Populated Favorites

```javascript
db.users.aggregate([
  { $match: { username: "testuser" } },
  {
    $lookup: {
      from: "listings",
      localField: "favorites",
      foreignField: "_id",
      as: "favoriteListings"
    }
  }
])
```

## Get Listing with Owner Details

```javascript
db.listings.aggregate([
  { $match: { _id: ObjectId("LISTING_ID") } },
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "ownerDetails"
    }
  }
])
```

## Statistics Query

```javascript
// Get booking statistics
db.bookings.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
      totalRevenue: { $sum: "$totalPrice" }
    }
  }
])
```

## Find Most Booked Listings

```javascript
db.bookings.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  {
    $group: {
      _id: "$listing",
      bookingCount: { $sum: 1 }
    }
  },
  { $sort: { bookingCount: -1 } },
  { $limit: 10 }
])
```

## Backup Commands

```bash
# Backup entire database
mongodump --db wanderlust --out ./backup

# Restore database
mongorestore --db wanderlust ./backup/wanderlust

# Export collection to JSON
mongoexport --db wanderlust --collection listings --out listings.json

# Import collection from JSON
mongoimport --db wanderlust --collection listings --file listings.json
```

## Reset Database (CAUTION!)

```javascript
// Delete all data (use carefully!)
db.bookings.deleteMany({})
db.notifications.deleteMany({})
db.reviews.deleteMany({})
db.listings.deleteMany({})
// Don't delete users unless you want to start fresh
```

## Useful Indexes (for performance)

```javascript
// Create indexes for better query performance
db.listings.createIndex({ location: "text", country: "text", title: "text" })
db.listings.createIndex({ price: 1 })
db.listings.createIndex({ propertyType: 1 })
db.bookings.createIndex({ user: 1 })
db.bookings.createIndex({ listing: 1 })
db.bookings.createIndex({ checkIn: 1, checkOut: 1 })
```

## Check Indexes

```javascript
db.listings.getIndexes()
db.bookings.getIndexes()
db.users.getIndexes()
```

---

**Note**: Replace `YOUR_USER_ID` and `LISTING_ID` with actual ObjectIds from your database.

**Tip**: Use MongoDB Compass GUI for easier data visualization and querying!
