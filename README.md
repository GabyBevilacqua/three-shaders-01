# 🌍 Estudio de Shaders y Gráficos 3D con Three.js + React Three Fiber (R3F) + Next.js

Este proyecto tiene como objetivo **aprender y experimentar con shaders personalizados** en Three.js utilizando la integración de **React Three Fiber (R3F)** dentro de un entorno moderno de **Next.js con TypeScript**.

---

## 🎯 Objetivos de aprendizaje

Durante el desarrollo de este proyecto aprenderé a:

- 🎨 **Crear y entender la composición y configuración de shaders en Three.js**  
  Comprender cómo funcionan los *vertex shaders* y *fragment shaders*, cómo se comunican y cómo se integran en materiales personalizados (`ShaderMaterial`).

- 🪐 **Importar texturas en los shaders para crear un globo terráqueo**  
  Cargar texturas de mapas del mundo (por ejemplo, `earth.jpg`, `bump.jpg`, `specular.jpg`) y aplicarlas a una malla esférica.

- 🧩 **Crear vertex y fragment shaders desde cero**  
  Escribir código GLSL básico, entender las variables `attribute`, `uniform` y `varying`, y cómo afectan la forma y color de los objetos 3D.

- ⚙️ **Importar y usar shaders en un proyecto moderno (Vite / Next.js)**  
  Aprender la estructura correcta para importar archivos `.glsl`, `.vert`, y `.frag` en un entorno de React Three Fiber con TypeScript.

- 🧠 **Comprender conceptos complejos de 3D**  
  - *Normales*: dirección perpendicular a una superficie.  
  - *Atributos*: datos por vértice como posición, color o normales.  
  - *Varyings*: valores interpolados que conectan vertex y fragment shaders.  
  - *UVs*: coordenadas que mapean texturas sobre una geometría.

- 📍 **Dibujar puntos de datos interactivos sobre un globo**  
  Convertir coordenadas de latitud y longitud en posiciones 3D para colocar marcadores interactivos en la superficie terrestre.

- 🗂️ **Importar datos masivos y renderizarlos en la escena**  
  Cargar datos en formato JSON o CSV, procesarlos y mostrarlos dinámicamente con Three.js.

- 🎞️ **Animar mallas generadas con GSAP**  
  Integrar la librería **GSAP** para crear animaciones suaves, como rotaciones automáticas del globo o pulsaciones de puntos de datos.

- 🖱️ **Agregar interactividad con clic y arrastre**  
  Implementar controles personalizados o usar `OrbitControls` para permitir rotar, hacer zoom y mover el globo con el mouse.

- 📱 **Escalar la escena 3D para pantallas pequeñas**  
  Ajustar cámara, posiciones y tamaños según el tamaño de pantalla, logrando una experiencia fluida en móviles y tablets.

- 🤳 **Agregar listeners y eventos móviles**  
  Detectar gestos táctiles como “pinch to zoom” o rotación del globo mediante toques y drags.

---

## 🧰 Tecnologías utilizadas

- **Next.js 14+** – Framework React moderno con App Router  
- **TypeScript** – Tipado estático para código más robusto  
- **Three.js** – Motor 3D de JavaScript  
- **React Three Fiber (R3F)** – Integración de Three.js con React  
- **@react-three/drei** – Colección de helpers y componentes R3F  
- **GSAP** – Librería de animaciones  
- **GLSL** – Lenguaje de programación de shaders  
- **VS Code** – Editor de código con soporte para shaders

---

## ⚙️ Instalación

Clonar el repositorio y ejecutar los siguientes comandos:

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
