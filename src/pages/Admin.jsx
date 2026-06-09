// src/pages/Admin.jsx
// ─────────────────────────────────────────────
// Panel de administración (RUTA PROTEGIDA).
// Permite subir nuevos productos al catálogo
// en tiempo real mediante mock de API.
// Campos: Nombre, Descripción, Precio,
//         Precio Original, Imagen (URL),
//         Tallas (separadas por coma), Etiqueta.
// ─────────────────────────────────────────────
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProductos } from "../context/ProductosContext";

const ETIQUETAS = ["", "Nuevo", "Hot Sale", "Descuento"];

const camposVacios = {
    nombre: "",
    descripcion: "",
    precio: "",
    precioOriginal: "",
    imagen: "",
    tallas: "",
    etiqueta: "",
};

const Admin = () => {
    const { usuario, logout } = useAuth();
    const { productos, agregarProducto } = useProductos();
    const [form, setForm] = useState(camposVacios);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [exito, setExito] = useState("");

    const handleChange = (e) => {
        setErrores((p) => ({ ...p, [e.target.name]: "" }));
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const validar = () => {
        const e = {};
        if (!form.nombre.trim())       e.nombre       = "El nombre es requerido.";
        if (!form.descripcion.trim())  e.descripcion  = "La descripción es requerida.";
        if (!form.precio || isNaN(Number(form.precio)) || Number(form.precio) <= 0)
                                        e.precio       = "Ingresa un precio válido mayor a 0.";
        if (form.precioOriginal && (isNaN(Number(form.precioOriginal)) || Number(form.precioOriginal) <= 0))
                                        e.precioOriginal = "El precio original debe ser un número válido.";
        if (!form.imagen.trim())       e.imagen       = "La URL de imagen es requerida.";
        if (!form.tallas.trim())       e.tallas       = "Ingresa al menos una talla (ej: S, M, L).";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validar();
        if (Object.keys(err).length) { setErrores(err); return; }

        setCargando(true);
        setExito("");
        try {
            const nuevo = await agregarProducto({
                ...form,
                etiqueta: form.etiqueta || null,
            });
            setForm(camposVacios);
            setExito(`✅ "${nuevo.nombre}" añadido al catálogo con éxito.`);
            setTimeout(() => setExito(""), 4000);
        } catch {
            setErrores({ general: "Error al guardar. Intenta de nuevo." });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="admin-bg">
            {/* Header */}
            <header className="admin-header">
                <Link to="/" className="admin-logo">Glossé</Link>
                <div className="admin-header-right">
                    <span className="admin-bienvenida">👋 {usuario?.nombre}</span>
                    <Link to="/" className="admin-link-tienda">Ver tienda</Link>
                    <button className="admin-logout" onClick={logout}>Salir</button>
                </div>
            </header>

            <div className="admin-contenido">
                {/* Panel izquierdo: formulario */}
                <section className="admin-form-panel">
                    <h1 className="admin-titulo">🛠 Panel de Administración</h1>
                    <p className="admin-subtitulo">Agrega nuevos productos al catálogo en tiempo real.</p>

                    {exito && <div className="admin-exito">{exito}</div>}
                    {errores.general && <div className="admin-error-general">{errores.general}</div>}

                    <form onSubmit={handleSubmit} className="admin-form" noValidate>
                        {/* Nombre */}
                        <div className="admin-campo">
                            <label>Nombre del producto *</label>
                            <input name="nombre" value={form.nombre} onChange={handleChange}
                                placeholder="Ej: Set Satín Champagne" disabled={cargando} />
                            {errores.nombre && <span className="admin-campo-error">{errores.nombre}</span>}
                        </div>

                        {/* Descripción */}
                        <div className="admin-campo">
                            <label>Descripción *</label>
                            <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                                placeholder="Describe el producto: material, ocasión, estilo..." rows={3} disabled={cargando} />
                            {errores.descripcion && <span className="admin-campo-error">{errores.descripcion}</span>}
                        </div>

                        {/* Precios */}
                        <div className="admin-fila">
                            <div className="admin-campo">
                                <label>Precio COP *</label>
                                <input name="precio" type="number" value={form.precio} onChange={handleChange}
                                    placeholder="89900" min="0" disabled={cargando} />
                                {errores.precio && <span className="admin-campo-error">{errores.precio}</span>}
                            </div>
                            <div className="admin-campo">
                                <label>Precio Original (opcional)</label>
                                <input name="precioOriginal" type="number" value={form.precioOriginal} onChange={handleChange}
                                    placeholder="119900" min="0" disabled={cargando} />
                                {errores.precioOriginal && <span className="admin-campo-error">{errores.precioOriginal}</span>}
                            </div>
                        </div>

                        {/* Imagen */}
                        <div className="admin-campo">
                            <label>URL de imagen *</label>
                            <input name="imagen" value={form.imagen} onChange={handleChange}
                                placeholder="/imagenes/NuevoProducto.jpg" disabled={cargando} />
                            {errores.imagen && <span className="admin-campo-error">{errores.imagen}</span>}
                        </div>

                        {/* Tallas */}
                        <div className="admin-campo">
                            <label>Tallas * <small>(separadas por coma)</small></label>
                            <input name="tallas" value={form.tallas} onChange={handleChange}
                                placeholder="XS, S, M, L, XL" disabled={cargando} />
                            {errores.tallas && <span className="admin-campo-error">{errores.tallas}</span>}
                        </div>

                        {/* Etiqueta */}
                        <div className="admin-campo">
                            <label>Etiqueta</label>
                            <select name="etiqueta" value={form.etiqueta} onChange={handleChange} disabled={cargando}>
                                {ETIQUETAS.map((et) => (
                                    <option key={et} value={et}>{et || "Sin etiqueta"}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="admin-btn-submit" disabled={cargando}>
                            {cargando ? "⏳ Guardando..." : "➕ Agregar producto al catálogo"}
                        </button>
                    </form>
                </section>

                {/* Panel derecho: lista de productos */}
                <section className="admin-lista-panel">
                    <h2>Productos en catálogo <span className="admin-badge">{productos.length}</span></h2>
                    <div className="admin-lista">
                        {productos.map((p) => (
                            <div key={p.id} className="admin-item">
                                <img
                                    src={p.imagen}
                                    alt={p.nombre}
                                    onError={(e) => { e.target.style.background = "#FFE3EC"; e.target.src = ""; }}
                                />
                                <div className="admin-item-info">
                                    <strong>{p.nombre}</strong>
                                    <span>
                                        {p.precio.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                                    </span>
                                    <small>{p.tallas?.join(", ")}</small>
                                </div>
                                {p.etiqueta && (
                                    <span className={`card-etiqueta ${p.etiqueta === "Hot Sale" ? "hot-sale" : p.etiqueta === "Descuento" ? "descuento" : "nuevo"}`}>
                                        {p.etiqueta}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Admin;
