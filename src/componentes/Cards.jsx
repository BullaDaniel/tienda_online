import { Link } from "react-router-dom"
export const Cards = ({producto}) => {

    return(
        <Link to={`/producto/${producto.id}`}>
            <div className="card">
                <img src={producto.imagen} alt={producto.nombre} />
                <h2>{producto.nombre}</h2>
                <h4>${producto.precio}</h4>
            </div>
        </Link>
    )
}