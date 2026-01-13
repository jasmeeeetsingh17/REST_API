import { connectToDatabase } from "@/lib/db.js";
import { User } from "@/models/user.model.js";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export const GET = async () => {
    try {
        await connectToDatabase();
        const users = await User.find().select('-password');
        if (users.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No Users"
            }, { status: 409 })
        }
        return NextResponse.json({
            success: true,
            message: "Users Fetched Successfully",
            data: users
        }, { status: 200 })

    } catch (error) {
        return NextResponse({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}

export const POST = async (request) => {
    try {
        const { name, password, email } = await request.json();
        if (!name || !password || !email) {
            return NextResponse.json({
                success: false,
                message: "Details Missing"
            }, { status: 400 })
        }
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({
                success: false,
                message: "User Exists"
            }, { status: 409 })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, password: hashPassword, email });
        await newUser.save();
        return NextResponse.json({
            success: true,
            message: "User created successfully",
            data: {
                id: newUser._id,
                username: newUser.name,
                email: newUser.email
            },
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        }, { status: 500 });
    }
}

export const PATCH = async (request) => {
    try {
        const { nname, email, nemail } = await request.json();
        if (!nname || !email || !nemail) {
            return NextResponse.json({
                success: false,
                message: "Details Missing"
            }, { status: 400 });
        }
        const updateUser = { name: nname, email: nemail };
        const user = await User.findOneAndUpdate({ email }, updateUser, { new: true }).select('-password');
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "No User Exists"
            }, { status: 409 })
        }
        return NextResponse.json({
            success: true,
            message: "User Updated",
            data: user
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}

