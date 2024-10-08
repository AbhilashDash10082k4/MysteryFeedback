import {z} from 'zod';
export const signInSchema = z.object({
    identifier: z.string().min(6, {message:"Should be min 6 chars"}),
    password: z.string(),
})