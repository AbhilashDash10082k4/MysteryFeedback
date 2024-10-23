/* eslint-disable @typescript-eslint/no-unused-vars */
//to show the msgs of logged in user
//to know which user is logged in, sessions are to be used
//user should be also able to send msgs

import { getServerSession } from "next-auth"; // take sesssion from backend and whatever data is reqd it is taken by query call, retrieves the current session on the server side.
import { authOptions } from "../auth/[...nextauth].ts/option";// FOR CREDENTIALS, to configure how the session is fetched.
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; //to get authenticated user

//post request to allow user to toggle the button whether he wants to accept random msgs or not
export async function POST(request: Request) {
    await dbConnect();
    //getting logged in user, take user is and take all its info by query
    //1. getting session
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User //injected user in session in authOptions, as assertion is used
    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "User is not authenticated"
        }, {status: 401});
    }
    const userId = user._id
    //request to backend from user whether to recieve messages
    const {acceptMessages} = await request.json();  

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(user, {isAcceptingMessages: acceptMessages}, {new: true}) //find user by id and update it on the basis of accepting messages
        if(!updatedUser) {
            console.log("Failed to update user status to accept message")
            return Response.json({
                success: false,
                message: "Failed to update user status to accept message"
            }, {status: 401});
        }
        console.log("Successfuly updated user status to accept message")
        return Response.json({
            success: true,
            message: "Successfuly updated user status to accept message",
            updatedUser,
        }, {status: 200});

    } catch (error) {
        console.log("Failed to update user status to accept message")
        return Response.json({
            success: false,
            message: "Failed to update user status to accept message"
        }, {status: 500});
    }
}

//GET method to query from db and send status
export async function GET(request: Request) {
    await dbConnect();
    //getting logged in user, take user is and take all its info by query
    //1. getting session
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User 
    if(!session || !session.user) {
        console.log("Failed to...")
        return Response.json({
            success: false,
            message: "User is not authenticated"
        }, {status: 401});
    }
    const userId = user._id
    try {
        const foundUserById = await UserModel.findById(user); //query from DB
        if(!foundUserById) {
            console.log("Failed to find user")
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404});
        }
    
        return Response.json({
            success: true,
            isAcceptingMessages: foundUserById.isAcceptingMessage //if the user found by id is accepting messages
        }, {status: 200});
    } catch (error) {
        console.log("Failed to...")
        return Response.json({
            success: false,
            message: "User not found"
        }, {status: 401});
    }
}