
// ─────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "https://tiendaonline-production-ca3b.up.railway.app";

const ColeccionesContext = createContext(null);

export const ColeccionesProvider = ({ children }) => {
    const [colecciones, setColecciones] = useState([]);
    const [cargando, setCargando]       = useState(true);
    const [error, setError]             = useState(null);

    // ── Cargar todas al montar ─────────────────
    useEffect(() => {
        fetch(`${API}/api/colecciones`)
            .then((r) => r.json())
            .then((data) => { setColecciones(data); setCargando(false); })
            .catch(() => { setError("No se pudieron cargar las colecciones."); setCargando(false); });
    }, []);

    // ── CRUD Colecciones ───────────────────────
    const crearColeccion = (datos) =>
        fetch(`${API}/api/colecciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        })
        .then((r) => r.json())
        .then((nueva) => { setColecciones((p) => [nueva, ...p]); return nueva; });

    const editarColeccion = (id, datos) =>
        fetch(`${API}/api/colecciones/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        })
        .then((r) => r.json())
        .then(() => setColecciones((p) => p.map((c) => (c.id === id ? { ...c, ...datos } : c))));

    const eliminarColeccion = (id) =>
        fetch(`${API}/api/colecciones/${id}`, { method: "DELETE" })
        .then(() => setColecciones((p) => p.filter((c) => c.id !== id)));

    // ── CRUD Cards (anidado) ───────────────────
    const crearCard = (coleccionId, datos) =>
        fetch(`${API}/api/colecciones/${coleccionId}/cards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        })
        .then((r) => r.json())
        .then((nueva) => {
            setColecciones((prev) => prev.map((c) =>
                c.id === coleccionId
                    ? { ...c, cards: [nueva, ...(c.cards || [])] }
                    : c
            ));
            return nueva;
        });

    const editarCard = (coleccionId, cardId, datos) =>
        fetch(`${API}/api/colecciones/${coleccionId}/cards/${cardId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        })
        .then((r) => r.json())
        .then(() => {
            setColecciones((prev) => prev.map((c) =>
                c.id === coleccionId
                    ? { ...c, cards: (c.cards || []).map((k) => (k.id === cardId ? { ...k, ...datos } : k)) }
                    : c
            ));
        });

    const eliminarCard = (coleccionId, cardId) =>
        fetch(`${API}/api/colecciones/${coleccionId}/cards/${cardId}`, { method: "DELETE" })
        .then(() => {
            setColecciones((prev) => prev.map((c) =>
                c.id === coleccionId
                    ? { ...c, cards: (c.cards || []).filter((k) => k.id !== cardId) }
                    : c
            ));
        });

    // ── Cargar cards de una colección puntual ──
    const cargarCards = (coleccionId) =>
        fetch(`${API}/api/colecciones/${coleccionId}/cards`)
            .then((r) => r.json())
            .then((cards) => {
                setColecciones((prev) => prev.map((c) =>
                    c.id === coleccionId ? { ...c, cards } : c
                ));
                return cards;
            });

    return (
        <ColeccionesContext.Provider value={{
            colecciones, cargando, error,
            crearColeccion, editarColeccion, eliminarColeccion,
            crearCard, editarCard, eliminarCard, cargarCards,
        }}>
            {children}
        </ColeccionesContext.Provider>
    );
};

export const useColecciones = () => useContext(ColeccionesContext);
