import { productos } from "../productos";
import { Cards } from "./Cards";

const Catalogo = () => {
    return (
        <div className="catalogo">
            {productos.map((producto) => (
                <Cards key={producto.id} producto={producto} />
            ))}
        </div>
    );
}
export default Catalogo;