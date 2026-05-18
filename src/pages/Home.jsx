// @ts-ignore: allow importing untyped .jsx module
import Navbar from "../componentes/Navbar";
import Catalogo from "../componentes/Catalogo";
import Carrusel from "../componentes/Carrusel";
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