import { auth } from './auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isProtected = req.nextUrl.pathname.startsWith('/strefa-dzialacza')

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/strefa-dzialacza', req.url)
    return Response.redirect(loginUrl)
  }
})

export const config = {
  matcher: ['/strefa-dzialacza/:path+'],
}
