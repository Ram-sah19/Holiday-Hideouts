/**
 * migrate.js — Migrate all local MongoDB data to Atlas
 * 
 * Collections migrated: users, reviews, bookings, notifications
 * (listings are already seeded via npm run seed)
 * 
 * Run: node migrate.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");

const LOCAL_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ATLAS_URL = process.env.Atlas_URL;

if (!ATLAS_URL) {
    console.error("❌ Atlas_URL not found in .env");
    process.exit(1);
}

// ─── Connect to both DBs ──────────────────────────────────────────────────────
const localConn  = mongoose.createConnection(LOCAL_URL);
const atlasConn  = mongoose.createConnection(ATLAS_URL, {
    serverSelectionTimeoutMS: 10000,
});

// ─── Wait for connections ─────────────────────────────────────────────────────
async function waitForConnection(conn, name) {
    return new Promise((resolve, reject) => {
        conn.once("open", () => { console.log(`✅ Connected to ${name}`); resolve(); });
        conn.once("error", (err) => { console.error(`❌ ${name} error:`, err.message); reject(err); });
    });
}

// ─── Migration helper ─────────────────────────────────────────────────────────
async function migrateCollection(name, schema) {
    const LocalModel  = localConn.model(name, schema);
    const AtlasModel  = atlasConn.model(name, schema);

    const docs = await LocalModel.find({}).lean();

    if (docs.length === 0) {
        console.log(`  ⚠️  ${name}: no local documents found — skipping`);
        return;
    }

    // Delete existing Atlas docs for this collection then re-insert
    await AtlasModel.deleteMany({});
    await AtlasModel.insertMany(docs, { ordered: false });
    console.log(`  ✅ ${name}: migrated ${docs.length} documents`);
}

// ─── Schemas (raw, no model overhead) ────────────────────────────────────────
const { Schema } = mongoose;

const userSchema = new Schema({}, { strict: false, timestamps: true });
const reviewSchema = new Schema({}, { strict: false });
const bookingSchema = new Schema({}, { strict: false, timestamps: true });
const notificationSchema = new Schema({}, { strict: false, timestamps: true });

// ─── Run ─────────────────────────────────────────────────────────────────────
async function run() {
    try {
        await Promise.all([
            waitForConnection(localConn,  "Local MongoDB"),
            waitForConnection(atlasConn, "MongoDB Atlas"),
        ]);

        console.log("\n🚀 Starting migration...\n");

        await migrateCollection("User",         userSchema);
        await migrateCollection("Review",       reviewSchema);
        await migrateCollection("Booking",      bookingSchema);
        await migrateCollection("Notification", notificationSchema);

        console.log("\n🎉 Migration complete! All data is now on Atlas.");
    } catch (err) {
        console.error("\n❌ Migration failed:", err.message);
    } finally {
        await localConn.close();
        await atlasConn.close();
        process.exit(0);
    }
}

run();
