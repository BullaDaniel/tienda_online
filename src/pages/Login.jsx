// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { usuario, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [mostrarPass, setMostrarPass] = useState(false);

    // Si ya está autenticado, redirige
    if (usuario) return <Navigate to={usuario.rol === "admin" ? "/admin" : "/"} replace />;

    const handleChange = (e) => {
        setError("");
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email.trim() || !form.password.trim()) {
            setError("Completa todos los campos.");
            return;
        }

        setCargando(true);
        try {
            const res = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Email o contraseña incorrectos.");
                return;
            }

            if (data.rol !== "admin") {
                setError("No tienes permisos de administrador.");
                return;
            }

            login(data);
            navigate("/admin");
        } catch {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-bg">
            <div className="login-card">
                <Link to="/" className="login-logo">Glossé</Link>
                <p className="login-subtitulo">Bienvenida de nuevo ✨</p>

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

            <div className="login-deco login-deco-1">🌸</div>
            <div className="login-deco login-deco-2">🌸</div>
            <div className="login-deco login-deco-3">🌸</div>
        </div>
    );
};

export default Login;