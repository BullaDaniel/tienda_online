
type productos = {
    id:number,
    nombre:string,
    precio:number,
    imagen:string
}


export const Cards = ({producto}:{producto: productos}) => {

    return(
        <div className="card">
        <img src = {producto.imagen} alt ={producto.nombre}/>
        <h2>{producto.nombre}</h2>
        <h4>${producto.precio}</h4>
        </div>
    )


}