// src/context/ProductosContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ProductosContext = createContext(null);

export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorProductos, setErrorProductos] = useState(null);

    // Cargar productos desde el backend al montar
    useEffect(() => {
        fetch("https://tiendaonline-production-ca3b.up.railway.app/api/productos")
            .then((res) => res.json())
            .then((data) => {
                setProductos(data);
                setCargando(false);
            })
            .catch(() => {
                setErrorProductos("No se pudieron cargar los productos.");
                setCargando(false);
            });
    }, []);

    const agregarProducto = (nuevoProducto) => {
        return fetch("https://tiendaonline-production-ca3b.up.railway.app/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto),
        })
            .then((res) => res.json())
            .then((data) => {
                setProductos((prev) => [data, ...prev]);
                return data;
            });
    };

    const editarProducto = (id, datosActualizados) => {
        return fetch(`https://tiendaonline-production-ca3b.up.railway.app/api/productos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosActualizados),
        })
            .then((res) => res.json())
            .then(() => {
                setProductos((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, ...datosActualizados } : p))
                );
            });
    };

    const eliminarProducto = (id) => {
        return fetch(`https://tiendaonline-production-ca3b.up.railway.app/api/productos/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then(() => {
                setProductos((prev) => prev.filter((p) => p.id !== id));
            });
    };

    return (
        <ProductosContext.Provider value={{
            productos,
            cargando,
            errorProductos,
            agregarProducto,
            editarProducto,
            eliminarProducto,
        }}>
            {children}
        </ProductosContext.Provider>
    );
};

export const useProductos = () => useContext(ProductosContext);