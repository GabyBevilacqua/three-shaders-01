import Scene from "@/components/Scene";

export default function Home() {
  return (
    <main style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <Scene />
      <div className="container">
        <h1>Globo Terráqueo</h1>
        <p>Este es un modelo 3D de un globo terráqueo utilizando Three.js y shaders personalizados.</p>
      </div>
    </main>
  );
}

