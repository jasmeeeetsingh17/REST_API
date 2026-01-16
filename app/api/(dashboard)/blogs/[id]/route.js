import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db.js";
import { User } from "@/models/user.model.js";
import { Category } from "@/models/category.model.js";
import { Blog } from "@/models/blog.model.js";
import mongoose, { Types } from "mongoose";

export const GET = async (request, { params }) => {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get('userId');
        const catId = searchParams.get('categoryId');
        const { id: blogId } = await params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "UserId Missing"
            })
        }
        if (!catId) {
            return NextResponse.json({
                success: false,
                message: "CategoryId Missing"
            }, { status: 400 });
        }
        if (!blogId) {
            return NextResponse.json({
                success: false,
                message: "blogId Missing"
            }, { status: 400 });
        }
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(id)
            || !mongoose.Types.ObjectId.isValid(catId)) {
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

        const category = await Category.findById(catId);
        if (!category) {
            return NextResponse.json({
                success: false,
                message: "Category Not Found"
            }, { status: 400 })
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: id,
            category: catId
        });
        return NextResponse.json({
            success: true,
            message: "Blog Fetched",
            data: blog
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}

export const PATCH = async (request, { params }) => {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get('userId');
        const { id: blogId } = await params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "UserId Missing"
            })
        }
        if (!blogId) {
            return NextResponse.json({
                success: false,
                message: "blogId Missing"
            }, { status: 400 });
        }
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(id)
            || !mongoose.Types.ObjectId.isValid(blogId)) {
            return NextResponse.json({
                success: false,
                message: "InValid Id or Blog Id"
            }, { status: 400 })
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User Not Found"
            }, { status: 400 })
        }

        const { title, description } = await request.json();
        if (!title || !description) {
            return NextResponse.json({
                success: false,
                message: "Details Missig"
            }, { status: 400 })
        }

        const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title: title, description: description, },
            { new: true }
        );
        if (!updateBlog) {
            return NextResponse.json({
                success: false,
                message: "Blog Not Found"
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: "Blog Updated",
            data: { updateBlog }
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}

export const DELETE = async (request, { params }) => {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get('userId');
        const { id: blogId } = await params;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "UserId Missing"
            })
        }
        if (!blogId) {
            return NextResponse.json({
                success: false,
                message: "blogId Missing"
            }, { status: 400 });
        }
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(id)
            || !mongoose.Types.ObjectId.isValid(blogId)) {
            return NextResponse.json({
                success: false,
                message: "InValid Id or CBlog Id"
            }, { status: 400 })
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User Not Found"
            }, { status: 400 })
        }

        const blog = await Blog.findOne({ _id: blogId, user: id });
        if (!blog) {
            return NextResponse.json({
                success: false,
                message: "Blog Not Found"
            }, { status: 400 })
        }

        const deleteBlog = await Blog.findByIdAndDelete(blogId);

        return NextResponse.json({
            success: true,
            message: "Blog Deleted",
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}
