export default function TareasPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Tus tareas</h1>
      <p>Ejemplo de tareas asignadas.</p>

      <ul style={{ marginTop: 20 }}>
        <li>
          <a href="/mi/tareas/1">Registro de pensamientos</a>
        </li>
        <li>
          <a href="/mi/tareas/2">Ejercicio de respiración</a>
        </li>
      </ul>

      <div style={{ marginTop: 30 }}>
        <a href="/mi">
          <button style={{ padding: 10 }}>Volver</button>
        </a>
      </div>
    </main>
  );
}