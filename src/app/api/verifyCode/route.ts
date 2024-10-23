/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        //user will send data in json
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username); //decoding uri
        const user = await UserModel.findOne( {username: decodedUsername} );

        if(!user) {
            console.log("Error in finding user");
            return Response.json({
                success: false,
                message: "User not found",
            }, {status: 500});
        }
        //comparing code
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.veriCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified",
            }, {status: 200});
        }else if(!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code expired, please sign up to get a new verified code",
            }, {status: 500})
        }else {
            return Response.json({
                success: false,
                message: "Wrong Code",
            }, {status: 500});
        }

    } catch (error) {
        console.log("Error in verifying code",error);
        return Response.json({
            success: false,
            message: "Error in verifying code",
        }, {status: 500});
    }
}