import { NextRequest, NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt" //reading a json web token from API route, get token from middleware
export { default } from "next-auth/middleware" //required to authentication for entire site


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    //all work to be done here
    //getting token
    const token = await getToken({ req: request });

    //getting the present url to redirect
    const url = request.nextUrl

    //strategy for redirection based on having token
    if (token && (url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }//this means if the user has token (isVerified = true) and is on routes sign-in and sign-up, then no need to sign-in or sign-up, redirect user to dashboard (home page)

    return NextResponse.redirect(new URL('/home', request.url))
}

//config are the files where we want to run the middlewares
export const config = {
    matcher: ['/sign-in', '/sign-up', '/dashboard/:path*', '/', '/verify/:path*'] //matcher is the collection of paths wherewe want to run middlewares, /dashboard/:path* means every path coming in dashboard

}