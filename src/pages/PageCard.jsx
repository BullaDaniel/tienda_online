// src/pages/PageCard.jsx
// ─────────────────────────────────────────────
// Página de detalle de producto (del Código B).
// Mejorada con: tallas, descripción, carrito,
// precio formateado y manejo de producto 404.
// ─────────────────────────────────────────────
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductos } from "../context/ProductosContext";
import Navbar from "../componentes/Navbar";

const formatPrecio = (precio) =>
    precio.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const PageCard = () => {
    const { id } = useParams();
    const { productos } = useProductos();
    const producto = productos.find((item) => item.id == id);
    const [tallaActiva, setTallaActiva] = useState(null);
    const [agregado, setAgregado] = useState(false);

    const handleCarrito = () => {
        setAgregado(true);
        setTimeout(() => setAgregado(false), 1800);
    };

    if (!producto) {
        return (
            <>
                <Navbar />
                <div className="page-card-error">
                    <h2>Producto no encontrado 😢</h2>
                    <Link to="/" className="btn-principal">← Volver a la tienda</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="organizar_info">
                <section className="imagen_tienda">
                    <img src={producto.imagen} alt={producto.nombre} />
                </section>

                <div className="detalle-info">
                    {producto.etiqueta && (
                        <span className={`card-etiqueta ${producto.etiqueta === "Hot Sale" ? "hot-sale" : producto.etiqueta === "Descuento" ? "descuento" : "nuevo"}`}>
                            {producto.etiqueta}
                        </span>
                    )}
                    <h1>{producto.nombre}</h1>
                    <p className="detalle-descripcion">{producto.descripcion}</p>

                    <div className="detalle-precios">
                        {producto.precioOriginal && (
                            <span className="precio-original">{formatPrecio(producto.precioOriginal)}</span>
                        )}
                        <span className="precio-actual">{formatPrecio(producto.precio)}</span>
                    </div>

                    {producto.tallas?.length > 0 && (
                        <div className="detalle-tallas">
                            <p>Selecciona tu talla:</p>
                            <div className="card-tallas">
                                {producto.tallas.map((talla) => (
                                    <span
                                        key={talla}
                                        className={tallaActiva === talla ? "talla-activa" : ""}
                                        onClick={() => setTallaActiva(talla)}
                                    >
                                        {talla}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="btn-principal detalle-btn" onClick={handleCarrito}>
                        {agregado ? "✓ ¡Añadido al carrito!" : "🛒 Añadir al carrito"}
                    </button>

                    <Link to="/" className="detalle-volver">← Seguir comprando</Link>
                </div>
            </div>
        </>
    );
};

export default PageCard;
