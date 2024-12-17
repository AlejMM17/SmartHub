import { NextResponse } from "next/server"

export default function middleware(request) {

    const { pathname } = request.nextUrl

    const userCookie = request.cookies.get("user");

    // Si no tenemos cookie quiere decir que no estas autenticado
    if (!userCookie) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    let user
    try {
        user = JSON.parse(userCookie.value);
    } catch (error) {
        console.error("Error parsing user cookie:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = user.role

    // Rutas que solo los estudiantes pueden acceder
    if (pathname.startsWith("/student") && userRole !== "student") {
        return NextResponse.redirect(new URL("/", request.url))
    }

    // Rutas que solo los profesores pueden acceder
    if (pathname.startsWith("/professor") && userRole !== "professor") {
        return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/student',
        '/professor',
        '/student/(.*)',
        '/professor/(.*)',
      ]
}
