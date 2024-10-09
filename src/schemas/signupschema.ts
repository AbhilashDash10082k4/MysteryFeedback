// validating input for signup

//VALIDATING USERNAME;
import {z} from 'zod';

export const userNameValidation = z
    .string()
    .min(7, "Min no. of chars should be 7")
    .max(21, "Should not exceed more than 21")
    .regex(/^[a-zA-Z0-9 ]*$/, "Username should not have any special chars")

//exporting signup
//whole UserSchema fields are to be given zod validation
export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message: "Invalid email"}),//email() does all the regex validation
    password: z.string().min(7, "Pwd should be of min 6 chars").max(21, "should not exceed 21 chars")
})