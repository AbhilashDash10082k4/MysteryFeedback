import {z} from 'zod';
export const verifyUserSchema = z.object({
    code: z.string().min(6, {message:"Should be min 6 chars"})
})