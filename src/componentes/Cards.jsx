
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const etiquetaClase = (etiqueta) => {
    const map = { Nuevo: "nuevo", "Hot Sale": "hot-sale", Descuento: "descuento" };
    return map[etiqueta] || "nuevo";
    const navigate = useNavigate();
};

export const Cards = ({ producto }) => {
    const [tallaActiva, setTallaActiva] = useState(null);
const navigate = useNavigate();
const [agregado, setAgregado] = useState(false);

const handleCarrito = () => {
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1800);
};
    return (
        <Link to={`/producto/${producto.id}`} className="card-link">
            <div className="card">
                {producto.etiqueta && (
                    <span className={`card-etiqueta ${etiquetaClase(producto.etiqueta)}`}>
                        {producto.etiqueta}
                    </span>
                )}

                <div className="card-img">
                    <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                </div>

               <div className="card-acciones">
                    <button className="btn-carrito" onClick={handleCarrito}>
                       Observar producto
                    </button>
                </div>

                <div className="card-info">
                     <h2>{producto.nombre}</h2>
                     <p className="card-descripcion">{producto.descripcion}</p>

                    <div className="card-tallas">
                        {(producto.tallas || []).map((talla) => (
                            <span
                                key={talla}
                                className={tallaActiva === talla ? "talla-activa" : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setTallaActiva(talla);
                                }}
                            >
                                {talla}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};
