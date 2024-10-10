/* eslint-disable @typescript-eslint/no-unused-vars */
import { resend } from "@/lib/resend"; //file used to send verification emails using email template
import VerficationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

//funciton to send verification email- will send email(string), username(string, will send the email to a particular username), verifyCode(string, this is otp)
export async function sendVerificationEmail( //funcn is async as email will take time to be sent
    //all these are from the email template 
    email: string, 
    username: string,
    verifyCode: string, //otp to be sent by this funcn
): Promise<ApiResponse> /*the return type will be a promise which will be of customised Apiresponse type*/{ 
    try { //try catch as emails can fail
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to: email,
            subject: "MysteryFeedback | Verification code",
            react: VerficationEmail({username, otp: verifyCode}) //component defined in VerificationEmail.tsx to send email
        })
        return ({
            success: true,
            message: "Email sent successfully"
        })
    }catch(emailError) {
        console.error("Failed to send email", emailError)
        return ({
            success: false, 
            message: "Failed to send email"
        }) //Promise always demands response
    }
}