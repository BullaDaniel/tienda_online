import { useMemo } from "react";

const Petalo = () => {
    const petaloArray = useMemo(() =>
        Array.from({ length: 7 }, () => ({
            left: `${Math.random() * 100}vw`,
            duration: `${Math.random() * 6 + 4}s`,
        })),
    []);

    return (
        <>
            {petaloArray.map((estilo, index) => (
                <div
                    key={index}
                    className="petalo"
                    style={{
                        left: estilo.left,
                        animationDuration: estilo.duration,
                    }}
                />
            ))}
        </>
    );
};

export default Petalo;