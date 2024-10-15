import NextAuth from "next-auth";
import { authOptions } from "./option";

//This setup ensures that your Next.js application can handle authentication seamlessly, leveraging NextAuth's capabilities with your custom configurations.
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};