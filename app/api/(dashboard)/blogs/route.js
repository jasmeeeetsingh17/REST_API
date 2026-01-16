import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db.js";
import { User } from "@/models/user.model.js";
import { Category } from "@/models/category.model.js";
import { Blog } from "@/models/blog.model.js";
import mongoose, { Types } from "mongoose";


export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

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

        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({
                success: false,
                message: "InValid Id or Category Id"
            }, { status: 400 })
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User Not Found"
            }, { status: 400 })
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return NextResponse.json({
                success: false,
                message: "Category Not Found"
            }, { status: 400 })
        }
        const filter = {
            user: new Types.ObjectId(id),
            category: new Types.ObjectId(categoryId)
        };

        const blogs = await Blog.find(filter);
        return NextResponse.json({
            success: true,
            message: "Blogs Fetched",
            data: { blogs }
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}

export const POST = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "UserId missing"
                },
                { status: 400 }
            );
        }

        if (!categoryId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "CategoryId missing"
                },
                { status: 400 }
            );
        }


        const { title, description } = await request.json();
        if (!title || !description) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title or description missing"
                },
                { status: 400 }
            );
        }

        await connectToDatabase();

        if (
            !mongoose.Types.ObjectId.isValid(userId) ||
            !mongoose.Types.ObjectId.isValid(categoryId)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid UserId or CategoryId"
                },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        const newBlog = await Blog.create({
            title,
            description,
            user: new mongoose.Types.ObjectId(userId),
            category: new mongoose.Types.ObjectId(categoryId),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Blog created successfully",
                data: newBlog,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
};