// src/componentes/ValueProps.jsx
const valores = [
    { icono: "🌸", titulo: "Comunidad Glossé",   subtitulo: "Un espacio pensado para ti" },
    { icono: "💭", titulo: "Algodón 100% Premium",    subtitulo: "Suavidad garantizada" },
    { icono: "💌", titulo: "Atención personalizada",        subtitulo: "Resolvemos tus dudas por correo" },
    { icono: "✨", titulo: "Inspiración diaria",  subtitulo: "Contenido sobre estilo y comodidad" },
    { icono: "💎", titulo: "Calidad Premium",         subtitulo: "Garantía de satisfacción" },
];

const ValueProps = () => (
    <div className="value-props">
        {valores.map((v, i) => (
            <div className="value-item" key={i}>
                <span className="value-icono">{v.icono}</span>
                <div className="value-texto">
                    <strong>{v.titulo}</strong>
                    <span>{v.subtitulo}</span>
                </div>
            </div>
        ))}
    </div>
);

export default ValueProps;
