export default function NuevoPacientePage() {
  return (
    <main style={{ padding: 40, maxWidth: 520 }}>
      <h1>Añadir paciente</h1>
      <p>Introduce los datos del paciente para crear su ficha.</p>

      <form style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Alias / Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Juan"
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Email del paciente
          </label>
          <input
            type="email"
            placeholder="juan@email.com"
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <button style={{ padding: 10, marginTop: 10 }}>
          Crear paciente
        </button>
      </form>

      <div style={{ marginTop: 30 }}>
        <a href="/panel/pacientes">
          <button style={{ padding: 10 }}>Volver a pacientes</button>
        </a>
      </div>
    </main>
  );
}
