// src/componentes/Colecciones.jsx
const colecciones = [
    { titulo: "Satín Premium",     subtitulo: "Para noches de película",  imagen: "/iconos/ropa_mujer.jpg", items: "24 productos" },
    { titulo: "Pijamas de Invierno", subtitulo: "Calidez con estilo",     imagen: "/iconos/Ropa1.jpg",      items: "18 productos" },
    { titulo: "Loungewear",         subtitulo: "Ropa de descanso chic",   imagen: "/iconos/Ropa2.jpg",      items: "31 productos" },
    { titulo: "Accesorios",         subtitulo: "El toque final perfecto", imagen: "/iconos/accesorios.jpg", items: "12 productos" },
];

const Colecciones = () => (
    <section className="colecciones" id="colecciones">
        <div className="seccion-titulo">
            <span>✦ Categorías</span>
            <h2>Encuentra tu estilo ideal</h2>
            <p>Colecciones cuidadosamente curadas para cada momento y ocasión.</p>
        </div>
        <div className="colecciones-grid">
            {colecciones.map((col, i) => (
                <div className="coleccion-card" key={i}>
                    <img
                        className="coleccion-img"
                        src={col.imagen}
                        alt={col.titulo}
                        onError={(e) => { e.target.style.opacity = "0.3"; }}
                    />
                    <div className="coleccion-overlay">
                        <h3>{col.titulo}</h3>
                        <span>{col.items}</span>
                        <a href="#catalogo" className="coleccion-btn">Ver colección →</a>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default Colecciones;
