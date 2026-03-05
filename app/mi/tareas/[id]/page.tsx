export default function TareaDetallePage({ params }: { params: { id: string } }) {
  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <h1>Tarea #{params.id}</h1>
      <p>Aquí el paciente completa la tarea asignada.</p>

      <div style={{ marginTop: 20 }}>
        <label style={{ display: "block", marginBottom: 6 }}>
          Tu respuesta:
        </label>
        <textarea
          placeholder="Escribe aquí..."
          rows={6}
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button style={{ padding: 10, marginRight: 12 }}>
          Guardar
        </button>

        <a href="/mi/tareas">
          <button style={{ padding: 10 }}>
            Volver a tareas
          </button>
        </a>
      </div>
    </main>
  );
}