// src/componentes/Testimonios.jsx
const reseñas = [
    { inicial: "A", nombre: "Anónimo",    ciudad: "Colombia",       estrellas: 5, texto: "Recomendadas 100%, en calidad, atención y servicio. tienen gran carisma para atender y valores agregados que agradezco mucho." },
    { inicial: "A", nombre: "Anónimo", ciudad: "Colombia",     estrellas: 5, texto: "Me sorprendió muchísimo la calidad. Llegó en 3 días con un empaque precioso y una nota personal. Definitivamente la mejor compra de pijamas que he hecho." },
    { inicial: "A", nombre: "Anónimo",   ciudad: "Colombia",         estrellas: 5, texto: "El loungewear lila es perfecto para trabajar desde casa y sentirse linda al mismo tiempo. La tela es increíble y las tallas son súper exactas." },
    { inicial: "A", nombre: "Anónimo",    ciudad: "Colombia", estrellas: 4, texto: "Excelente calidad y diseño hermoso. Los colores son exactamente como en las fotos. El envío fue rápido y el servicio al cliente muy atento." },
];

const Testimonios = () => (
    <section className="testimonios">
        <div className="seccion-titulo">
            <span>✦ Reseñas</span>
            <h2>
                Lo que dicen nuestros{" "}
                <em style={{ fontStyle: "italic", color: "#FF7EB3" }}>Glossé users</em>
            </h2>
            <p className="seccion-descripcion"> 
                Compartimos opiniones reales de nuestros clientes sobre la comodidad y estilo de nuestros pijamas premium. ¡Gracias por ser parte de Glossé!
            </p>
        </div>
        <div className="testimonios-grid">
            {reseñas.map((r, i) => (
                <div className="testimonio-card" key={i}>
                    <p className="testimonio-texto">"{r.texto}"</p>
                    <div className="testimonio-autor">
                        <div className="avatar">{r.inicial}</div>
                        <div className="autor-info">
                            <strong>{r.nombre}</strong>
                            <span>{r.ciudad}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default Testimonios;
