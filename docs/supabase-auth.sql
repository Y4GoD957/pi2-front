alter table public.usuario
  add column if not exists auth_user_id uuid unique references auth.users (id) on delete cascade;

alter table public.usuario
  drop column if exists senha;

create unique index if not exists usuario_email_unique_idx
  on public.usuario (email);

alter table public.usuario enable row level security;
alter table public.perfil enable row level security;

drop policy if exists "usuario_select_own" on public.usuario;
create policy "usuario_select_own"
  on public.usuario
  for select
  to authenticated
  using (auth.uid() = auth_user_id);

drop policy if exists "usuario_update_own" on public.usuario;
create policy "usuario_update_own"
  on public.usuario
  for update
  to authenticated
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists "perfil_select_authenticated" on public.perfil;
create policy "perfil_select_authenticated"
  on public.perfil
  for select
  to authenticated
  using (true);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_profile_id integer;
begin
  default_profile_id := coalesce((new.raw_user_meta_data ->> 'profile_id')::integer, 2);

  insert into public.usuario (
    auth_user_id,
    nome,
    data_nascimento,
    "CPF",
    email,
    telefone,
    endereco,
    id_perfil
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'birth_date',
    new.raw_user_meta_data ->> 'cpf',
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'address',
    default_profile_id
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
