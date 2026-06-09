// src/componentes/Testimonios.jsx
const reseñas = [
    { inicial: "S", nombre: "Sofía Ramírez",    ciudad: "Bogotá",       estrellas: 5, texto: "Los pijamas de Glosse son literalmente los más suaves que he tenido en mi vida. El satín rosa perla es una maravilla, se siente como dormir en una nube. ¡Ya compré tres!", producto: "Set Satín Rosa Perla" },
    { inicial: "V", nombre: "Valentina Torres", ciudad: "Medellín",     estrellas: 5, texto: "Me sorprendió muchísimo la calidad. Llegó en 3 días con un empaque precioso y una nota personal. Definitivamente la mejor compra de pijamas que he hecho.", producto: "Pijama Algodón Nubes" },
    { inicial: "C", nombre: "Camila Herrera",   ciudad: "Cali",         estrellas: 5, texto: "El loungewear lila es perfecto para trabajar desde casa y sentirse linda al mismo tiempo. La tela es increíble y las tallas son súper exactas.", producto: "Conjunto Loungewear Lila" },
    { inicial: "A", nombre: "Andrea Moreno",    ciudad: "Barranquilla", estrellas: 4, texto: "Excelente calidad y diseño hermoso. Los colores son exactamente como en las fotos. El envío fue rápido y el servicio al cliente muy atento.", producto: "Camisa Noche Bordada" },
];

const Testimonios = () => (
    <section className="testimonios">
        <div className="seccion-titulo">
            <span>✦ Reseñas</span>
            <h2>
                Lo que dicen nuestras{" "}
                <em style={{ fontStyle: "italic", color: "#FF7EB3" }}>Glossé Girls</em>
            </h2>
            <p>Más de 5.000 clientas felices avalan cada puntada de nuestros diseños.</p>
        </div>
        <div className="testimonios-grid">
            {reseñas.map((r, i) => (
                <div className="testimonio-card" key={i}>
                    <div className="estrellas">
                        {"★".repeat(r.estrellas)}{"☆".repeat(5 - r.estrellas)}
                    </div>
                    <p className="testimonio-texto">"{r.texto}"</p>
                    <div className="testimonio-autor">
                        <div className="avatar">{r.inicial}</div>
                        <div className="autor-info">
                            <strong>{r.nombre}</strong>
                            <span>{r.ciudad} · {r.producto}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default Testimonios;
