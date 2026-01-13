import { NextResponse } from "next/server";
import { User } from "@/models/user.model.js";
import { connectToDatabase } from "@/lib/db.js";

export const DELETE = async (request, { params }) => {
    try {
        await connectToDatabase();

        const { id } = await params;
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "UserId Missing"
            }, { status: 400 })
        }
        const user = await User.findByIdAndDelete(id).select('-password');
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User does not exist"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "User Deleted "
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}