// src/pages/PageCard.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../componentes/Navbar";

const formatPrecio = (precio) =>
    Number(precio).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const Estrellas = ({ valor, onClick }) => (
    <div className="resenas-estrellas">
        {[1, 2, 3, 4, 5].map((n) => (
            <span
                key={n}
                className={n <= valor ? "estrella activa" : "estrella"}
                onClick={() => onClick && onClick(n)}
                style={{ cursor: onClick ? "pointer" : "default" }}
            >★</span>
        ))}
    </div>
);

const PageCard = () => {
    const { id } = useParams();
    const { usuario } = useAuth();

    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [tallaActiva, setTallaActiva] = useState(null);
    const [agregado, setAgregado] = useState(false);

    // Reseñas
    const [resenas, setResenas] = useState([]);
    const [formResena, setFormResena] = useState({ comentario: "", calificacion: 0 });
    const [enviando, setEnviando] = useState(false);
    const [errorResena, setErrorResena] = useState("");
    const [exitoResena, setExitoResena] = useState("");

    useEffect(() => {
        setCargando(true);
        setTallaActiva(null);
        fetch(`http://localhost:3001/api/productos/${id}`)
            .then((res) => res.json())
            .then((data) => { setProducto(data); setCargando(false); })
            .catch(() => setCargando(false));

        // Cargar reseñas
        fetch(`http://localhost:3001/api/productos/${id}/resenas`)
            .then((res) => res.json())
            .then((data) => setResenas(Array.isArray(data) ? data : []))
            .catch(() => setResenas([]));
    }, [id]);

    const handleCarrito = () => {
        setAgregado(true);
        setTimeout(() => setAgregado(false), 1800);
    };

    const handleEnviarResena = async (e) => {
        e.preventDefault();
        setErrorResena("");
        if (!formResena.calificacion) { setErrorResena("Selecciona una calificación."); return; }
        if (!formResena.comentario.trim()) { setErrorResena("Escribe un comentario."); return; }

        setEnviando(true);
        try {
            const res = await fetch(`http://localhost:3001/api/productos/${id}/resenas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${usuario.token}`,
                },
                body: JSON.stringify(formResena),
            });
            const data = await res.json();
            if (!res.ok) { setErrorResena(data.error); return; }

            // Recargar reseñas
            const nuevas = await fetch(`http://localhost:3001/api/productos/${id}/resenas`).then(r => r.json());
            setResenas(nuevas);
            setFormResena({ comentario: "", calificacion: 0 });
            setExitoResena("✅ Reseña publicada. ¡Gracias!");
            setTimeout(() => setExitoResena(""), 4000);
        } catch {
            setErrorResena("No se pudo publicar la reseña.");
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminarResena = async (resenaId) => {
        if (!window.confirm("¿Eliminar esta reseña?")) return;
        try {
            await fetch(`http://localhost:3001/api/resenas/${resenaId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${usuario.token}` },
            });
            setResenas((prev) => prev.filter((r) => r.id !== resenaId));
        } catch {
            alert("Error al eliminar la reseña.");
        }
    };

    if (cargando) return (
        <>
            <Navbar />
            <div className="page-card-error"><p>Cargando producto...</p></div>
        </>
    );

    if (!producto || producto.error) return (
        <>
            <Navbar />
            <div className="page-card-error">
                <h2>Producto no encontrado 😢</h2>
                <Link to="/" className="btn-principal">← Volver a la tienda</Link>
            </div>
        </>
    );

    const imagenPrincipal = producto.imagenes?.[0] || producto.imagen || "";
    const tallas = producto.variantes
        ? [...new Set(producto.variantes.map((v) => v.talla).filter(Boolean))]
        : [];

    const promedioCalificacion = resenas.length
        ? (resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length).toFixed(1)
        : null;

    // Verificar si el usuario ya dejó reseña
    const yaReseno = usuario && resenas.some((r) => r.autor === usuario.nombre);

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

                    {promedioCalificacion && (
                        <div className="detalle-promedio">
                            <Estrellas valor={Math.round(promedioCalificacion)} />
                            <span>{promedioCalificacion} ({resenas.length} reseña{resenas.length !== 1 ? "s" : ""})</span>
                        </div>
                    )}

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
                                    <span key={talla}
                                        className={tallaActiva === talla ? "talla-activa" : ""}
                                        onClick={() => setTallaActiva(talla)}>
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
                            <Link to={`/producto/${rel.id}`} key={rel.id} className="relacionado-card">
                                <div className="relacionado-img">
                                    <img src={rel.imagen || ""} alt={rel.nombre}
                                        onError={(e) => { e.target.style.opacity = "0.3"; }} />
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

            {/* Sección de reseñas */}
            <section className="resenas-seccion">
                <h3>⭐ Reseñas ({resenas.length})</h3>

                {/* Formulario — solo clientes logueados que no hayan reseñado */}
                {usuario && usuario.rol === "cliente" && !yaReseno && (
                    <form onSubmit={handleEnviarResena} className="resenas-form">
                        <p className="resenas-form-titulo">Deja tu reseña</p>
                        {errorResena && <div className="resenas-error">⚠️ {errorResena}</div>}
                        {exitoResena && <div className="resenas-exito">{exitoResena}</div>}
                        <Estrellas valor={formResena.calificacion} onClick={(n) => setFormResena((p) => ({ ...p, calificacion: n }))} />
                        <textarea
                            placeholder="Cuéntanos tu experiencia con este producto..."
                            value={formResena.comentario}
                            onChange={(e) => setFormResena((p) => ({ ...p, comentario: e.target.value }))}
                            rows={3}
                            disabled={enviando}
                        />
                        <button type="submit" className="btn-principal" disabled={enviando}>
                            {enviando ? "Publicando..." : "Publicar reseña"}
                        </button>
                    </form>
                )}

                {!usuario && (
                    <p className="resenas-login-aviso">
                        <Link to="/login">Inicia sesión</Link> para dejar una reseña.
                    </p>
                )}

                {/* Lista de reseñas */}
                {resenas.length === 0 ? (
                    <p className="resenas-vacio">Aún no hay reseñas. ¡Sé el primero!</p>
                ) : (
                    <div className="resenas-lista">
                        {resenas.map((r) => (
                            <div key={r.id} className="resena-card">
                                <div className="resena-header">
                                    <div className="resena-avatar">
                                        {r.autor?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <strong>{r.autor}</strong>
                                        <span className="resena-fecha">
                                            {new Date(r.creado_en).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
                                        </span>
                                    </div>
                                    {/* Botón eliminar — solo el autor o admin */}
                                    {usuario && (usuario.nombre === r.autor || usuario.rol === "admin") && (
                                        <button className="resena-eliminar" onClick={() => handleEliminarResena(r.id)}>✕</button>
                                    )}
                                </div>
                                <Estrellas valor={r.calificacion} />
                                <p className="resena-comentario">{r.comentario}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
};

export default PageCard;