import ChatWidget from "./components/ChatWidget";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 20% 10%, rgba(15, 118, 110, 0.12), transparent 55%)," +
          "radial-gradient(900px 500px at 80% 30%, rgba(59, 130, 246, 0.10), transparent 50%)," +
          "#f6f3ee",
        color: "#1f2937",
        padding: "44px 18px",
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* HEADER */}
        <header style={{ textAlign: "center", marginBottom: 26 }}>
          {/* LOGO */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="logopensar-se.png"
              alt="Pensar(SE)"
              style={{
                height: 56,
                width: "auto",
                marginBottom: 14,
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.10))",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: 54,
              margin: 0,
              letterSpacing: "-1px",
              color: "#0f172a",
            }}
          >
            Pensar(SE)
          </h1>

          <p
            style={{
              marginTop: 10,
              fontSize: 18,
              lineHeight: 1.5,
              color: "rgba(15, 23, 42, 0.78)",
            }}
          >
            Entrenamiento psicológico basado en evidencia.
          </p>

          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              color: "rgba(15, 23, 42, 0.55)",
            }}
          >
            Prueba el asistente abajo. Responde con calma y estructura.
          </p>
        </header>

        {/* CHAT */}
        <section>
          <ChatWidget />
        </section>

        {/* FOOTER MINI */}
        <footer
          style={{
            marginTop: 18,
            textAlign: "center",
            fontSize: 12,
            color: "rgba(15, 23, 42, 0.55)",
          }}
        >
          *Demo. No sustituye atención profesional. Si hay riesgo, pide ayuda inmediata.*
        </footer>
      </div>
    </main>
  );
}