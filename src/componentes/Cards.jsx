
export const Cards = ({producto}) => {

    return(
        <div className="card">
        <img src = {producto.imagen} alt ={producto.nombre}/>
        <h2>{producto.nombre}</h2>
        <h4>${producto.precio}</h4>
        </div>
    )
}