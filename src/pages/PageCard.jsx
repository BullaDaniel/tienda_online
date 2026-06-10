// src/pages/PageCard.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../componentes/Navbar";

const formatPrecio = (precio) =>
    Number(precio).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const PageCard = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [tallaActiva, setTallaActiva] = useState(null);
    const [agregado, setAgregado] = useState(false);

    useEffect(() => {
        setCargando(true);
        setTallaActiva(null);
        fetch(`http://localhost:3001/api/productos/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProducto(data);
                setCargando(false);
            })
            .catch(() => setCargando(false));
    }, [id]);

    const handleCarrito = () => {
        setAgregado(true);
        setTimeout(() => setAgregado(false), 1800);
    };

    if (cargando) {
        return (
            <>
                <Navbar />
                <div className="page-card-error">
                    <p>Cargando producto...</p>
                </div>
            </>
        );
    }

    if (!producto || producto.error) {
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

    const imagenPrincipal = producto.imagenes?.[0] || producto.imagen || "";
    const tallas = producto.variantes
        ? [...new Set(producto.variantes.map((v) => v.talla).filter(Boolean))]
        : [];

    return (
        <>
            <Navbar />

            {/* Detalle principal */}
            <div className="organizar_info">
                <section className="imagen_tienda">
                    <img src={imagenPrincipal} alt={producto.nombre} />
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

                    {tallas.length > 0 && (
                        <div className="detalle-tallas">
                            <p>Selecciona tu talla:</p>
                            <div className="card-tallas">
                                {tallas.map((talla) => (
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

            {/* Productos relacionados */}
            {producto.relacionados?.length > 0 && (
                <section className="relacionados-seccion">
                    <h3>✨ Completa tu conjunto</h3>
                    <div className="relacionados-grid">
                        {producto.relacionados.map((rel) => (
                            <Link
                                to={`/producto/${rel.id}`}
                                key={rel.id}
                                className="relacionado-card"
                            >
                                <div className="relacionado-img">
                                    <img
                                        src={rel.imagen || ""}
                                        alt={rel.nombre}
                                        onError={(e) => { e.target.style.opacity = "0.3"; }}
                                    />
                                </div>
                                <div className="relacionado-info">
                                    <strong>{rel.nombre}</strong>
                                    <span>{formatPrecio(rel.precio)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
};

export default PageCard;