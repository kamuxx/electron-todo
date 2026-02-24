import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "../index.css";

const el: Element | null = document.getElementById('app');

if(!el){
    throw new Error("No se encontro el elemento app");
}

ReactDOM.createRoot(el)
    .render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
