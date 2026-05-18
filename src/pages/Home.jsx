// @ts-ignore: allow importing untyped .jsx module
import Navbar from "../componentes/Navbar.jsx";
import Catalogo from "../componentes/Catalogo.js";
import Carrusel from "../componentes/Carrusel.js";
const home = () => {
    return (
        <div>
            <Navbar/>
            
                <Carrusel />
            
            <Catalogo />
        </div>
    );
}
export default home;