-- Pensar(SE) - Seed inicial de biblioteca de tareas (flujo real)
-- Ejecutar en Supabase SQL Editor

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

-- Verificación rápida
select
  id,
  title,
  therapy_type,
  response_type,
  duration_minutes,
  is_custom
from public.tasks_library
where coalesce(is_custom, false) = false
order by created_at desc, title asc;
