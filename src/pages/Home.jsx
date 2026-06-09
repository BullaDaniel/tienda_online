
import { useState } from "react";  
import Navbar      from "../componentes/Navbar";
import Hero        from "../componentes/Hero";
import ValueProps  from "../componentes/ValueProps";
import Carrusel    from "../componentes/Carrusel";
import Colecciones from "../componentes/Colecciones";
import Catalogo    from "../componentes/Catalogo";
import Testimonios from "../componentes/Testimonios";
import Footer      from "../componentes/Footer";

const Home = () => {
    const [petalosActivos, setPetalosActivos] = useState(true);  // 👈 agregar

    return (
        <div>
            <Navbar petalosActivos={petalosActivos} setPetalosActivos={setPetalosActivos} />  {/* 👈 */}
            <Hero />
            <ValueProps />
            <Carrusel petalosActivos={petalosActivos} />  
            <Colecciones />
            <Catalogo />
            <Testimonios />
            <Footer />
        </div>
    );
};

export default Home;
