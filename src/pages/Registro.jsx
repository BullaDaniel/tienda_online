// src/pages/Registro.jsx
import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Registro = () => {
    const { usuario, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [mostrarPass, setMostrarPass] = useState(false);

    if (usuario) return <Navigate to="/" replace />;

    const handleChange = (e) => {
        setError("");
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const validar = () => {
        if (!form.nombre.trim())              return "El nombre es requerido.";
        if (!form.email.trim())               return "El email es requerido.";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "El email no es válido.";
        if (form.password.length < 6)         return "La contraseña debe tener mínimo 6 caracteres.";
        if (form.password !== form.confirmar) return "Las contraseñas no coinciden.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validar();
        if (err) { setError(err); return; }

        setCargando(true);
        try {
            const res = await fetch("https://tiendaonline-production-ca3b.up.railway.app/api/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre:   form.nombre,
                    email:    form.email,
                    password: form.password,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            login(data);
            navigate("/");
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
                <p className="login-subtitulo">Crea tu cuenta ✨</p>

                <form onSubmit={handleSubmit} className="login-form" noValidate>
                    {error && <div className="login-error">⚠️ {error}</div>}

                    <div className="login-campo">
                        <label htmlFor="nombre">Nombre</label>
                        <input id="nombre" name="nombre" type="text"
                            placeholder="Tu nombre" value={form.nombre}
                            onChange={handleChange} disabled={cargando} />
                    </div>

                    <div className="login-campo">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email"
                            placeholder="tu@email.com" value={form.email}
                            onChange={handleChange} disabled={cargando} />
                    </div>

                    <div className="login-campo">
                        <label htmlFor="password">Contraseña</label>
                        <div className="login-pass-wrapper">
                            <input id="password" name="password"
                                type={mostrarPass ? "text" : "password"}
                                placeholder="Mínimo 6 caracteres" value={form.password}
                                onChange={handleChange} disabled={cargando} />
                            <button type="button" className="login-ojo"
                                onClick={() => setMostrarPass((p) => !p)}>
                                {mostrarPass ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <div className="login-campo">
                        <label htmlFor="confirmar">Confirmar contraseña</label>
                        <input id="confirmar" name="confirmar"
                            type={mostrarPass ? "text" : "password"}
                            placeholder="Repite tu contraseña" value={form.confirmar}
                            onChange={handleChange} disabled={cargando} />
                    </div>

                    <button type="submit" className="login-btn" disabled={cargando}>
                        {cargando ? "Creando cuenta..." : "Crear cuenta →"}
                    </button>
                </form>

                <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#888" }}>
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" style={{ color: "#FF7EB3", fontWeight: 600 }}>
                        Inicia sesión
                    </Link>
                </p>

                <Link to="/" className="login-volver">← Volver a la tienda</Link>
            </div>

            <div className="login-deco login-deco-1">🌸</div>
            <div className="login-deco login-deco-2">🌸</div>
            <div className="login-deco login-deco-3">🌸</div>
        </div>
    );
};

export default Registro;