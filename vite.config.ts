import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react"
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