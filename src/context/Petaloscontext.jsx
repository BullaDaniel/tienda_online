
import { createContext, useContext, useState } from "react";

const PetalosContext = createContext(null);

export const PetalosProvider = ({ children }) => {
    const [petalosActivos, setPetalosActivos] = useState(() => {
        const guardado = localStorage.getItem("petalos");
        return guardado === null ? true : guardado === "true";
    });

    const togglePetalos = () => {
        setPetalosActivos((prev) => {
            localStorage.setItem("petalos", String(!prev));
            return !prev;
        });
    };

    return (
        <PetalosContext.Provider value={{ petalosActivos, togglePetalos }}>
            {children}
        </PetalosContext.Provider>
    );
};

export const usePetalos = () => useContext(PetalosContext);