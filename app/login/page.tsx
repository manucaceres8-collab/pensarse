export default function LoginPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Pensarse</h1>
      <p>Selecciona cómo quieres entrar</p>

      <div style={{ marginTop: 30 }}>
        <a href="/panel">
          <button style={{ padding: 10, marginRight: 20 }}>
            Entrar como Psicólogo
          </button>
        </a>

        <a href="/mi">
          <button style={{ padding: 10 }}>
            Entrar como Paciente
          </button>
        </a>
      </div>
    </main>
  );
}