// src/componentes/SubirImagen.jsx
// Reemplaza cualquier input de URL de imagen
// por un input real de archivo con preview.
import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "https://tiendaonline-production-ca3b.up.railway.app";

const SubirImagen = ({ value, onChange, label = "Imagen *" }) => {
    const [subiendo, setSubiendo] = useState(false);
    const [error, setError]       = useState("");

    const handleArchivo = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        // Validación básica
        if (!["image/jpeg", "image/png", "image/webp"].includes(archivo.type)) {
            setError("Solo se aceptan imágenes JPG, PNG o WebP.");
            return;
        }
        if (archivo.size > 5 * 1024 * 1024) {
            setError("La imagen no puede pesar más de 5MB.");
            return;
        }

        setError("");
        setSubiendo(true);

        const formData = new FormData();
        formData.append("imagen", archivo);

        try {
            const res  = await fetch(`${API}/api/upload`, { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al subir");
            onChange(data.url); // devuelve la URL de Cloudinary al formulario padre
        } catch (err) {
            setError("No se pudo subir la imagen. Intenta de nuevo.");
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div className="admin-campo">
            <label>{label}</label>

            <div className="subir-imagen-wrapper">
                <label className={`subir-imagen-btn ${subiendo ? "subiendo" : ""}`}>
                    {subiendo ? "⏳ Subiendo..." : "📁 Elegir imagen"}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleArchivo}
                        disabled={subiendo}
                        style={{ display: "none" }}
                    />
                </label>

                {value && (
                    <img
                        src={value}
                        alt="preview"
                        className="admin-img-preview"
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                )}
            </div>

            {error && <span className="admin-campo-error">{error}</span>}
        </div>
    );
};

export default SubirImagen;