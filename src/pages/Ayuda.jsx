// src/pages/Ayuda.jsx
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../componentes/Navbar";
import Footer from "../componentes/Footer";

const TALLAS = [
    { talla: "XS", pecho: "78–83",   cintura: "60–65", cadera: "85–90"   },
    { talla: "S",  pecho: "84–89",   cintura: "66–71", cadera: "91–96"   },
    { talla: "M",  pecho: "90–95",   cintura: "72–77", cadera: "97–102"  },
    { talla: "L",  pecho: "96–101",  cintura: "78–83", cadera: "103–108" },
    { talla: "XL", pecho: "102–109", cintura: "84–91", cadera: "109–116" },
];

const PASOS_MEDICION = [
    { icono: "📏", titulo: "Pecho",   desc: "Mide alrededor de la parte más ancha del pecho, manteniendo la cinta paralela al suelo." },
    { icono: "⭕", titulo: "Cintura", desc: "Mide en tu punto más estrecho, generalmente 2–3 cm por encima del ombligo." },
    { icono: "🔵", titulo: "Cadera",  desc: "Mide alrededor de la parte más ancha de tus caderas y glúteos." },
];

const CUIDADOS = [
    {
        icono: "🫧", titulo: "Lavado",
        pasos: ["Lavar a máquina en ciclo delicado, máximo 30°C","Usar detergente suave para prendas delicadas","No usar blanqueadores ni productos con cloro","Lavar las prendas de satín al revés para proteger el brillo"],
    },
    {
        icono: "💨", titulo: "Secado",
        pasos: ["Secar a la sombra, preferiblemente tendido horizontal","No usar secadora — el calor daña las fibras","No escurrir ni torcer las prendas de satín","Retirar inmediatamente de la lavadora al terminar"],
    },
    {
        icono: "👗", titulo: "Planchado",
        pasos: ["Planchar a temperatura baja (símbolo de 1 punto)","Planchar siempre del revés","Para satín, usar un paño húmedo entre la plancha y la prenda","El algodón puede plancharse directo a temperatura media"],
    },
    {
        icono: "📦", titulo: "Almacenamiento",
        pasos: ["Guardar dobladas en cajón limpio y seco","Evitar ganchos para prendas livianas de satín","Proteger del sol directo para evitar decoloración","Guardar separadas de prendas con cierres o cremalleras"],
    },
];

const FAQS = [
    {
        categoria: "Tallas y medidas",
        preguntas: [
            { q: "¿Las tallas son estándar colombianas?",      a: "Sí. Nuestras tallas siguen el estándar colombiano. Te recomendamos revisar nuestra guía de tallas con medidas en centímetros para mayor precisión." },
            { q: "Si estoy entre dos tallas, ¿cuál elijo?",    a: "Siempre recomendamos elegir la talla más grande para mayor comodidad, especialmente en pijamas y loungewear." },
            { q: "¿Tienen tallas plus o grandes?",             a: "Actualmente manejamos hasta talla XL. Estamos trabajando para incorporar tallas plus (XXL, XXXL) en nuestra próxima colección." },
        ],
    },
    {
        categoria: "Productos",
        preguntas: [
            { q: "¿Las fotos muestran el color real?",                  a: "Hacemos todo lo posible para que las fotos representen el color real. Sin embargo, puede haber pequeñas variaciones según la calibración de tu pantalla." },
            { q: "¿Con qué materiales están confeccionadas las prendas?",a: "Trabajamos principalmente con satín, algodón 100% premium y polar. Cada producto indica su material en la descripción." },
            { q: "¿Cómo sé qué colección es la más reciente?",          a: "Las prendas nuevas aparecen con la etiqueta 'Nuevo' en el catálogo. También puedes seguirnos en redes sociales para ver los lanzamientos primero." },
        ],
    },
    {
        categoria: "Cuidado de prendas",
        preguntas: [
            { q: "¿Puedo lavar mis pijamas de satín en lavadora?", a: "Sí, pero siempre en ciclo muy delicado con agua fría. Lo ideal es lavarlas a mano para preservar el brillo y la suavidad del tejido." },
            { q: "¿Por qué no debo usar secadora?",                a: "El calor de la secadora daña las fibras delicadas del satín y el algodón premium, reduciendo su vida útil y suavidad." },
            { q: "¿Cada cuánto debo lavar las prendas?",           a: "Para pijamas de uso regular, recomendamos lavar cada 2–3 usos. Para loungewear de uso diurno, según el nivel de actividad." },
        ],
    },
];

const TABS = [
    { id: "tallas",   label: "📏 Guía de tallas"       },
    { id: "cuidado",  label: "✨ Cuidado de prendas"    },
    { id: "faq",      label: "❓ Preguntas frecuentes"  },
    { id: "nosotros", label: "🌸 Sobre nosotros"        },
];

// ── Tabs ───────────────────────────────────────────────────────────────────────

const TabGuiaTallas = () => (
    <div className="ayuda-seccion">
        <div className="ayuda-intro">
            <span className="ayuda-tag">📏 Medidas en centímetros</span>
            <h2>Encuentra tu talla perfecta</h2>
            <p>Usa una cinta métrica flexible. Si estás entre dos tallas, te recomendamos elegir la más grande para mayor comodidad.</p>
        </div>
        <div className="tallas-tabla-wrapper">
            <table className="tallas-tabla">
                <thead>
                    <tr>
                        <th>Talla</th><th>Pecho (cm)</th><th>Cintura (cm)</th><th>Cadera (cm)</th>
                    </tr>
                </thead>
                <tbody>
                    {TALLAS.map((t) => (
                        <tr key={t.talla}>
                            <td><span className="talla-badge">{t.talla}</span></td>
                            <td>{t.pecho}</td><td>{t.cintura}</td><td>{t.cadera}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="ayuda-subtitulo"><h3>¿Cómo tomar tus medidas?</h3></div>
        <div className="medicion-grid">
            {PASOS_MEDICION.map((p) => (
                <div className="medicion-card" key={p.titulo}>
                    <div className="medicion-icono">{p.icono}</div>
                    <h4>{p.titulo}</h4>
                    <p>{p.desc}</p>
                </div>
            ))}
        </div>
        <div className="ayuda-tip">
            💡 <strong>Tip:</strong> Para pijamas tipo camisón o conjuntos sueltos, prioriza la medida de cadera. Para loungewear entallado, prioriza pecho y cintura.
        </div>
    </div>
);

const TabCuidado = () => (
    <div className="ayuda-seccion">
        <div className="ayuda-intro">
            <span className="ayuda-tag">✨ Mantén tu Glossé impecable</span>
            <h2>Cuidado de las prendas</h2>
            <p>Nuestras prendas están confeccionadas con materiales delicados. Con el cuidado correcto durarán mucho más.</p>
        </div>
        <div className="cuidado-grid">
            {CUIDADOS.map((c) => (
                <div className="cuidado-card" key={c.titulo}>
                    <div className="cuidado-header">
                        <span className="cuidado-icono">{c.icono}</span>
                        <h3>{c.titulo}</h3>
                    </div>
                    <ul>{c.pasos.map((paso, i) => <li key={i}>{paso}</li>)}</ul>
                </div>
            ))}
        </div>
        <div className="materiales-seccion">
            <div className="ayuda-subtitulo"><h3>Por tipo de material</h3></div>
            <div className="materiales-grid">
                {[
                    { material: "Satín",   acento: "#FF7EB3", tips: ["Lavar a mano o ciclo muy delicado","Nunca torcer ni escurrir","Planchar a mínima temperatura con paño húmedo","Guardar colgado o doblado con cuidado"] },
                    { material: "Algodón", acento: "#7EB8FF", tips: ["Admite lavado a máquina normal a 30°C","Se puede secar a temperatura baja","Planchar a temperatura media directamente","Muy resistente al uso frecuente"] },
                    { material: "Polar",   acento: "#7EDBA1", tips: ["Lavar al revés para conservar el suavizado","Agua fría o 30°C máximo","No usar suavizante (aplana las fibras)","Secar en tendedero, nunca en secadora"] },
                ].map((m) => (
                    <div className="material-card" key={m.material} style={{ borderTop: `4px solid ${m.acento}` }}>
                        <h4>{m.material}</h4>
                        <ul>{m.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const TabFAQ = () => {
    const [abierto, setAbierto] = useState(null);
    const toggle = (key) => setAbierto(abierto === key ? null : key);

    return (
        <div className="ayuda-seccion">
            <div className="ayuda-intro">
                <span className="ayuda-tag">❓ Respuestas rápidas</span>
                <h2>Preguntas frecuentes</h2>
                <p>¿No encuentras lo que buscas? Escríbenos directamente.</p>
            </div>
            {FAQS.map((cat) => (
                <div className="faq-categoria" key={cat.categoria}>
                    <h3 className="faq-cat-titulo">{cat.categoria}</h3>
                    {cat.preguntas.map((item, i) => {
                        const key = `${cat.categoria}-${i}`;
                        const isOpen = abierto === key;
                        return (
                            <div className={`faq-item ${isOpen ? "faq-item--abierto" : ""}`} key={key}>
                                <button className="faq-pregunta" onClick={() => toggle(key)}>
                                    <span>{item.q}</span>
                                    <span className="faq-icono">{isOpen ? "−" : "+"}</span>
                                </button>
                                {isOpen && <div className="faq-respuesta">{item.a}</div>}
                            </div>
                        );
                    })}
                </div>
            ))}
            <div className="faq-contacto">
                <h3>¿Todavía tienes dudas?</h3>
                <p>Escríbenos y te respondemos lo antes posible.</p>
                <div className="faq-contacto-botones">
                    <a href="https://wa.me/573148771653" className="btn-principal" target="_blank" rel="noreferrer">💬 WhatsApp</a>
                    <a href="mailto:ayuda@glosse.com" className="btn-secundario">✉️ Email</a>
                </div>
            </div>
        </div>
    );
};

const TabNosotros = () => (
    <div className="ayuda-seccion">
        <div className="ayuda-intro">
            <span className="ayuda-tag">🌸 Nuestra historia</span>
            <h2>Sobre Glossé</h2>
            <p>Somos un catálogo digital colombiano creado para mujeres que quieren sentirse cómodas, bonitas y auténticas, desde casa hasta donde quieran llegar.</p>
        </div>
        <div className="nosotros-grid">
            <div className="nosotros-card">
                <span className="nosotros-icono">💡</span>
                <h3>Nuestra idea</h3>
                <p>Glossé nació de la idea simple de que la ropa de dormir y el loungewear también merecen ser lindos. Prendas que te hagan sentir bien incluso en los momentos más cotidianos.</p>
            </div>
            <div className="nosotros-card">
                <span className="nosotros-icono">🇨🇴</span>
                <h3>Hecho en Colombia</h3>
                <p>Somos 100% colombianos. Nuestras prendas se confeccionan localmente con materiales cuidadosamente seleccionados: satín, algodón premium y polar de calidad.</p>
            </div>
            <div className="nosotros-card">
                <span className="nosotros-icono">🎀</span>
                <h3>Para todas</h3>
                <p>Diseñamos pensando en la comodidad real. Tallas XS a XL y próximamente plus, porque creemos que cada mujer merece encontrar su talla y sentirse increíble.</p>
            </div>
            <div className="nosotros-card">
                <span className="nosotros-icono">💬</span>
                <h3>Atención cercana</h3>
                <p>No somos una tienda fría. Cada pedido pasa por nosotras directamente. Escríbenos por WhatsApp y te acompañamos en todo el proceso de compra.</p>
            </div>
        </div>
        <div className="nosotros-valores">
            <div className="ayuda-subtitulo"><h3>Lo que nos define</h3></div>
            <div className="valores-lista">
                {[
                    { icono: "✨", valor: "Calidad real",    desc: "Materiales que se sienten desde el primer uso." },
                    { icono: "🌿", valor: "Honestidad",      desc: "Las fotos y descripciones representan el producto real." },
                    { icono: "💗", valor: "Cercanía",        desc: "Trato humano, sin bots ni respuestas automáticas." },
                    { icono: "🔄", valor: "Mejora continua", desc: "Escuchamos a nuestras clientas para crecer juntas." },
                ].map((v) => (
                    <div className="valor-item" key={v.valor}>
                        <span className="valor-icono">{v.icono}</span>
                        <div>
                            <strong>{v.valor}</strong>
                            <p>{v.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="nosotros-cta">
            <h3>¿Lista para conocer el catálogo?</h3>
            <p>Explora nuestras colecciones y encuentra tu próxima prenda favorita.</p>
            <Link to="/" className="btn-principal">🛍️ Ver catálogo</Link>
        </div>
    </div>
);

// ── Página ─────────────────────────────────────────────────────────────────────

const Ayuda = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabActivo = searchParams.get("tab") || "tallas";
    const cambiarTab = (id) => setSearchParams({ tab: id });

    return (
        <div>
            <Navbar />
            <div className="ayuda-hero">
                <div className="ayuda-hero-contenido">
                    <Link to="/" className="ayuda-breadcrumb">← Volver al catálogo</Link>
                    <h1>Centro de ayuda</h1>
                    <p>Todo lo que necesitas saber sobre Glossé en un solo lugar.</p>
                </div>
            </div>
            <div className="ayuda-tabs-wrapper">
                <div className="ayuda-tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`ayuda-tab ${tabActivo === tab.id ? "ayuda-tab--activo" : ""}`}
                            onClick={() => cambiarTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="ayuda-contenido">
                {tabActivo === "tallas"   && <TabGuiaTallas />}
                {tabActivo === "cuidado"  && <TabCuidado />}
                {tabActivo === "faq"      && <TabFAQ />}
                {tabActivo === "nosotros" && <TabNosotros />}
            </div>
            <Footer />
        </div>
    );
};

export default Ayuda;