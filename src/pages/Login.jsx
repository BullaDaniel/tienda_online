// src/pages/Login.jsx
// ─────────────────────────────────────────────
// Página de Login. Credenciales mock:
//   admin@glosse.com / glosse123  → Admin
//   user@glosse.com  / user123    → Usuario
// ─────────────────────────────────────────────
import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { usuario, login, error, setError } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [cargando, setCargando] = useState(false);
    const [mostrarPass, setMostrarPass] = useState(false);

    // Si ya está autenticado, redirige
    if (usuario) return <Navigate to={usuario.rol === "admin" ? "/admin" : "/"} replace />;

    const handleChange = (e) => {
        setError("");
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const validar = () => {
        if (!form.email.trim()) return "El email es requerido.";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "El email no es válido.";
        if (!form.password.trim()) return "La contraseña es requerida.";
        if (form.password.length < 6) return "La contraseña debe tener mínimo 6 caracteres.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validacionError = validar();
        if (validacionError) { setError(validacionError); return; }

        setCargando(true);
        await new Promise((r) => setTimeout(r, 600)); // simula latencia
        const exito = login(form.email, form.password);
        setCargando(false);

        if (exito) {
            // Redirige según rol
            const u = { email: form.email };
            navigate(form.email === "admin@glosse.com" ? "/admin" : "/");
        }
    };

    return (
        <div className="login-bg">
            <div className="login-card">
                {/* Logo */}
                <Link to="/" className="login-logo">Glossé</Link>
                <p className="login-subtitulo">Bienvenida de nuevo ✨</p>

                {/* Hint de credenciales para demo */}
                <div className="login-hint">
                    <strong>Demo:</strong> admin@glosse.com / glosse123
                </div>

                <form onSubmit={handleSubmit} className="login-form" noValidate>
                    {error && <div className="login-error">⚠️ {error}</div>}

                    <div className="login-campo">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            disabled={cargando}
                        />
                    </div>

                    <div className="login-campo">
                        <label htmlFor="password">Contraseña</label>
                        <div className="login-pass-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={mostrarPass ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                disabled={cargando}
                            />
                            <button
                                type="button"
                                className="login-ojo"
                                onClick={() => setMostrarPass((p) => !p)}
                                aria-label="Mostrar contraseña"
                            >
                                {mostrarPass ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={cargando}>
                        {cargando ? "Ingresando..." : "Iniciar sesión →"}
                    </button>
                </form>

                <Link to="/" className="login-volver">← Volver a la tienda</Link>
            </div>

            {/* Decoración de fondo */}
            <div className="login-deco login-deco-1">🌸</div>
            <div className="login-deco login-deco-2">🌸</div>
            <div className="login-deco login-deco-3">🌸</div>
        </div>
    );
};

export default Login;
