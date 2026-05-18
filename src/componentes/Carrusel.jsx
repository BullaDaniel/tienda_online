import { CarruselList } from "../carruselList";
import Petalo from "./Petalo";


const Carrusel_Interior = ({ interior }) => {

    return(

        <li className="carrusel_interior">
            <img
              src={interior.imagen}
              alt="frase"
            />
            <div className="texto">

                <h2>{interior.frase}</h2>

                <p>{interior.parrafo}</p>

            </div>

        </li>

    )

}
const Carrusel = () => {

    return(
        <div className ="carrusel">
            <Petalo />
            <ul>
                {CarruselList.map((item) => (
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