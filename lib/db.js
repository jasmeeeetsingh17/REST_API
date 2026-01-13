import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js"

if (!DB_URI) {
    throw new Error("Error please define the MONGODB_URI environment variable");
}

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`connected to database through ${NODE_ENV} Mode `);
    }
    catch (error) {
        console.error("Error connecting", error);
        process.exit(1);
    }
}