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
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> { //customize authorization for nextauth, takes in credentials as parameter to authorize and returns promise which can be of any type
                await dbConnect() //to authorize user in DB first connect with the DB
                try /*error will come while connecting with the DB*/ {

                    //receiveing user
                    const user = await UserModel.findOne({ //find one from UserModel
                        $or: [ //$or is a mongoose operator . Here used for future proof to provide options to signup
                            { email: credentials.identifier.email }, //taking email from credentials
                            { username: credentials.identifier.username } //method of taking username from credentials
                        ]
                    })

                    if (!user?.isVerified) { //if user is not verified
                        throw new Error("Verify your email")
                    }
            
                    //after the user is verified, checking if the pwd from DB and user via i/p is same
                    const isPasswordCorrect = await /*await for user to write their pwd*/ bcrypt.compare(credentials.password, user.password) //compare returns a boolean value
                    if(isPasswordCorrect) {
                        return user;
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
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            } 
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    }, 
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
}