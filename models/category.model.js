import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: "User"
    }
}, { timestamp: true })

export const Category = mongoose.models.Category ||
    mongoose.model("Category", categorySchema);