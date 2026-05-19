import {productos} from "../productos";
import { useParams } from "react-router-dom";
import Navbar from "../componentes/Navbar";


const Page_Card = () => {
    
    const { id } = useParams();
    const producto = productos.find(item => item.id == id);
    
    return (
        <>
        <Navbar />
        <div className="organizar_info">
        
            <section className="imagen_tienda">
            <img src={producto?.imagen} alt={producto?.nombre} />
            </section> 

            <h1>{producto?.nombre}</h1>
            <p>{producto?.descripcion}</p>
            <p>Precio: ${producto?.precio}</p>
        </div>

        </>
    );
}

export default Page_Card;