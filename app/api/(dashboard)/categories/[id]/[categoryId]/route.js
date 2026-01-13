import { NextResponse } from "next/server";
import { User } from "@/models/user.model.js";
import { connectToDatabase } from "@/lib/db.js";
import { Category } from "@/models/category.model.js";
import mongoose, { mongo } from "mongoose";

export const PATCH = async (request, { params }) => {
    try {
        await connectToDatabase();
        const { id, categoryId } = await params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "UserID Missing"
            }, { status: 400 });
        }
        if (!categoryId) {
            return NextResponse.json({
                success: false,
                message: "CategoryId Missing"
            }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({
                success: false,
                message: "Invalid UserId or CategoryId"
            }, { status: 400 });
        }

        const body = await request.json();
        const { title } = body;
        if (!title) {
            return NextResponse.json({
                success: false,
                message: "Title is required"
            }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User Not Found"
            }, { status: 400 })
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: categoryId, user: id },
            { title },
            { new: true }
        );


        return NextResponse.json({
            success: true,
            message: "Category Updated",
            data: updatedCategory
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}

export const DELETE = async (request, { params }) => {
    try {
        await connectToDatabase();
        const { id, categoryId } = await params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "UserID Missing"
            }, { status: 400 });
        }
        if (!categoryId) {
            return NextResponse.json({
                success: false,
                message: "CategoryId Missing"
            }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({
                success: false,
                message: "InValid Id or Category Id"
            }, { status: 400 })
        }

        const deletedCategory = await Category.findOneAndDelete({
            _id: categoryId,
            user: id
        });


        if (!deletedCategory) {
            return NextResponse.json({
                success: false,
                message: "Category not found"
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: "Category Deleted",
            data: deletedCategory
        }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}