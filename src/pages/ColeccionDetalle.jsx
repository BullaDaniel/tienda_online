// src/pages/ColeccionDetalle.jsx
// ─────────────────────────────────────────────
// Vista pública dinámica: /colecciones/:slug
// Lee el slug de la URL, encuentra la colección
// y despliega su grid de cards.
// ─────────────────────────────────────────────
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useColecciones } from "../context/ColeccionesContext";
import Navbar from "../componentes/Navbar";
import Footer from "../componentes/Footer";

// Card individual dentro de la colección
const ColCard = ({ card }) => (
    <div className="coldetalle-card">
        <div className="coldetalle-card-img">
            <img
                src={card.imagen}
                alt={card.titulo}
                onError={(e) => { e.target.style.opacity = 0.2; }}
            />
            {card.etiqueta && (
                <span className="coldetalle-card-etiqueta">{card.etiqueta}</span>
            )}
        </div>
        <div className="coldetalle-card-info">
            <h3>{card.titulo}</h3>
            {card.descripcion_corta && <p>{card.descripcion_corta}</p>}

            {/* Campos personalizados opcionales */}
            <div className="coldetalle-card-meta">
                {card.precio && (
                    <span className="meta-precio">
                        {Number(card.precio).toLocaleString("es-CO", {
                            style: "currency", currency: "COP", maximumFractionDigits: 0,
                        })}
                    </span>
                )}
                {card.fecha && (
                    <span className="meta-fecha">
                        {new Date(card.fecha).toLocaleDateString("es-CO", { year: "numeric", month: "long" })}
                    </span>
                )}
                {card.tags && (
                    <div className="meta-tags">
                        {card.tags.split(",").map((t) => (
                            <span key={t.trim()} className="meta-tag">{t.trim()}</span>
                        ))}
                    </div>
                )}
            </div>

            {card.enlace && (
                <a href={card.enlace} className="coldetalle-card-link" target="_blank" rel="noreferrer">
                    Ver más →
                </a>
            )}
        </div>
    </div>
);

const ColeccionDetalle = () => {
    const { slug } = useParams();
    const { colecciones, cargando, cargarCards } = useColecciones();

    const coleccion = colecciones.find((c) => c.slug === slug);

    // Cargar cards si aún no están en el estado
    useEffect(() => {
        if (coleccion && !coleccion.cards) {
            cargarCards(coleccion.id);
        }
    }, [coleccion?.id]);

    if (cargando) {
        return (
            <div>
                <Navbar />
                <div className="coldetalle-estado">
                    <div className="colindex-spinner" />
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    if (!coleccion) {
        return (
            <div>
                <Navbar />
                <div className="coldetalle-estado">
                    <h2>Colección no encontrada 😢</h2>
                    <Link to="/colecciones" className="btn-principal">← Ver todas las colecciones</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            {/* Banner de la colección */}
            <div className="coldetalle-banner" style={{
                backgroundImage: `url(${coleccion.imagen_portada})`,
            }}>
                <div className="coldetalle-banner-overlay">
                    <Link to="/colecciones" className="coldetalle-volver">← Todas las colecciones</Link>
                    <h1>{coleccion.titulo}</h1>
                    {coleccion.descripcion && <p>{coleccion.descripcion}</p>}
                    <span className="coldetalle-count">
                        {coleccion.cards?.length ?? 0} piezas en esta colección
                    </span>
                </div>
            </div>

            {/* Grid de cards */}
            <div className="coldetalle-contenido">
                {!coleccion.cards ? (
                    <div className="coldetalle-estado">
                        <div className="colindex-spinner" />
                        <p>Cargando piezas...</p>
                    </div>
                ) : coleccion.cards.length === 0 ? (
                    <div className="coldetalle-estado">
                        <p>Esta colección aún no tiene piezas publicadas. 🌸</p>
                    </div>
                ) : (
                    <div className="coldetalle-grid">
                        {coleccion.cards.map((card) => (
                            <ColCard key={card.id} card={card} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ColeccionDetalle;
