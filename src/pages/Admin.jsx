// src/pages/Admin.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProductos } from "../context/ProductosContext";
import AdminColecciones from "./admin/AdminColecciones";

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
    const { productos, agregarProducto, editarProducto, eliminarProducto } = useProductos();

    const [tabAdmin, setTabAdmin] = useState("productos"); // "productos" | "colecciones"
    const [form, setForm] = useState(camposVacios);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [exito, setExito] = useState("");
    const [modoEdicion, setModoEdicion] = useState(null); // id del producto en edición

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
        if (!modoEdicion && !form.tallas.trim()) e.tallas = "Ingresa al menos una talla (ej: S, M, L).";
        return e;
    };

    // Entrar en modo edición
    const iniciarEdicion = (p) => {
        setModoEdicion(p.id);
        setForm({
            nombre:        p.nombre        || "",
            descripcion:   p.descripcion   || "",
            precio:        p.precio        || "",
            precioOriginal:p.precioOriginal || "",
            imagen:        p.imagen        || "",
            tallas:        Array.isArray(p.tallas) ? p.tallas.join(", ") : (p.tallas || ""),
            etiqueta:      p.etiqueta      || "",
        });
        setErrores({});
        setExito("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Cancelar edición
    const cancelarEdicion = () => {
        setModoEdicion(null);
        setForm(camposVacios);
        setErrores({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validar();
        if (Object.keys(err).length) { setErrores(err); return; }

        setCargando(true);
        setExito("");
        try {
            if (modoEdicion) {
                // Modo edición
                await editarProducto(modoEdicion, {
                    nombre:      form.nombre,
                    descripcion: form.descripcion,
                    precio:      Number(form.precio),
                    imagen:      form.imagen,
                });
                setExito(`✅ "${form.nombre}" actualizado con éxito.`);
                setModoEdicion(null);
            } else {
                // Modo creación
                const nuevo = await agregarProducto({
                    nombre:      form.nombre,
                    descripcion: form.descripcion,
                    precio:      Number(form.precio),
                    imagen:      form.imagen,
                    tallas:      form.tallas,
                });
                setExito(`✅ "${nuevo.nombre}" añadido al catálogo con éxito.`);
            }
            setForm(camposVacios);
            setTimeout(() => setExito(""), 4000);
        } catch {
            setErrores({ general: "Error al guardar. Intenta de nuevo." });
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async (p) => {
        if (!window.confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
        try {
            await eliminarProducto(p.id);
            setExito(`🗑️ "${p.nombre}" eliminado del catálogo.`);
            setTimeout(() => setExito(""), 3000);
            if (modoEdicion === p.id) cancelarEdicion();
        } catch {
            alert("Error al eliminar el producto.");
        }
    };

    // Relacionados
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

    const eliminarRelacionado = async (relId) => {
        try {
            await fetch(`http://localhost:3001/api/productos/${productoSeleccionado.id}/relacionados/${relId}`, {
                method: "DELETE",
            });
            abrirRelacionados(productoSeleccionado);
        } catch {
            alert("Error al eliminar relacionado.");
        }
    };

    return (
        <div className="admin-bg">
            <header className="admin-header">
                <Link to="/" className="admin-logo">Glossé</Link>
                <div className="admin-header-right">
                    <span className="admin-bienvenida">👋 {usuario?.nombre}</span>
                    <Link to="/" className="admin-link-tienda">Ver tienda</Link>
                    <div className="admin-tabs">
    <button
        className={`admin-tab ${tabAdmin === "productos" ? "admin-tab--activo" : ""}`}
        onClick={() => setTabAdmin("productos")}
    >
        📦 Productos
    </button>
    <button
        className={`admin-tab ${tabAdmin === "colecciones" ? "admin-tab--activo" : ""}`}
        onClick={() => setTabAdmin("colecciones")}
    >
        🗂️ Colecciones
    </button>
</div>
                    <button className="admin-logout" onClick={logout}>Salir</button>
                </div>
            </header>

        {tabAdmin === "productos" && (
            <div className="admin-contenido">
                {/* Panel izquierdo: formulario */}
                <section className="admin-form-panel">
                    <h1 className="admin-titulo">
                        {modoEdicion ? "✏️ Editar producto" : "🛠 Panel de Administración"}
                    </h1>
                    <p className="admin-subtitulo">
                        {modoEdicion ? "Modifica los datos del producto y guarda los cambios." : "Agrega nuevos productos al catálogo en tiempo real."}
                    </p>

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

                        {/* Tallas solo al crear — las variantes se manejan por separado al editar */}
                        {!modoEdicion && (
                            <div className="admin-campo">
                                <label>Tallas * <small>(separadas por coma)</small></label>
                                <input name="tallas" value={form.tallas} onChange={handleChange}
                                    placeholder="XS, S, M, L, XL" disabled={cargando} />
                                {errores.tallas && <span className="admin-campo-error">{errores.tallas}</span>}
                            </div>
                        )}

                        <div className="admin-campo">
                            <label>Etiqueta</label>
                            <select name="etiqueta" value={form.etiqueta} onChange={handleChange} disabled={cargando}>
                                {ETIQUETAS.map((et) => (
                                    <option key={et} value={et}>{et || "Sin etiqueta"}</option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-fila">
                            <button type="submit" className="admin-btn-submit" disabled={cargando}>
                                {cargando ? "⏳ Guardando..." : modoEdicion ? "💾 Guardar cambios" : "➕ Agregar producto"}
                            </button>
                            {modoEdicion && (
                                <button
                                    type="button"
                                    className="admin-btn-cancelar"
                                    onClick={cancelarEdicion}
                                    disabled={cargando}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* Panel derecho: lista de productos */}
                <section className="admin-lista-panel">
                    <h2>Productos en catálogo <span className="admin-badge">{productos.length}</span></h2>
                    <div className="admin-lista">
                        {productos.map((p) => (
                            <div key={p.id} className={`admin-item ${modoEdicion === p.id ? "admin-item--activo" : ""}`}>
                                <img
                                    src={p.imagen}
                                    alt={p.nombre}
                                    onError={(e) => { e.target.style.background = "#FFE3EC"; e.target.src = ""; }}
                                />
                                <div className="admin-item-info">
                                    <strong>{p.nombre}</strong>
                                    <span>{Number(p.precio).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}</span>
                                    <small>{Array.isArray(p.tallas) ? p.tallas.join(", ") : p.tallas}</small>
                                </div>
                                <div className="admin-item-acciones">
                                    <button
                                        className="admin-btn-relacionados"
                                        onClick={() => abrirRelacionados(p)}
                                        title="Gestionar relacionados"
                                    >🔗</button>
                                    <button
                                        className="admin-btn-editar"
                                        onClick={() => iniciarEdicion(p)}
                                        title="Editar producto"
                                    >✏️</button>
                                    <button
                                        className="admin-btn-eliminar"
                                        onClick={() => handleEliminar(p)}
                                        title="Eliminar producto"
                                    >🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )}
    {tabAdmin === "colecciones" && (
    <div className="admin-contenido" style={{ display: "block", padding: "1.5rem 3%" }}>
        <AdminColecciones />
    </div>
)}
            {/* Modal de relacionados */}
            {productoSeleccionado && (
                <div className="admin-modal-overlay" onClick={() => setProductoSeleccionado(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Relacionados de "{productoSeleccionado.nombre}"</h3>
                        <div className="admin-rel-agregar">
                            <select value={relacionadoId} onChange={(e) => setRelacionadoId(e.target.value)}>
                                <option value="">Selecciona un producto...</option>
                                {productos
                                    .filter(p => p.id !== productoSeleccionado.id)
                                    .map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))
                                }
                            </select>
                            <button onClick={agregarRelacionado} disabled={!relacionadoId}>Agregar</button>
                        </div>
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
                        <button className="admin-modal-cerrar" onClick={() => setProductoSeleccionado(null)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;