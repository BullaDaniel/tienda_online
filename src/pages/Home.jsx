import Navbar      from "../componentes/Navbar";
import Hero        from "../componentes/Hero";
import ValueProps  from "../componentes/ValueProps";
import Carrusel    from "../componentes/Carrusel";
import Colecciones from "../componentes/Colecciones";
import Catalogo    from "../componentes/Catalogo";
import Testimonios from "../componentes/Testimonios";
import Footer      from "../componentes/Footer";

const Home = () => (
    <div>
        <Navbar />
        <Hero />
        <ValueProps />
        <Carrusel />
        <Colecciones />
        <Catalogo />
        <Testimonios />
        <Footer />
    </div>
);

export default Home;