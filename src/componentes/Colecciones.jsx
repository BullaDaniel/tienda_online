// src/componentes/Colecciones.jsx
// Carga las colecciones desde el backend y las muestra
// con el mismo diseño de grid original.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
 
const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
 
const Colecciones = () => {
    const [colecciones, setColecciones] = useState([]);
    const [cargando, setCargando]       = useState(true);
 
    useEffect(() => {
        fetch(`${API}/api/colecciones`)
            .then((r) => r.json())
            .then((data) => { setColecciones(data); setCargando(false); })
            .catch(() => setCargando(false));
    }, []);
 
    // Mientras carga o si no hay colecciones, no muestra la sección
    if (cargando || colecciones.length === 0) return null;
 
    return (
        <section className="colecciones" id="colecciones">
            <div className="seccion-titulo">
                <span>✦ Categorías</span>
                <h2>Encuentra tu estilo ideal</h2>
                <p>Colecciones cuidadosamente curadas para cada momento y ocasión.</p>
            </div>
            <div className="colecciones-grid">
                {colecciones.map((col) => (
                    <Link
                        to={`/colecciones/${col.slug}`}
                        className="coleccion-card"
                        key={col.id}
                    >
                        <img
                            className="coleccion-img"
                            src={col.imagen_portada}
                            alt={col.titulo}
                            onError={(e) => { e.target.style.opacity = "0.3"; }}
                        />
                        <div className="coleccion-overlay">
                            <h3>{col.titulo}</h3>
                            <span>
                                {col.total_cards > 0
                                    ? `${col.total_cards} ${col.total_cards === 1 ? "pieza" : "piezas"}`
                                    : col.descripcion || ""}
                            </span>
                            <div className="coleccion-btn">Ver colección →</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
 
export default Colecciones;