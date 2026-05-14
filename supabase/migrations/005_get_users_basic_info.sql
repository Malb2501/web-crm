-- ============================================================
-- 005_get_users_basic_info.sql
-- Função RPC para buscar email + nome de vários usuários
-- Necessária para a página de membros (auth.users não é acessível via RLS normal)
-- ============================================================

create or replace function get_users_basic_info(p_user_ids uuid[])
returns table (
  id    uuid,
  email text,
  name  text
)
language sql
security definer
stable
as $$
  select
    u.id,
    u.email,
    coalesce(
      u.raw_user_meta_data->>'full_name',
      u.raw_user_meta_data->>'name',
      u.email
    ) as name
  from auth.users u
  where u.id = any(p_user_ids);
$$;

-- Apenas usuários autenticados podem chamar esta função
revoke all on function get_users_basic_info(uuid[]) from public;
grant execute on function get_users_basic_info(uuid[]) to authenticated;
