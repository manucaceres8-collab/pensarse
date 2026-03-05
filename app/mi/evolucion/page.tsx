export default function EvolucionPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Tu evolución</h1>
      <p>Ejemplo de los últimos días (aquí luego irá el gráfico).</p>

      <ul style={{ marginTop: 20 }}>
        <li>Lunes — 4/10</li>
        <li>Martes — 6/10</li>
        <li>Miércoles — 5/10</li>
        <li>Jueves — 7/10</li>
      </ul>

      <div style={{ marginTop: 30 }}>
        <a href="/mi">
          <button style={{ padding: 10 }}>Volver</button>
        </a>
      </div>
    </main>
  );
}