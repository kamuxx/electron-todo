# gemini.md — Contexto del Proyecto: electron-todo

## 🧠 Descripción General
Aplicación de escritorio **ToDo** construida con **Electron**, **React**, **TypeScript** y **Tailwind CSS**.
El objetivo es aprender el flujo completo de una app de escritorio: proceso principal, proceso renderer y comunicación entre ambos.

---

## 🛠️ Stack Tecnológico

| Capa            | Tecnología                  | Versión / Nota              |
|-----------------|-----------------------------|-----------------------------|
| Runtime Desktop | Electron                    | v26+ (via `electron-builder`) |
| Runtime JS      | Bun                         | Gestor de paquetes y runtime |
| UI Framework    | React                       | Por instalar                |
| Lenguaje        | TypeScript                  | `^5` (strict mode activado) |
| Estilos         | Tailwind CSS                | Por instalar                |
| Bundler/Tooling | Vite (recomendado con Electron) | Por definir              |
| Empaquetado     | electron-builder `^26.8.1`  | Configurado en `package.json` |

---

## 🏛️ Arquitectura

Sigue el patrón estándar de Electron con **dos procesos separados**:

```
electron-todo/
├── main.ts           # 🔵 Proceso Principal (Main Process) — Node.js + Electron APIs
├── preload.ts        # 🟡 Bridge seguro entre Main y Renderer (contextBridge)
├── pages/            # 🟢 Proceso Renderer — React + TypeScript + Tailwind
│   └── (componentes React aquí)
├── tsconfig.json     # TypeScript en strict mode
├── package.json      # Configurado para Bun, electron-builder
└── gemini.md         # Este archivo — contexto del proyecto
```

### Roles de cada proceso
- **Main Process (`main.ts`):** Controla la ventana (`BrowserWindow`), accede al sistema de archivos, gestiona el ciclo de vida de la app.
- **Preload (`preload.ts`):** Expone APIs seguras al Renderer usando `contextBridge.exposeInMainWorld`. Es la única "puerta de comunicación" entre los dos mundos.
- **Renderer Process (`pages/`):** La UI en React. No tiene acceso directo a Node.js; usa el Preload para comunicarse.

---

## 📋 Dominio de Negocio: ToDo App

### Entidades principales
```typescript
// Tarea (Todo Item)
interface Todo {
  id: string;          // UUID
  title: string;       // Texto de la tarea
  completed: boolean;  // Estado
  createdAt: Date;
}
```

### Casos de uso esperados
1. **Crear** una nueva tarea
2. **Listar** todas las tareas
3. **Marcar** tarea como completada / pendiente
4. **Eliminar** una tarea
5. **Persistencia** local (archivo JSON o `localStorage`)

---

## ⚙️ Configuración TypeScript

El `tsconfig.json` tiene **strict mode completo** activado:
- `strict: true` — null checks, tipos implícitos prohibidos
- `noUncheckedIndexedAccess: true` — arrays/objetos siempre verificados
- `jsx: "react-jsx"` — soporte JSX sin importar React manualmente
- `moduleResolution: "bundler"` — compatible con Vite/Bun

---

## 📦 Scripts disponibles (package.json)

| Script          | Comando                      | Propósito                        |
|-----------------|------------------------------|----------------------------------|
| `app:dir`       | `electron-builder --dir`     | Build sin empaquetar (dev check) |
| `app:dist`      | `electron-builder`           | Genera instalador final          |
| `app:publish`   | `electron-builder -p always` | Publica en GitHub Releases       |

> ⚠️ Faltan scripts de **desarrollo** (`dev`) y **build del renderer** (Vite). Se deben agregar.

---

## 🚦 Estado actual del proyecto

- [x] Scaffold inicial con Bun
- [x] `electron-builder` configurado
- [x] TypeScript configurado en strict mode
- [ ] Electron no instalado como dependencia explícita
- [ ] React + ReactDOM no instalados
- [ ] Tailwind CSS no instalado ni configurado
- [ ] Vite no configurado (bundler del renderer)
- [ ] `main.ts` sin lógica de Electron (solo un `console.log`)
- [ ] `preload.ts` vacío
- [ ] No hay componentes React creados

---

## 🔑 Convenciones del Proyecto

- **Idioma del código:** Inglés (variables, funciones, componentes)
- **Comentarios:** Español técnico
- **Componentes:** PascalCase (`TodoItem.tsx`, `TodoList.tsx`)
- **Funciones/hooks:** camelCase (`useTodos`, `handleDelete`)
- **No nesting > 2 niveles** — extraer a componente/función auxiliar
- **No funciones > 40 líneas**
- **Sin `any` — TypeScript strict siempre**

---

## 🔗 Repositorio
`https://github.com/kamuxx/electron-todo`
