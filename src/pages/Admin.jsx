// src/pages/Admin.jsx
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

    // Estado para el panel de relacionados
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [relacionados, setRelacionados] = useState([]);
    const [cargandoRel, setCargandoRel] = useState(false);
    const [relacionadoId, setRelacionadoId] = useState("");

    const handleChange = (e) => {
        setErrores((p) => ({ ...p, [e.target.name]: "" }));
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const validar = () => {
        const e = {};
        if (!form.nombre.trim())      e.nombre      = "El nombre es requerido.";
        if (!form.descripcion.trim()) e.descripcion = "La descripción es requerida.";
        if (!form.precio || isNaN(Number(form.precio)) || Number(form.precio) <= 0)
                                      e.precio      = "Ingresa un precio válido mayor a 0.";
        if (!form.imagen.trim())      e.imagen      = "La URL de imagen es requerida.";
        if (!form.tallas.trim())      e.tallas      = "Ingresa al menos una talla (ej: S, M, L).";
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
                nombre: form.nombre,
                descripcion: form.descripcion,
                precio: Number(form.precio),
                imagen: form.imagen,
                tallas: form.tallas,
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

    // Abrir panel de relacionados de un producto
    const abrirRelacionados = async (producto) => {
        setProductoSeleccionado(producto);
        setCargandoRel(true);
        try {
            const res = await fetch(`http://localhost:3001/api/productos/${producto.id}/relacionados`);
            const data = await res.json();
            setRelacionados(data);
        } catch {
            setRelacionados([]);
        } finally {
            setCargandoRel(false);
        }
    };

    // Agregar relacionado
    const agregarRelacionado = async () => {
        if (!relacionadoId || relacionadoId == productoSeleccionado.id) return;
        try {
            await fetch(`http://localhost:3001/api/productos/${productoSeleccionado.id}/relacionados`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ producto_relacionado_id: Number(relacionadoId) }),
            });
            setRelacionadoId("");
            abrirRelacionados(productoSeleccionado);
        } catch {
            alert("Error al agregar relacionado.");
        }
    };

    // Eliminar relacionado
    const eliminarRelacionado = async (relacionadoId) => {
        try {
            await fetch(`http://localhost:3001/api/productos/${productoSeleccionado.id}/relacionados/${relacionadoId}`, {
                method: "DELETE",
            });
            abrirRelacionados(productoSeleccionado);
        } catch {
            alert("Error al eliminar relacionado.");
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
                        <div className="admin-campo">
                            <label>Nombre del producto *</label>
                            <input name="nombre" value={form.nombre} onChange={handleChange}
                                placeholder="Ej: Set Satín Champagne" disabled={cargando} />
                            {errores.nombre && <span className="admin-campo-error">{errores.nombre}</span>}
                        </div>

                        <div className="admin-campo">
                            <label>Descripción *</label>
                            <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                                placeholder="Describe el producto: material, ocasión, estilo..." rows={3} disabled={cargando} />
                            {errores.descripcion && <span className="admin-campo-error">{errores.descripcion}</span>}
                        </div>

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
                            </div>
                        </div>

                        <div className="admin-campo">
                            <label>URL de imagen *</label>
                            <input name="imagen" value={form.imagen} onChange={handleChange}
                                placeholder="/imagenes/NuevoProducto.jpg" disabled={cargando} />
                            {errores.imagen && <span className="admin-campo-error">{errores.imagen}</span>}
                        </div>

                        <div className="admin-campo">
                            <label>Tallas * <small>(separadas por coma)</small></label>
                            <input name="tallas" value={form.tallas} onChange={handleChange}
                                placeholder="XS, S, M, L, XL" disabled={cargando} />
                            {errores.tallas && <span className="admin-campo-error">{errores.tallas}</span>}
                        </div>

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
                                        {Number(p.precio).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                                    </span>
                                    <small>{Array.isArray(p.tallas) ? p.tallas.join(", ") : p.tallas}</small>
                                </div>
                                <button
                                    className="admin-btn-relacionados"
                                    onClick={() => abrirRelacionados(p)}
                                    title="Gestionar productos relacionados"
                                >
                                    🔗
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Modal de relacionados */}
            {productoSeleccionado && (
                <div className="admin-modal-overlay" onClick={() => setProductoSeleccionado(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Relacionados de "{productoSeleccionado.nombre}"</h3>

                        {/* Agregar relacionado */}
                        <div className="admin-rel-agregar">
                            <select
                                value={relacionadoId}
                                onChange={(e) => setRelacionadoId(e.target.value)}
                            >
                                <option value="">Selecciona un producto...</option>
                                {productos
                                    .filter(p => p.id !== productoSeleccionado.id)
                                    .map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))
                                }
                            </select>
                            <button onClick={agregarRelacionado} disabled={!relacionadoId}>
                                Agregar
                            </button>
                        </div>

                        {/* Lista de relacionados actuales */}
                        {cargandoRel ? (
                            <p>Cargando...</p>
                        ) : relacionados.length === 0 ? (
                            <p className="admin-rel-vacio">Sin productos relacionados aún.</p>
                        ) : (
                            <div className="admin-rel-lista">
                                {relacionados.map((r) => (
                                    <div key={r.id} className="admin-rel-item">
                                        <img src={r.imagen} alt={r.nombre}
                                            onError={(e) => { e.target.style.background = "#FFE3EC"; e.target.src = ""; }} />
                                        <span>{r.nombre}</span>
                                        <button onClick={() => eliminarRelacionado(r.id)}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button className="admin-modal-cerrar" onClick={() => setProductoSeleccionado(null)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;