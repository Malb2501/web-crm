import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/pipeline', '/leads', '/settings', '/onboarding']
const AUTH_PATHS = ['/login', '/signup', '/forgot-password']

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options } as never)
          response = NextResponse.next({ request })
          response.cookies.set({ name, value, ...options } as never)
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options } as never)
          response = NextResponse.next({ request })
          response.cookies.set({ name, value: '', ...options } as never)
        },
      },
    }
  )

  // getSession() lê o cookie localmente — sem chamada de rede ao Supabase.
  // getUser() faz uma chamada de rede a cada request e causa timeout de 20s+
  // quando o Supabase está lento. A verificação real fica nos Server Components.
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p))

  if (isProtected && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthPage && session) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
