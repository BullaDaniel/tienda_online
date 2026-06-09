// src/componentes/Catalogo.jsx
// ─────────────────────────────────────────────
// Lee productos del contexto global → muestra
// en tiempo real los productos que Admin suba.
// ─────────────────────────────────────────────
import { useProductos } from "../context/ProductosContext";
import { Cards } from "./Cards";

const Catalogo = () => {
    const { productos } = useProductos();

    return (
        <section className="catalogo-seccion" id="catalogo">
            <div className="seccion-titulo">
                <span>✦ Nuestra Colección</span>
                <h2>
                    Pijamas que{" "}
                    <em style={{ fontStyle: "italic", color: "#FF7EB3" }}>enamoran</em>
                </h2>
                <p>Cada pieza diseñada para que tu descanso sea tan especial como tú.</p>
            </div>

            <div className="catalogo">
                {productos.map((producto) => (
                    <Cards key={producto.id} producto={producto} />
                ))}
            </div>

            <div className="catalogo-footer">
                <a href="#" className="btn-secundario">
                    <span>Ver toda la colección</span> →
                </a>
            </div>
        </section>
    );
};

export default Catalogo;
