import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema({
    title: {
        type: "String",
        required: true
    },
    description: {
        type: "String",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Catwgory"
    },
}, { timestamps: true });

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);