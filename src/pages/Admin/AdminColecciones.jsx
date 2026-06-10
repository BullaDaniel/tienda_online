// src/pages/admin/AdminColecciones.jsx
// ─────────────────────────────────────────────
// Panel Admin de Colecciones.
// Vista 1: Lista de colecciones (tabla)
// Vista 2: Formulario crear/editar colección
// Vista 3: Gestor de cards (CRUD anidado)
// ─────────────────────────────────────────────
import { useState } from "react";
import { useColecciones } from "../../context/ColeccionesContext";

// ── Utilidad: genera slug desde título ────────
const generarSlug = (texto) =>
    texto.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim().replace(/\s+/g, "-");

// ═══════════════════════════════════════════════
// FORMULARIO DE COLECCIÓN
// ═══════════════════════════════════════════════
const FormColeccion = ({ coleccionInicial, onGuardar, onCancelar }) => {
    const [form, setForm] = useState({
        titulo:         coleccionInicial?.titulo         || "",
        slug:           coleccionInicial?.slug           || "",
        descripcion:    coleccionInicial?.descripcion    || "",
        imagen_portada: coleccionInicial?.imagen_portada || "",
    });
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrores((p) => ({ ...p, [name]: "" }));
        setForm((p) => ({
            ...p,
            [name]: value,
            // Auto-slug solo si no está en edición y el campo es titulo
            ...(name === "titulo" && !coleccionInicial ? { slug: generarSlug(value) } : {}),
        }));
    };

    const validar = () => {
        const e = {};
        if (!form.titulo.trim())         e.titulo         = "El título es requerido.";
        if (!form.slug.trim())           e.slug           = "El slug es requerido.";
        if (!form.imagen_portada.trim()) e.imagen_portada = "La imagen de portada es requerida.";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validar();
        if (Object.keys(err).length) { setErrores(err); return; }
        setCargando(true);
        try { await onGuardar(form); }
        catch { setErrores({ general: "Error al guardar. Intenta de nuevo." }); }
        finally { setCargando(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form" noValidate>
            {errores.general && <div className="admin-error-general">{errores.general}</div>}

            <div className="admin-campo">
                <label>Título *</label>
                <input name="titulo" value={form.titulo} onChange={handleChange}
                    placeholder="Ej: Colección Verano Satín" disabled={cargando} />
                {errores.titulo && <span className="admin-campo-error">{errores.titulo}</span>}
            </div>

            <div className="admin-campo">
                <label>Slug * <small>(URL amigable, auto-generado)</small></label>
                <input name="slug" value={form.slug} onChange={handleChange}
                    placeholder="verano-satin" disabled={cargando} />
                <small className="admin-campo-hint">→ /colecciones/{form.slug || "mi-coleccion"}</small>
                {errores.slug && <span className="admin-campo-error">{errores.slug}</span>}
            </div>

            <div className="admin-campo">
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                    placeholder="Describe la colección..." rows={3} disabled={cargando} />
            </div>

            <div className="admin-campo">
                <label>URL de imagen de portada *</label>
                <input name="imagen_portada" value={form.imagen_portada} onChange={handleChange}
                    placeholder="https://... o /imagenes/portada.jpg" disabled={cargando} />
                {errores.imagen_portada && <span className="admin-campo-error">{errores.imagen_portada}</span>}
                {form.imagen_portada && (
                    <img src={form.imagen_portada} alt="preview"
                        className="admin-img-preview"
                        onError={(e) => { e.target.style.display = "none"; }} />
                )}
            </div>

            <div className="admin-fila">
                <button type="submit" className="admin-btn-submit" disabled={cargando}>
                    {cargando ? "⏳ Guardando..." : coleccionInicial ? "💾 Guardar cambios" : "➕ Crear colección"}
                </button>
                <button type="button" className="admin-btn-cancelar" onClick={onCancelar} disabled={cargando}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};

// ═══════════════════════════════════════════════
// GESTOR DE CARDS (CRUD anidado)
// ═══════════════════════════════════════════════
const cardVacia = { titulo: "", descripcion_corta: "", imagen: "", enlace: "", precio: "", fecha: "", tags: "", etiqueta: "" };

const GestorCards = ({ coleccion, onVolver }) => {
    const { crearCard, editarCard, eliminarCard, cargarCards } = useColecciones();
    const [form, setForm]           = useState(cardVacia);
    const [editandoId, setEditandoId] = useState(null);
    const [errores, setErrores]     = useState({});
    const [cargando, setCargando]   = useState(false);
    const [exito, setExito]         = useState("");

    const cards = coleccion.cards || [];

    const handleChange = (e) => {
        setErrores((p) => ({ ...p, [e.target.name]: "" }));
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const iniciarEdicion = (card) => {
        setEditandoId(card.id);
        setForm({
            titulo:           card.titulo           || "",
            descripcion_corta:card.descripcion_corta|| "",
            imagen:           card.imagen           || "",
            enlace:           card.enlace           || "",
            precio:           card.precio           || "",
            fecha:            card.fecha?.slice(0, 10) || "",
            tags:             card.tags             || "",
            etiqueta:         card.etiqueta         || "",
        });
        setErrores({});
    };

    const cancelarEdicion = () => { setEditandoId(null); setForm(cardVacia); setErrores({}); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.titulo.trim()) { setErrores({ titulo: "El título es requerido." }); return; }
        setCargando(true);
        setExito("");
        try {
            if (editandoId) {
                await editarCard(coleccion.id, editandoId, form);
                setExito(`✅ "${form.titulo}" actualizada.`);
                setEditandoId(null);
            } else {
                await crearCard(coleccion.id, form);
                setExito(`✅ "${form.titulo}" añadida a la colección.`);
            }
            setForm(cardVacia);
            setTimeout(() => setExito(""), 3500);
        } catch {
            setErrores({ general: "Error al guardar la card." });
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async (card) => {
        if (!window.confirm(`¿Eliminar "${card.titulo}"?`)) return;
        await eliminarCard(coleccion.id, card.id);
        if (editandoId === card.id) cancelarEdicion();
    };

    return (
        <div>
            <div className="admin-seccion-header">
                <button className="admin-btn-volver" onClick={onVolver}>← Volver a colecciones</button>
                <div>
                    <h2>Cards de: <em>{coleccion.titulo}</em></h2>
                    <small className="admin-campo-hint">/colecciones/{coleccion.slug}</small>
                </div>
            </div>

            <div className="admin-contenido">
                {/* Formulario de card */}
                <section className="admin-form-panel">
                    <h3 className="admin-subtitulo">
                        {editandoId ? "✏️ Editando card" : "➕ Nueva card"}
                    </h3>

                    {exito && <div className="admin-exito">{exito}</div>}
                    {errores.general && <div className="admin-error-general">{errores.general}</div>}

                    <form onSubmit={handleSubmit} className="admin-form" noValidate>
                        <div className="admin-campo">
                            <label>Título *</label>
                            <input name="titulo" value={form.titulo} onChange={handleChange}
                                placeholder="Ej: Set Satín Lavanda" disabled={cargando} />
                            {errores.titulo && <span className="admin-campo-error">{errores.titulo}</span>}
                        </div>

                        <div className="admin-campo">
                            <label>Descripción corta</label>
                            <textarea name="descripcion_corta" value={form.descripcion_corta}
                                onChange={handleChange} rows={2} disabled={cargando}
                                placeholder="Una línea que describe esta pieza..." />
                        </div>

                        <div className="admin-campo">
                            <label>URL de imagen</label>
                            <input name="imagen" value={form.imagen} onChange={handleChange}
                                placeholder="https://... o /imagenes/pieza.jpg" disabled={cargando} />
                            {form.imagen && (
                                <img src={form.imagen} alt="preview" className="admin-img-preview"
                                    onError={(e) => { e.target.style.display = "none"; }} />
                            )}
                        </div>

                        <div className="admin-campo">
                            <label>Enlace <small>(opcional)</small></label>
                            <input name="enlace" value={form.enlace} onChange={handleChange}
                                placeholder="https://..." disabled={cargando} />
                        </div>

                        {/* Campos personalizados */}
                        <p className="admin-separador">Campos personalizados opcionales</p>

                        <div className="admin-fila">
                            <div className="admin-campo">
                                <label>Precio COP</label>
                                <input name="precio" type="number" value={form.precio}
                                    onChange={handleChange} placeholder="89900" disabled={cargando} />
                            </div>
                            <div className="admin-campo">
                                <label>Fecha</label>
                                <input name="fecha" type="date" value={form.fecha}
                                    onChange={handleChange} disabled={cargando} />
                            </div>
                        </div>

                        <div className="admin-fila">
                            <div className="admin-campo">
                                <label>Tags <small>(separadas por coma)</small></label>
                                <input name="tags" value={form.tags} onChange={handleChange}
                                    placeholder="satín, nuevo, verano" disabled={cargando} />
                            </div>
                            <div className="admin-campo">
                                <label>Etiqueta</label>
                                <select name="etiqueta" value={form.etiqueta} onChange={handleChange} disabled={cargando}>
                                    {["", "Nuevo", "Hot Sale", "Descuento", "Exclusivo"].map((e) => (
                                        <option key={e} value={e}>{e || "Sin etiqueta"}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="admin-fila">
                            <button type="submit" className="admin-btn-submit" disabled={cargando}>
                                {cargando ? "⏳ Guardando..." : editandoId ? "💾 Guardar" : "➕ Añadir card"}
                            </button>
                            {editandoId && (
                                <button type="button" className="admin-btn-cancelar"
                                    onClick={cancelarEdicion} disabled={cargando}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* Lista de cards */}
                <section className="admin-lista-panel">
                    <h2>Cards <span className="admin-badge">{cards.length}</span></h2>
                    <div className="admin-lista">
                        {cards.length === 0 && (
                            <p className="admin-rel-vacio">Aún no hay cards en esta colección.</p>
                        )}
                        {cards.map((card) => (
                            <div key={card.id} className={`admin-item ${editandoId === card.id ? "admin-item--activo" : ""}`}>
                                <img src={card.imagen} alt={card.titulo}
                                    onError={(e) => { e.target.style.background = "#FFE3EC"; e.target.src = ""; }} />
                                <div className="admin-item-info">
                                    <strong>{card.titulo}</strong>
                                    <span>{card.descripcion_corta}</span>
                                    <small>
                                        {card.precio ? `$${Number(card.precio).toLocaleString("es-CO")} · ` : ""}
                                        {card.tags || ""}
                                    </small>
                                </div>
                                <div className="admin-item-acciones">
                                    <button className="admin-btn-editar" onClick={() => iniciarEdicion(card)} title="Editar">✏️</button>
                                    <button className="admin-btn-eliminar" onClick={() => handleEliminar(card)} title="Eliminar">🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════
// VISTA PRINCIPAL: LISTA DE COLECCIONES
// ═══════════════════════════════════════════════
const AdminColecciones = () => {
    const { colecciones, cargando, crearColeccion, editarColeccion, eliminarColeccion, cargarCards } = useColecciones();

    // "lista" | "crear" | "editar" | "cards"
    const [vista, setVista]         = useState("lista");
    const [seleccionada, setSeleccionada] = useState(null);
    const [exito, setExito]         = useState("");

    const mostrarExito = (msg) => { setExito(msg); setTimeout(() => setExito(""), 3500); };

    const handleCrear = async (datos) => {
        await crearColeccion(datos);
        mostrarExito(`✅ Colección "${datos.titulo}" creada.`);
        setVista("lista");
    };

    const handleEditar = async (datos) => {
        await editarColeccion(seleccionada.id, datos);
        mostrarExito(`✅ "${datos.titulo}" actualizada.`);
        setSeleccionada(null);
        setVista("lista");
    };

    const handleEliminar = async (col) => {
        if (!window.confirm(`¿Eliminar "${col.titulo}" y todas sus cards?`)) return;
        await eliminarColeccion(col.id);
        mostrarExito(`🗑️ "${col.titulo}" eliminada.`);
    };

    const abrirCards = async (col) => {
        setSeleccionada(col);
        if (!col.cards) await cargarCards(col.id);
        setVista("cards");
    };

    // ── Vista: gestionar cards ─────────────────
    if (vista === "cards" && seleccionada) {
        const colActualizada = colecciones.find((c) => c.id === seleccionada.id) || seleccionada;
        return (
            <GestorCards
                coleccion={colActualizada}
                onVolver={() => { setVista("lista"); setSeleccionada(null); }}
            />
        );
    }

    // ── Vista: crear / editar colección ────────
    if (vista === "crear" || vista === "editar") {
        return (
            <div>
                <div className="admin-seccion-header">
                    <button className="admin-btn-volver" onClick={() => { setVista("lista"); setSeleccionada(null); }}>
                        ← Volver a colecciones
                    </button>
                    <h2>{vista === "crear" ? "Nueva colección" : `Editando: ${seleccionada?.titulo}`}</h2>
                </div>
                <div style={{ maxWidth: 640, padding: "1.5rem 0" }}>
                    <FormColeccion
                        coleccionInicial={vista === "editar" ? seleccionada : null}
                        onGuardar={vista === "crear" ? handleCrear : handleEditar}
                        onCancelar={() => { setVista("lista"); setSeleccionada(null); }}
                    />
                </div>
            </div>
        );
    }

    // ── Vista: lista ───────────────────────────
    return (
        <div>
            <div className="admin-seccion-header">
                <h2>Colecciones <span className="admin-badge">{colecciones.length}</span></h2>
                <button className="admin-btn-submit" style={{ width: "auto", padding: "0.6rem 1.25rem" }}
                    onClick={() => setVista("crear")}>
                    ➕ Nueva colección
                </button>
            </div>

            {exito && <div className="admin-exito" style={{ margin: "0 0 1rem" }}>{exito}</div>}

            {cargando ? (
                <p>Cargando...</p>
            ) : colecciones.length === 0 ? (
                <p className="admin-rel-vacio">No hay colecciones. Crea la primera. 🌸</p>
            ) : (
                <div className="admin-colecciones-tabla">
                    {colecciones.map((col) => (
                        <div key={col.id} className="admin-coleccion-fila">
                            <img src={col.imagen_portada} alt={col.titulo}
                                className="admin-coleccion-portada"
                                onError={(e) => { e.target.style.background = "#FFE3EC"; e.target.src = ""; }} />
                            <div className="admin-item-info">
                                <strong>{col.titulo}</strong>
                                <span className="admin-campo-hint">/colecciones/{col.slug}</span>
                                <small>{col.descripcion}</small>
                            </div>
                            <span className="admin-badge">{col.total_cards ?? col.cards?.length ?? 0} cards</span>
                            <div className="admin-item-acciones">
                                <button className="admin-btn-relacionados" title="Gestionar cards"
                                    onClick={() => abrirCards(col)}>🗂️</button>
                                <button className="admin-btn-editar" title="Editar colección"
                                    onClick={() => { setSeleccionada(col); setVista("editar"); }}>✏️</button>
                                <button className="admin-btn-eliminar" title="Eliminar"
                                    onClick={() => handleEliminar(col)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminColecciones;
