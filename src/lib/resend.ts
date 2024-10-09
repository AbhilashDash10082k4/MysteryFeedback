import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY); //resend is exported to work with api keys
