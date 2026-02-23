// app/page.tsx
import Image from "next/image";
import ChatWidget from "./components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Fondo sutil */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-220px] left-1/3 h-[520px] w-[520px] rounded-full bg-white/3 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-10 pt-14">
        {/* Logo + marca */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-5">
            <Image
              src="/logopensar-se.png" // asegúrate de que esté en /public
              alt="Logo Pensar(SE)"
              width={170}
              height={170}
              priority
              className="opacity-90 drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
            />
          </div>

          <h1 className="text-5xl font-light tracking-tight sm:text-6xl">
            Pensar(SE)
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Entrenamiento psicológico basado en evidencia.
          </p>

          <p className="mt-6 text-sm text-zinc-400">
            Prueba el asistente abajo 👇
          </p>
        </div>

        {/* Chat abajo */}
        <section className="mt-10 w-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-md">
            <ChatWidget />
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-zinc-500">
          Demo · Pensar(SE)
        </footer>
      </div>
    </main>
  );
}
