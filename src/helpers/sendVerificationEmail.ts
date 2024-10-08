/* eslint-disable @typescript-eslint/no-unused-vars */
import { resend } from "@/lib/resend"; //file used to send verification emails using email template
import VerficationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

//funciton to send verification email- will send email(string), username(string, will send the email to a particular username), verifyCode(string, this is otp)
export async function sendVerificationEmail( //funcn is async as email will take time to be sent
    //all these are from the email template 
    email: string, 
    verifyCode: string, //otp to be sentby this funcn
    username: string,
): Promise<ApiResponse> /*the return type will be a promise which will be of customised Apiresponse type*/{ 
    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to: email,
            subject: "Verification email",
            react: VerficationEmail({username, otp: verifyCode}) //component defined in VerificationEmail.tsx to send email
        })
        return ({success: true, message: "Email sent successfully"})
    }catch(emailError) {
        console.error("Failed to send email", emailError)
        return ({success: false, message: "Failed to send email"}) //Promise always demands response
    }
}