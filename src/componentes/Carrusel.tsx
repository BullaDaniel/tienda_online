import { CarruselList } from "../carruselList";
import Petalo from "./Petalo";

type CarruselInterior = {
    id: number;
    imagen: string;
    frase: string;
    parrafo: string;
};


const Carrusel_Interior = ({ interior }: { interior: CarruselInterior }) => {

    return(
        <div className = "carrusel_interior">
            <li>    
                <img src={interior.imagen} alt={"frase"} />
                <div className="texto">
                <h2>{interior.frase}</h2>
                <p>{interior.parrafo}</p>
                </div>
            </li>
        </div>
    )
}

const Carrusel = () => {

    return(
        <div className ="carrusel">
            <Petalo />
            <ul>
                {CarruselList.map((item: CarruselInterior) => (
                    <Carrusel_Interior
                        key={item.id}
                        interior={item}
                    />
                ))}

            </ul>
        </div>




    )
}

export default Carrusel;    