// src/main.jsx
// ─────────────────────────────────────────────
// Entry point. Monta BrowserRouter, AuthProvider
// y ProductosProvider en orden correcto.
// ─────────────────────────────────────────────
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductosProvider } from "./context/ProductosContext";
import { ColeccionesProvider } from "./context/ColeccionesContext";
import "./styles/main.scss";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ProductosProvider>
                    <ColeccionesProvider>
                        <App />
                    </ColeccionesProvider>
                </ProductosProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
