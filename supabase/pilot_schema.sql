-- Pensar(SE) piloto real - esquema inicial
-- Ejecutar en Supabase SQL Editor

create extension if not exists pgcrypto;

-- 1) Perfiles (vinculados a auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  role text not null check (role in ('psicologo', 'paciente')),
  clinic_name text,
  created_at timestamptz not null default now()
);

-- 2) Pacientes (vinculados al psicólogo)
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  psychologist_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text,
  objective text,
  tracking_scale text check (
    tracking_scale in ('emoji', 'oneToFive', 'oneToTen', 'bienestar', 'ansiedad')
  ),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 3) Registros diarios
create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  value text,
  note text,
  created_at timestamptz not null default now()
);

-- 4) Biblioteca de tareas
create table if not exists public.tasks_library (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  therapy_type text,
  response_type text,
  duration_minutes integer,
  is_custom boolean not null default false,
  psychologist_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (duration_minutes is null or duration_minutes > 0)
);

-- 5) Tareas asignadas
create table if not exists public.tasks_assigned (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  task_library_id uuid references public.tasks_library(id) on delete cascade,
  goal text,
  instructions text,
  status text not null default 'pendiente' check (status in ('pendiente', 'en curso', 'hecha')),
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  check (
    (status = 'hecha' and completed_at is not null)
    or
    (status in ('pendiente', 'en curso'))
  )
);

-- 6) Respuestas de tareas
create table if not exists public.task_responses (
  id uuid primary key default gen_random_uuid(),
  task_assigned_id uuid not null references public.tasks_assigned(id) on delete cascade,
  response jsonb,
  created_at timestamptz not null default now()
);

-- Extra de compatibilidad UI actual (notas del paciente)
create table if not exists public.patient_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  text text not null,
  author text not null check (author in ('paciente', 'psicologo')),
  created_at timestamptz not null default now()
);

-- Índices recomendados
create index if not exists idx_patients_psychologist_id on public.patients(psychologist_id);
create index if not exists idx_daily_checkins_patient_id on public.daily_checkins(patient_id);
create index if not exists idx_tasks_library_psychologist_id on public.tasks_library(psychologist_id);
create index if not exists idx_tasks_assigned_patient_id on public.tasks_assigned(patient_id);
create index if not exists idx_tasks_assigned_task_library_id on public.tasks_assigned(task_library_id);
create index if not exists idx_task_responses_task_assigned_id on public.task_responses(task_assigned_id);
create index if not exists idx_patient_notes_patient_id on public.patient_notes(patient_id);

-- RLS mínima para profiles
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Seed inicial de biblioteca de tareas base (flujo real)
insert into public.tasks_library (
  title,
  description,
  therapy_type,
  response_type,
  duration_minutes,
  is_custom,
  psychologist_id
)
select
  s.title,
  s.description,
  s.therapy_type,
  s.response_type,
  s.duration_minutes,
  false as is_custom,
  null as psychologist_id
from (
  values
    ('Registro diario breve', 'Síntesis breve de cómo ha ido el día en 1-2 frases.', 'tcc', 'texto corto', 2),
    ('Registro ABC', 'Situación, pensamiento, emoción, conducta y alternativa.', 'tcc', 'formulario breve', 6),
    ('Reestructuración cognitiva simple', 'Detecta pensamiento automático y formula alternativa más útil.', 'tcc', 'texto corto', 5),
    ('Registro de pensamientos automáticos', 'Identifica pensamientos automáticos y su intensidad.', 'tcc', 'formulario breve', 5),
    ('Activación conductual', 'Planifica una acción breve y valora su impacto emocional.', 'tcc', 'selección', 4),
    ('Valores personales', 'Conecta acciones diarias con valores importantes.', 'act', 'formulario breve', 5),
    ('Registro de evitación', 'Describe conductas de evitación y su coste a corto/largo plazo.', 'act', 'texto corto', 4),
    ('Técnica STOP', 'Aplica STOP para pausar, observar y responder de forma efectiva.', 'dbt', 'selección', 3),
    ('Regulación emocional breve', 'Puntúa intensidad emocional antes y después de regular.', 'dbt', 'escala', 4),
    ('Escala de progreso 1-10', 'Valora tu progreso actual y define siguiente paso.', 'soluciones', 'escala', 3)
) as s(title, description, therapy_type, response_type, duration_minutes)
where not exists (
  select 1
  from public.tasks_library t
  where lower(t.title) = lower(s.title)
    and coalesce(t.is_custom, false) = false
);
