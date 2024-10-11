/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

//all the providers (github, google, etc.) are written in option file in production

import CredentialsProvider from 'next-auth/providers/credentials'; //to use credentials for login
import { NextAuthOptions } from 'next-auth';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';  //to take pwds from user
import dbConnect from "@/lib/dbConnect"; //to takee user from db and signup


export const authOptions: NextAuthOptions = {
    //login by using credentials - a complex way for sign up
    providers: [
        CredentialsProvider({
            id: "credentials", // The name to display on the sign in form (e.g. "Sign in with...")
            name: "credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.

            credentials: { //this will create html forms for sign-in
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> { //customize authorization for nextauth, takes in credentials as parameter to authorize and returns promise which can be of any type
                await dbConnect() //to authorize user in DB first connect with the DB
                try {  
                    //receiveing user
                    const user = await UserModel.findOne({ //find one from UserModel
                        $or: [ //$or is a mongoose operator . Here used for future proof to provide options to signup, either with username or email
                            { email: credentials.identifier }, //taking email from credentials
                            { username: credentials.identifier } //method of taking username from credentials
                        ]
                    })

                    if (!user) { //if user is not verified
                        throw new Error("No user found with this email");
                    }
                    if(!user.isVerified) {
                        throw new Error(" Verify email");
                    }
            
                    //after the user is verified, checking if the pwd from DB and from user via i/p is same
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password) //compare returns a boolean value
                    if(isPasswordCorrect) {
                        return user; //this will go to providers and CredentialsProvider
                    }else {
                        throw new Error("Wrong password")
                    }
                } catch (error: any) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: { 
        //these are strategies and are needed to be customised
        async jwt( {token, user} ) { //this user is the returned user
            //take data from user and inject it to token (customization of token)
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session, token}) {
            //accessing token and modifying session, next auth is session based
            if( token ) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            } 
            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
    }, 
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET 
}