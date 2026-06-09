// src/context/ProductosContext.jsx
// ─────────────────────────────────────────────
// Contexto global de productos.
// Permite que el Admin agregue productos y que
// el Catálogo los refleje en tiempo real.
// ─────────────────────────────────────────────
import { createContext, useContext, useState } from "react";
import { productosIniciales } from "../data/productos";

const ProductosContext = createContext(null);

export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState(productosIniciales);

    // Simula envío a base de datos y actualiza el estado local
    const agregarProducto = (nuevoProducto) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const productoConId = {
                    ...nuevoProducto,
                    id: Date.now(), // ID único temporal
                    precio: Number(nuevoProducto.precio),
                    precioOriginal: nuevoProducto.precioOriginal
                        ? Number(nuevoProducto.precioOriginal)
                        : null,
                    tallas: nuevoProducto.tallas
                        .split(",")
                        .map((t) => t.trim().toUpperCase())
                        .filter(Boolean),
                };
                setProductos((prev) => [productoConId, ...prev]);
                resolve(productoConId);
            }, 800); // simula latencia de red
        });
    };

    return (
        <ProductosContext.Provider value={{ productos, agregarProducto }}>
            {children}
        </ProductosContext.Provider>
    );
};

export const useProductos = () => useContext(ProductosContext);
