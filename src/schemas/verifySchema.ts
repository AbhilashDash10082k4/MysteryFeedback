import {z} from 'zod';
export const verifyUserSchema = z.string().min(6, {message:"Should be min 6 chars"})