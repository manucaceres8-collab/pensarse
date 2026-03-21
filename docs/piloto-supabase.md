# Piloto cerrado con Supabase

## 1) Variables de entorno
Copia `.env.example` a `.env.local` y completa:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2) Base de datos
Ejecuta `supabase/pilot_schema.sql` en SQL Editor de Supabase.

## 3) Dependencias
Instala nuevas dependencias:

```bash
npm install
```

## 4) Crear psicólogo
Abre `/register/psicologo`, crea tu cuenta y entrarás a `/panel`.

## 5) Crear pacientes
Desde `/panel/pacientes/nuevo` crea paciente con email + contraseña.
Ese paciente podrá entrar por `/login` y se redirige a `/mi`.

## Notas
- Si Supabase no está configurado, los endpoints mantienen fallback demo.
- En modo real, pacientes quedan vinculados al psicólogo autenticado.
