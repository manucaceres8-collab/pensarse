export default function PacientePage({ params }: { params: { id: string } }) {
  return (
    <main style={{ padding: 40 }}>
      <h1>Paciente: {params.id}</h1>

      <p>Seguimiento emocional del paciente</p>

      <h2 style={{ marginTop: 30 }}>Historial diario</h2>

      <ul>
        <li>Lunes — Estado emocional: 4/10</li>
        <li>Martes — Estado emocional: 6/10</li>
        <li>Miércoles — Estado emocional: 5/10</li>
      </ul>

      <h2 style={{ marginTop: 30 }}>Tareas asignadas</h2>

      <ul>
        <li>Registro de pensamientos</li>
        <li>Ejercicio de respiración</li>
      </ul>

      <div style={{ marginTop: 30 }}>
        <a href="/panel/pacientes">
          <button style={{ padding: 10 }}>
            Volver a pacientes
          </button>
        </a>
      </div>
    </main>
  );
}