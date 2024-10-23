/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from "@/lib/dbConnect";
import {z} from 'zod';
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";

//checking that the username follows userName Validation schema
const UserNameQuerySchema = z.object({
    username: userNameValidation 
})
//a GET method to GET username from user and check it with UserNameValidation
export async function GET(request: Request) {
    await dbConnect();
    try {
        //taking username as a query parameter from URL
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        //validating this username
        const result = UserNameQuerySchema.safeParse(queryParam);
        console.log(result);
        if(!result.success) {
            const userNameErrors = result.error.format().username?._errors || [];
            return Response.json({success: false, message: userNameErrors?.length >0 ? userNameErrors.join(', ') : "Invalid query params"}, {status: 400});
        }

        //taking username form result
        const {username} = result.data;
        
        //finding from DB whether {username} = result.data; is there
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true});
        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username already exists'
            }, {status: 400});
        }
        else {
            return Response.json({
                success: true,
                message: 'Username available'
            }, {status: 400});
        }

    } catch (error) {
        console.error("Error in checking username",error);
        return Response.json({success: false, message:"Error in checking username"}, {status: 500});
    }
}
