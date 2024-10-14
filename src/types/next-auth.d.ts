//modifying existing data types for sign-up page

import 'next-auth';
import { DefaultSession } from 'next-auth';

//declare is a file
declare module 'next-auth' {
    //accessing all modules from 'next-auth' and modifying them
    interface User /*modifying User module in next-auth, adding a field - _id*/{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session { //modifying session
       user: {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
       } & DefaultSession['user']; //user is a key
    }
}
//another way of modifying module =>
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string, 
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string,
    }
}