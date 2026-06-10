// src/componentes/Hero.jsx
const Hero = () => (
    <section className="hero">
        <div className="hero-contenido">
            <div className="hero-badge">✦ Nueva Temporada 2025</div>
            <h1>
                El descanso que mereces,<br />
                con el <em>estilo</em> que amas
            </h1>
            <p>
                Pijamas premium crafteados para ti. Algodón 100% suave,
                diseños que enamoran y una comodidad que se siente desde
                el primer uso.
            </p>
            <div className="hero-acciones">
                <a href="#catalogo" className="btn-principal">
                    <span>Ver Nueva Colección →</span>
                </a>
                <a href="#colecciones" className="btn-secundario">Explorar</a>
            </div>
            <div className="hero-stats">
                <div className="stat"><strong>+500</strong><span>Clientes felices</span></div>
                <div className="stat"><strong>100%</strong><span>Algodón premium</span></div>
                <div className="stat"><strong>+40</strong><span>diseños únicos</span></div>
            </div>
        </div>
        <div className="hero-imagen">
            <div className="decoracion-circulo">🌸</div>
            <div className="hero-img-wrapper">
                <img
                    src="/imagenes/principal.png"
                    alt="Pijamas Glosse"
                    onError={(e) => {
                        e.target.parentElement.style.background =
                            "linear-gradient(135deg, #FFE3EC, #E8DEF8)";
                        e.target.style.display = "none";
                    }}
                />
            </div>
        </div>
    </section>
);

export default Hero;
