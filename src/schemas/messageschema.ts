//used for validation and not for db
//zod = schema validation
import {z} from 'zod';
export const messageSchema = z.object({
    content: z.
    string()
    .min(10, {message: 'Content must be 10 chars atleast'})
    .max(300, {message: 'Content should not be more than 300 chars'}),
})