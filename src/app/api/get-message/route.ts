/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/option";// FOR CREDENTIALS, to configure how the session is fetched.
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; //to get authenticated user
import mongoose from "mongoose";

export async function GET( request: Request ) {
    await dbConnect();
    //getting session
    //if the user is logged in
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "User is not authenticated"
        }, {status: 401});
    }
    const userId = new mongoose.Types.ObjectId(user._id) //Mongoose uses ObjectId for performing queries, so converting a string _id to ObjectId ensures that you can use it in MongoDB operations such as queries, updates, or deletions.
    try {
        //getting messages, using aggregation pipeline
        const user = await UserModel.aggregate([
            {$match: {id: userId}}, //matching user with the derived userId
            {$unwind: '$messages'}, //unwinding array to get object of user which has messages,id and createdAt 
            {$sort: {'messages.createsAt': -1}}, //sorting messages in descending order
            {$group: {_id: '_id', messages:{$push: '$messages'}}} //grp by id and push the sorted messages'
        ])
        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User is not authenticated"
            }, {status: 401});
        }
        return Response.json({
            success: true,
            message: user[0].messages //return type of aggregate is an user
        }, {status: 200});
    } catch (error) {
        console.log("Failed to...")
        return Response.json({
            success: false,
            message: "User not found"
        }, {status: 500});
    }
}