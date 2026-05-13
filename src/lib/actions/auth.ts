'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const message =
      error.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos'
        : 'Erro ao fazer login. Tente novamente.'
    redirect(`/login?error=${encodeURIComponent(message)}`)
  }

  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
    },
  })

  if (error) {
    const message =
      error.message.includes('already registered')
        ? 'Este e-mail já está cadastrado'
        : 'Erro ao criar conta. Tente novamente.'
    redirect(`/signup?error=${encodeURIComponent(message)}`)
  }

  redirect('/signup?success=check_email')
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
