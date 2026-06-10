import { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [suscrito, setSuscrito] = useState(false);

    const handleSuscripcion = () => {
        if (email.trim()) {
            setSuscrito(true);
            setEmail("");
        }
    };

    return (
        <footer className="footer">
            <div className="footer-grid">

                {/* ── Marca ── */}
                <div className="footer-marca">
                    <span className="footer-logo">Glossé</span>
                    <p>
                        Pijamas premium para todos y todas que saben que el descanso
                        también merece estilo. Hechos con amor y algodón suave.
                    </p>
                    <div className="redes">
                        <h4>Contáctanos</h4>
                        <ul>
                            <li>
                                <a href="https://www.instagram.com/glossee.e" title="Instagram" target="_blank" rel="noreferrer">
                                    <img src="/iconos/Instagram.png" alt="Instagram" style={{ width: "100%", height: "100%" }} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.tiktok.com/@glosse.pijamas" title="TikTok" target="_blank" rel="noreferrer">
                                    <img src="/iconos/Tiktok.png" alt="TikTok" style={{ width: "100%", height: "100%" }} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/Glossé" title="Facebook" target="_blank" rel="noreferrer">
                                    <img src="/iconos/Facebook.png" alt="Facebook" style={{ width: "100%", height: "100%" }} />
                                </a>
                            </li>
                            <li>
                                <a href="https://wa.me/573148771653" title="WhatsApp" target="_blank" rel="noreferrer">
                                    <img src="/iconos/whatsapp.png" alt="WhatsApp" style={{ width: "100%", height: "100%" }} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ── Catálogo ── */}
                <div className="footer-col">
                    <h4>Catálogo</h4>
                    <ul>
                        <li><Link to="/colecciones">Nueva Colección</Link></li>
                        <li><Link to="/colecciones">Hot Sale</Link></li>

                        <li className="footer-divider" />

                        <li><Link to="/colecciones">Pijamas Satín</Link></li>
                        <li><Link to="/colecciones">Loungewear</Link></li>
                        <li><Link to="/colecciones">Pijamas Invierno</Link></li>

                        <li className="footer-divider" />

                        <li><Link to="/colecciones">Accesorios</Link></li>
                    </ul>
                </div>

                {/* ── Ayuda ── */}
                <div className="footer-col">
                    <h4>Ayuda</h4>
                    <ul>
                        <li><Link to="/ayuda?tab=tallas">📏 Guía de tallas</Link></li>
                        <li><Link to="/ayuda?tab=cuidado">✨ Cuidado de las prendas</Link></li>

                        <li className="footer-divider" />

                        <li><Link to="/ayuda?tab=faq">❓ Preguntas frecuentes</Link></li>
                        <li><Link to="/ayuda?tab=nosotros">🌸 Sobre nosotros</Link></li>

                        <li className="footer-divider" />

                        <li>
                            <a href="mailto:soporte@glosse.com">
                                📧 Reportar un problema
                            </a>
                        </li>
                    </ul>
                </div>

                {/* ── Contacto ── */}
                <div className="footer-newsletter">
                    <h4>¿Dudas o sugerencias?</h4>
                    <p>
                        ¿Tienes alguna pregunta o sugerencia? ¡Estamos aquí para ayudarte!
                    </p>
                    <div className="newsletter-form">
                        <button
                            onClick={() =>
                                window.open("mailto:info@glosse.com?subject=Duda o sugerencia")
                            }
                        >
                            Enviar mensaje 📧
                        </button>
                    </div>
                </div>

            </div>

            {/* ── Bottom ── */}
            <div className="footer-bottom">
                <p>© 2025 Glossé. Todos los derechos reservados. Hecho con 🌸 en Colombia.</p>
            </div>
        </footer>
    );
};

export default Footer;