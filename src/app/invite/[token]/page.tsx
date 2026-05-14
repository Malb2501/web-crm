import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { acceptInvite } from '@/lib/actions/members'
import type { Database } from '@/types/supabase'

type Props = {
  params: Promise<{ token: string }>
}

// Cliente anon sem cookies — para leitura pública do token via RPC
async function getAnonSupabase() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  )
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params

  // Bug 3 fix: usa RPC pública get_invite_by_token — não exige sessão nem política RLS
  const anonSupabase = await getAnonSupabase()
  const { data: inviteInfo } = await anonSupabase.rpc('get_invite_by_token', { p_token: token })

  if (!inviteInfo) {
    return <InviteError message="Convite inválido ou não encontrado." />
  }

  const info = inviteInfo as {
    email: string
    workspace_name: string
    accepted: boolean
    expired: boolean
  }

  if (info.accepted) {
    return <InviteError message="Este convite já foi utilizado." />
  }

  if (info.expired) {
    return <InviteError message="Este convite expirou." />
  }

  // Verificar se o usuário está logado
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/signup?invite=${token}&email=${encodeURIComponent(info.email)}`)
  }

  // Usuário logado: processar aceite via RPC SECURITY DEFINER
  const result = await acceptInvite(token)

  if ('error' in result) {
    return <InviteError message={result.error} />
  }

  redirect('/dashboard')
}

function InviteError({ message }: { message: string }) {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <span className="text-2xl text-destructive font-bold">✕</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">Convite inválido</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <a
          href="/dashboard"
          className="mt-6 inline-block rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent/90"
        >
          Ir para o dashboard
        </a>
      </div>
    </div>
  )
}
