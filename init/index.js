require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.Atlas_URL || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB:", MONGO_URL.includes("atlas") ? "MongoDB Atlas ☁️" : "Local MongoDB");
  })
  .catch((err) => {
    console.log("DB connection error:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Cleared existing listings...");

  const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "6994ac1d787c25b6501cf005",
  }));

  await Listing.insertMany(dataWithOwner);
  console.log(`✅ Successfully seeded ${dataWithOwner.length} listings to Atlas!`);
  await mongoose.connection.close();
  process.exit(0);
};

initDB();
