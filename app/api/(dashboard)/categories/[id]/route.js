import { NextResponse } from "next/server";
import { User } from "@/models/user.model.js";
import { connectToDatabase } from "@/lib/db.js";
import { Category } from "@/models/category.model.js";

export const GET = async (request, { params }) => {
    try {
        await connectToDatabase();

        const { id } = await params;
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "UserId Missing"
            }, { status: 400 })
        }
        const user = await User.findById(id).select('-password');
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User does not exist"
            }, { status: 400 })
        }

        const categories = await Category.find({ user: id });

        return NextResponse.json({
            success: true,
            message: "Categories Fetched",
            data: {
                categories
            }
        }, { status: 200 });


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}

export const POST = async (request, { params }) => {
    try {
        await connectToDatabase();
        const { id } = await params;
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "UserId Missing"
            }, { status: 400 })
        }
        const { title } = await request.json();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User Not Found"
            }, { status: 400 })
        }
        const newCategory = new Category({ title, user: id });
        await newCategory.save();
        return NextResponse.json({
            success: true,
            message: " Category Created",
            data: newCategory
        }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}


