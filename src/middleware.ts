import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  //Define public paths that do not require authentication
      const publicPaths = ['/sign-in', '/sign-up', '/verify']

      // If the user is authenticated and tries to access a public path, redirect to dashboard
      if (token && publicPaths.some(path => url.pathname.startsWith(path))) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      //If the user is not authenticated and tries to access a protected path, redirect to sign-in
      if (!token && !publicPaths.some(path => url.pathname.startsWith(path))) {
          return NextResponse.redirect(new URL('/sign-in', request.url))
      }

      // Allow the request to proceed
      return NextResponse.next()
  }

  export const config = {
      matcher: [
          '/sign-in',
          '/sign-up',
          '/verify/:path*',
          '/dashboard/:path*',
          '/protected/:path*', // Add other protected routes as needed
      ]
//   if (
//     token &&
//     (url.pathname.startsWith("/sign-in") ||
//       url.pathname.startsWith("/sign-up") ||
//       url.pathname.startsWith("/verify") ||
//       url.pathname.startsWith("/"))
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
  
//     return NextResponse.redirect(new URL("/sign-in",request.url))
// }
// export const config = {
//     matcher: [
//       "/sign-in",
//       "/sign-up",
//       "/dashboard/:path*",
//       "/verify/:path*",
//       "/"
//     ],
  };
