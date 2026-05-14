import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { acceptInvite } from '@/lib/actions/members'

type Props = {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params

  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Validar o token antes de renderizar
  const { data: invite } = await supabase
    .from('workspace_invites')
    .select('id, email, workspace_id, accepted_at, expires_at, workspaces(name)')
    .eq('token', token)
    .maybeSingle()

  if (!invite) {
    return <InviteError message="Convite inválido ou não encontrado." />
  }

  if (invite.accepted_at) {
    return <InviteError message="Este convite já foi utilizado." />
  }

  if (new Date(invite.expires_at) < new Date()) {
    return <InviteError message="Este convite expirou." />
  }

  // Se não está logado, redireciona para signup com o token como parâmetro
  if (!user) {
    redirect(`/signup?invite=${token}&email=${encodeURIComponent(invite.email)}`)
  }

  // Usuário logado: processar aceite diretamente
  const result = await acceptInvite(token)

  if ('error' in result) {
    return <InviteError message={result.error} />
  }

  // Redireciona para o dashboard com o workspace aceito ativo
  redirect('/dashboard')
}

function InviteError({ message }: { message: string }) {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <span className="text-2xl">✕</span>
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
