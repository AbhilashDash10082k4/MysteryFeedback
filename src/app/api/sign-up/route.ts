/* eslint-disable @typescript-eslint/no-unused-vars */

//signup form route

//these imports are in each route as Nextjs is a edge run (it starts every time it is refreshed)
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

//writing api
export default async function POST(request: Request) {
    await dbConnect();
    try {
        //the frontend has 3 fields -> email, username, pwd
        //requesting from user, while taking i/p from user we are checking the same username is existing in DB as verified and if yes then the username is not provided
        const {username, email, password} = await request.json(); //await coz the db takes time to connect

        //taking User from db which is verified 
        const verifiedUserByUserName = await UserModel.findOne({ //from the UserModel find one item such that ->
            username, //access user by username
            isVerified: true //showing if the user is verified, this says that give the username only if the user is verified
        })
        if (verifiedUserByUserName) {
            return Response.json({
                success: false,
                message:"Username already exists"
            },{
                status: 400,
            })
        }
        //user by email
        const existingUserByEmail = await UserModel.findOne({email}) //use email to find the user
        //otp

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists by this email",
                },{status: 500})
            }else /*if the user exists by this email but is not verified*/ {
                //taking pwd from user to verify it by sending verification mail
                const hashedPassword = await bcrypt.hash(password, 10)
                //changing the existing pwd to new pwd
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.veriCodeExpiry = new Date( Date.now() + 3600000 )//3600000 milliseconds = 1hr
                await existingUserByEmail.save();
            }

        }else /*this condition is for if the user is not verified, so it has to registration for verification*/{
            //enter password which will be hashed
            const hashedPassword = bcrypt.hash(password, 10) //hash password using 10 salted rounds
            //expiry of otp
            const expiryDate = new Date(); //new gives a object and object is a reference point in memory so it is mutable
            expiryDate.setHours(expiryDate.getHours() +1); //setting expiry of otp to 1hr from current time, this will setHours by getting Hour by getHour

            //registering this user in the DB

            //creating newUser based on his i/p
            const newUser = new UserModel({
                //these fields are taken as it is
                username,
                email,

                //pwd is changed to hashed pwd, so here it is changed
                password: hashedPassword,

                //this is otp
                verifyCode,//to verify user

                veriCodeExpiry: expiryDate, //expire user login
                isAcceptingMessage: true, //if the user is accepting anonymous message
                isVerified: false, //by default no one is verified

                message: []// Message documet is initialized as an empty array here in User as the User has just entered the DB
            })
            //saving this user in DB
            await newUser.save() //await is given to wait untill the user is created
        }
        //sending email for verification to the newUser in DB
        const sendEmailForVerification = await sendVerificationEmail(
            email, 
            username, 
            verifyCode,
        )
        //if was successfully sent or not
        if(!sendEmailForVerification.success) {
            return Response.json({
                success: false,
                message: sendEmailForVerification.message, //instead of hardcoding msg I gave msg given by the verification email
            } ,{status: 500})
        }
        //if success
        return Response.json({
            success: true,
            message: "User registered successfully, Please verify your email", 
        } ,{status: 400}) 
    }catch(error) {
        console.error("Error in connecting with DB", error);
        return Response.json({
            message:"Error in connecting with DB",
            success: false
        }, {
            status: 500
        })
    }
}