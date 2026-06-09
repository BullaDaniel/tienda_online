// src/componentes/Carrusel.jsx
import { CarruselList } from "../data/carruselList";
import Petalo from "./Petalo";

const CarruselInterior = ({ interior }) => (
    <div className="carrusel_interior">
        <li>
            <img src={interior.imagen} alt={interior.frase} />
            <div className="texto">
                <span className="texto-badge">✦ Nueva Colección</span>
                <h2>{interior.frase}</h2>
                <p>{interior.parrafo}</p>
                <a href="#catalogo" className="cta-btn">
                    {interior.cta} →
                </a>
            </div>
        </li>
    </div>
);

const Carrusel = ({ petalosActivos }) => (
    <div className="carrusel">
        {petalosActivos && <Petalo />}  
        <ul>
            {CarruselList.map((item) => (
                <CarruselInterior key={item.id} interior={item} />
            ))}
        </ul>
    </div>
);

export default Carrusel;
