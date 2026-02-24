# Guía de Configuración: Electron + React + TypeScript + Tailwind + Auto-Updater

Guía paso a paso para crear una aplicación de escritorio desde cero con el stack moderno de Electron.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Electron | ^40 | Ventana y proceso nativo |
| React | ^19 | UI del Renderer |
| TypeScript | ^5 | Tipado estático |
| Tailwind CSS | ^4 | Estilos |
| Vite | ^7 | Bundler del Renderer |
| Bun | 1.3.x | Gestor de paquetes y runner |
| electron-builder | ^26 | Empaquetado y publicación |
| electron-updater | ^6 | Auto-actualización desde GitHub |
| concurrently | ^9 | Doble arranque dev (UI + Electron) |

---

## Arquitectura del Proyecto Final

```
electron-todo/
├── docs/
│   └── setup.md              ← Esta guía
├── src/
│   ├── app.ts                ← Main Process: ventana, IPC, updater
│   ├── Main.tsx              ← Entry point del Renderer (React)
│   ├── App.tsx               ← Componente raíz de React
│   └── types/
│       └── browser.ts        ← Tipos de TypeScript para BrowserWindow
├── index.html                ← HTML del Renderer (Vite lo sirve)
├── index.css                 ← Estilos globales con Tailwind v4
├── main.ts                   ← Entry point de Electron (llama a Init())
├── preload.ts                ← Bridge seguro Node ↔ UI (contextBridge)
├── vite.config.ts            ← Configuración de Vite + Tailwind + React
├── tsconfig.json             ← TypeScript en strict mode
└── package.json              ← Scripts, metadatos y dependencias
```

**Flujo de dos procesos:**
```
Electron (main.ts → src/app.ts)   →  Abre la ventana
                                        ↓
                               Carga http://localhost:5173
                                        ↓
               Vite (vite.config.ts) sirve el Renderer
                                        ↓
           React (src/Main.tsx → src/App.tsx) dibuja la UI
```

---

## Paso 1 — Crear el Proyecto con Bun

```bash
# Crear la carpeta del proyecto
mkdir electron-todo
cd electron-todo

# Inicializar con Bun
bun init -y
```

---

## Paso 2 — Instalar Dependencias

```bash
# Dependencias de producción
bun add electron electron-updater tailwindcss @tailwindcss/vite

# Dependencias de desarrollo
bun add -d vite @vitejs/plugin-react electron-builder
bun add -d react react-dom nodemon concurrently
bun add -d @types/react @types/react-dom @types/node
```

---

## Paso 3 — Configurar `package.json`

**Archivo:** `package.json`

```json
{
  "name": "electron-todo",
  "description": "App to manage ToDo Tasks",
  "version": "1.0.0",
  "author": "tu-usuario",
  "license": "MIT",
  "main": "main.ts",
  "keywords": ["electron", "react", "typescript", "tailwindcss", "todo", "vite"],
  "homepage": "https://github.com/tu-usuario/electron-todo#readme",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/electron-todo"
  },
  "private": true,
  "type": "module",
  "scripts": {
    "dev:ui": "vite",
    "dev:main": "electron .",
    "app:start": "concurrently \"bun run dev:ui\" \"bun run dev:main\"",
    "app:dir": "electron-builder --dir",
    "app:dist": "electron-builder",
    "app:publish": "electron-builder -p always"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/bun": "latest",
    "@types/node": "^25.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "concurrently": "^9.0.0",
    "electron": "^40.0.0",
    "electron-builder": "^26.0.0",
    "nodemon": "^3.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "vite": "^7.0.0"
  },
  "peerDependencies": {
    "typescript": "^5"
  },
  "dependencies": {
    "electron-log": "^5.0.0",
    "electron-updater": "^6.0.0"
  },
  "build": {
    "appId": "com.tuusuario.electron-todo",
    "productName": "electron-todo",
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "ia32"]
        }
      ]
    },
    "directories": {
      "output": "release"
    },
    "nsis": {
      "oneClick": false
    }
  },
  "publish": {
    "provider": "github",
    "owner": "tu-usuario",
    "repo": "electron-todo"
  }
}
```

> ⚠️ **Nota crítica:** Electron lee la propiedad `"main"` para encontrar el archivo de entrada.
> Si usas `"module"` en lugar de `"main"`, Electron no arrancará y mostrará `Cannot find module`.
>
> ⚠️ **Separación de dependencias:** `electron`, `electron-builder`, `react`, `tailwindcss`, `vite` van en
> `devDependencies` porque el `electron-builder` sólo empaqueta lo que está en `dependencies` dentro de la app.
> En producción sólo son necesarios `electron-updater` y `electron-log`.
>
> ⚠️ **`build.repository` es campo inválido:** `electron-builder` no acepta `repository` dentro del
> objeto `build`. El repositorio debe ir en la raíz del JSON (propiedad `repository` estándar de npm).

---

## Paso 4 — Configurar TypeScript

**Archivo:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "target": "ESNext",
    "module": "ES2022",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noPropertyAccessFromIndexSignature": false,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@pages/*": ["src/pages/*"],
      "@config/*": ["src/config/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

> **Por qué `"DOM"` en `lib`:** Sin esta bandera, TypeScript no reconoce `document`, `window`
> ni ningún objeto del navegador, ya que asume que estamos en Node.js puro.

---

## Paso 5 — Configurar Vite

**Archivo:** `vite.config.ts`

```typescript
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL('./src', import.meta.url)),
            "@pages": fileURLToPath(new URL('./src/pages', import.meta.url)),
            "@types": fileURLToPath(new URL('./src/types', import.meta.url)),
            "@config": fileURLToPath(new URL('./src/config', import.meta.url))
        }
    },
    base: "./"
})
```

> **Por qué `base: "./"` es crítico:** Vite por defecto genera rutas absolutas (`/assets/main.js`).
> Electron carga archivos del disco duro, no de un servidor, por lo que una ruta absoluta falla.
> Con `"./"` Vite usa rutas relativas que Electron puede encontrar en el sistema de archivos.
>
> **Por qué `fileURLToPath` en los alias:** En proyectos `"type": "module"` no existe `__dirname`.
> Se usa `import.meta.url` (la URL del archivo actual) y `fileURLToPath` la convierte a ruta del sistema.

---

## Paso 6 — Tipos Personalizados para Electron

**Archivo:** `src/types/browser.ts`

```typescript
export type WebPreferencesType = {
    nodeIntegration: boolean;
    contextIsolation: boolean;
    preload: string;
}

export interface BrowserWindowOptions {
    width: number;
    height: number;
    title: string;
    webPreferences: WebPreferencesType;
}
```

---

## Paso 7 — Main Process (Proceso Principal)

**Archivo:** `src/app.ts`

```typescript
import type { BrowserWindowOptions } from "@types/browser";
import { fileURLToPath } from "node:url";
import { app, autoUpdater, BrowserWindow } from "electron";
import { appUpdater } from "electron-updater";
import path from "node:path";

// Recreamos __dirname porque usamos "type": "module" (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWin: BrowserWindow | null;

const optionsWindow: BrowserWindowOptions = {
    width: 1366,
    height: 768,
    title: "Todo App",
    webPreferences: {
        nodeIntegration: false,       // SEGURO: deshabilitar Node.js en la UI
        contextIsolation: true,       // SEGURO: aislar el motor de JS del renderer
        preload: path.join(__dirname, "../preload.ts")
    }
};

const CreateWindow = () => {
    mainWin = new BrowserWindow(optionsWindow);
    // En desarrollo: Vite sirve en localhost
    // En producción: cambiar por mainWin.loadFile(path.join(__dirname, '../dist/index.html'))
    mainWin.loadURL("http://localhost:5173");
};

// Configura el comportamiento del updater (sin auto-descarga ni auto-instalación)
const UpdateApp = () => {
    appUpdater.autoDownload = false;              // El usuario decide cuándo descargar
    autoUpdater.autoInstallOnAppQuit = false;     // El usuario decide cuándo instalar
};

// Dispara la verificación de actualizaciones contra GitHub Releases
const checkUpdate = () => {
    appUpdater.checkForUpdates();
};

export default function Init() {
    app.whenReady().then(CreateWindow);

    // Cuando todas las ventanas se cierran, cerrar la app por completo
    app.on('window-all-closed', () => {
        app.quit();
    });

    // En macOS: si el usuario hace click en el ícono del Dock sin ventanas abiertas
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            CreateWindow();
        }
    });

    app.on('check-for-updates', checkUpdate);
}
```

> **Nota sobre `window-all-closed`:** El comportamiento estándar de macOS es mantener la app viva
> tras cerrar todas las ventanas. Aquí lo omitimos para forzar el cierre total en todos los OS.
> Si quieres el comportamiento nativo de Mac, usa `if (process.platform !== "darwin") app.quit()`.

---

## Paso 8 — Entry Point de Electron

**Archivo:** `main.ts` (raíz del proyecto, apuntado por `"main"` en `package.json`)

```typescript
import Init from "./src/app.ts";

Init();
```

---

## Paso 9 — HTML del Renderer

**Archivo:** `index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="./src/Main.tsx"></script>
</body>
</html>
```

---

## Paso 10 — Estilos Globales con Tailwind v4

**Archivo:** `index.css`

```css
@import "tailwindcss";

/* Tailwind v4: los tokens se definen en @theme, no en tailwind.config.js */
@theme {
    --color-primary: #2563eb;
    --color-secondary: #10b981;
    --color-accent: #f59e0b;
    --color-background: #f9fafb;
    --color-surface: #ffffff;
    --color-text: #1f2937;
    --color-text-secondary: #6b7280;
    --color-border: #e5e7eb;
    --color-error: #ef4444;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-info: #3b82f6;
}
```

> **Tailwind v4 ya no necesita `tailwind.config.js`.** Los colores personalizados y tokens
> de diseño se declaran directamente en el CSS usando la directiva `@theme`.

---

## Paso 11 — Entry Point de React

**Archivo:** `src/Main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "../index.css"; // ← Conecta Tailwind al ciclo de Vite

const el: Element | null = document.getElementById('app');

// Guard Clause: si el div #app no existe en el HTML, lanzamos un error claro
if (!el) {
    throw new Error("No se encontró el elemento raíz 'app' en el index.html");
}

ReactDOM.createRoot(el).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

> **Por qué importar el CSS aquí:** Vite trata los archivos CSS como módulos.
> Para que el plugin de Tailwind los procese, deben estar en el grafo de importaciones de JS.
> Importarlo en `Main.tsx` garantiza que Vite lo detecte y lo procese al primer arranque.

---

## Paso 12 — Componente Raíz de React

**Archivo:** `src/App.tsx`

```tsx
const App = () => {
    return (
        <div>
            <h1>Todo App</h1>
        </div>
    );
};

export { App };
```

---

## Paso 13 — Preload (Bridge de Seguridad)

**Archivo:** `preload.ts`

```typescript
import { contextBridge, ipcRenderer } from "electron";

// contextBridge.exposeInMainWorld expone APIs seguras al proceso Renderer.
// El Renderer NO puede importar 'electron' directamente.
// Cualquier comunicación con el Main Process debe pasar por aquí.
//
// Ejemplo de uso futuro:
// contextBridge.exposeInMainWorld('api', {
//   checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
//   getTodos: () => ipcRenderer.invoke('db:get-todos'),
// });
```

---

## Paso 14 — Arranque en Desarrollo

El proyecto requiere **dos procesos corriendo simultáneamente**:

```bash
# Usando el script configurado (levanta ambos con concurrently)
bun app:start

# Equivalente manual en dos terminales separadas:
# Terminal 1:
bun run dev:ui    # Vite en http://localhost:5173

# Terminal 2:
bun run dev:main  # Electron cargando la URL de Vite
```

---

## Paso 15 — Publicar en GitHub (Auto-Updater)

### Pre-requisitos
1. Crear un repositorio en GitHub con el mismo nombre del `"repo"` en `publish`.
2. Generar un **Personal Access Token (PAT)** en GitHub con permiso `repo`.
3. Exportar el token como variable de entorno:

```bash
# En Windows (Git Bash)
export GH_TOKEN="ghp_tutoken..."

# En Windows (CMD/PowerShell)
set GH_TOKEN=ghp_tutoken...
```

### Build y Publicación

```bash
# Genera el instalador y lo sube a GitHub Releases
bun app:publish
# Equivalente: electron-builder -p always
```

Este comando:
1. Compila TypeScript y empaqueta los archivos con Electron.
2. Genera el instalador para tu OS actual (`.exe` en Windows, `.dmg` en macOS).
3. Crea un **GitHub Release** automáticamente como "draft".
4. Sube el instalador y el archivo `latest.yml` (usado por `electron-updater` para detectar nuevas versiones).

### Cómo funciona el Auto-Updater

`electron-updater` compara la versión actual del `package.json` con el `latest.yml` del GitHub Release más reciente. Si hay diferencia, descarga e instala la nueva versión.

```typescript
// Implementación básica en src/app.ts
import { autoUpdater } from "electron-updater";

const checkUpdate = () => {
    autoUpdater.checkForUpdatesAndNotify();
};
```

---

## Resumen de Errores Comunes y Soluciones

| Error | Causa | Solución |
|---|---|---|
| `Cannot find module 'src/app'` | Electron no reconoce extensiones `.ts` sin el path explícito | Importar con extensión: `"./src/app.ts"` |
| `Cannot find module 'electron'` en el import | Comillas faltantes en el import | `from "electron"` en lugar de `from electron` |
| `Cannot find name 'document'` | TypeScript en modo Node.js sin tipos de DOM | Agregar `"DOM"` al `lib` en `tsconfig.json` |
| `ERR_CONNECTION_REFUSED` en Electron | Vite no estaba corriendo antes de lanzar Electron | Usar `app:start` (concurrently) para lanzar ambos |
| `base: "./"` faltante en Vite | Electron no puede resolver rutas absolutas del build | Agregar `base: "./"` en `vite.config.ts` |
| `fileURLToPath` de `"bun"` | Bun no existe en el runtime de Electron/Node | Importar de `"node:url"` siempre |
