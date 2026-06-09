import { useState } from "react";

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
                <div className="footer-marca">
                    <span className="footer-logo">Glossé</span>
                    <p>
                        Pijamas premium para mujeres que saben que el descanso
                        también merece estilo. Crafteados con amor y algodón suave.
                    </p>
                    <div className="redes">
                        <h4> Contactanos </h4> 
                        <ul>
                        <li><a href="#" title="Instagram">
                            <img src="public/iconos/Instagram.png" alt="Instagram" style={{ width: "100%", height: "100%" }}></img></a></li>
                       
                        <li><a href="#" title="TikTok">
                            <img src="public/iconos/Tiktok.png" alt="Tiktok" style={{ width: "100%", height: "100%" }}></img></a></li>

                        <li><a href="#" title="Facebook">
                             <img src="public/iconos/Facebook.png" alt="Facebook" style={{ width: "100%", height: "100%" }}></img></a></li>
                        
                        <li><a href="#" title="WhatsApp">
                            <img src="public/iconos/whatsapp.png" alt="Whatsapp" style={{ width: "100%", height: "100%" }}></img></a></li>
                        </ul>
                        
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Tienda</h4>
                    <ul>
                        <li><a href="#">Nueva Colección</a></li>
                        <li><a href="#">Hot Sale</a></li>
                        <li><a href="#">Pijamas Satín</a></li>
                        <li><a href="#">Loungewear</a></li>
                        <li><a href="#">Pijamas Invierno</a></li>
                        <li><a href="#">Accesorios</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Ayuda</h4>
                    <ul>
                        <li><a href="/ayuda">Guía de tallas</a></li>
                        <li><a href="mailto:soporte@glosse.com">Reportar problemas</a></li>
                        <li><a href="/ayuda">Uso del sitio</a></li>
                        <li><a href="/ayuda">Cuidado de las prendas</a></li>
                        <li><a href="/ayuda">Preguntas frecuentes</a></li>

                    </ul>
                </div>

                <div className="footer-newsletter">
                    <h4>Dudas o sugerencias</h4>
                    <p>
                        ¿Tienes alguna pregunta o sugerencia? ¡Estamos aquí para ayudarte!
                    </p>
                    <div className="newsletter-form">
                        <button onClick={() => window.open(
                            "mailto:info@glosse.com ? subject=Duda o sugerencia",
                        )}>
                            Enviar mensaje 📧 
                        </button>
                    </div>
                    
                  
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 Glossé. Todos los derechos reservados. Hecho con 🌸 en Colombia.</p>
              
            </div>
        </footer>
    );
};

export default Footer;
