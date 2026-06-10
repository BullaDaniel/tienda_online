// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductosProvider } from "./context/ProductosContext";
import { ColeccionesProvider } from "./context/ColeccionesContext";
import { PetalosProvider } from "./context/PetalosContext";
import "./styles/main.scss";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <PetalosProvider>
                    <ProductosProvider>
                        <ColeccionesProvider>
                            <App />
                        </ColeccionesProvider>
                    </ProductosProvider>
                </PetalosProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);