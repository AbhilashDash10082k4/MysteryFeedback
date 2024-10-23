import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    //msg could be sent from anyone so, no need to logged in user
    const {username, content} = await request.json(); //from request method we can get content and username sent by the unauthorized user

    //finding the user from db
    const user = await UserModel.findOne( {username} ); //authorized user
    try {
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {status: 404})
        }
        //if user is found and is not accepting messages
        if(!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            }, {status: 403})
        }
        //crafting of message when the user is found and is accepting message
        const newMessage = {content, createdAt: new Date()} //destructuring the str of msg, createdAt: new Date() => as the msg is created at the present date
        user.message.push(newMessage as Message); //pushing messages in Message Schema, the condition was if the messages follow Message Schema then only push
        await user.save(); //saving user with new msgs
    } catch (error) {
        console.log("Failed to...", error)
        return Response.json({
            success: false,
            message: "Error in sending messages"
        }, {status: 500});
    }
}