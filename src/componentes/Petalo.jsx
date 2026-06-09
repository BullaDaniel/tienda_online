
const Petalo = () => {
    const petaloArray = Array.from({ length: 7 });
    return (
        <>
            {petaloArray.map((_, index) => (
                <div
                    key={index}
                    className="petalo"
                    style={{
                        left: `${Math.random() * 100}vw`,
                        animationDuration: `${Math.random() * 6 + 4}s`,
                    }}
                />
            ))}
        </>
    );
};

export default Petalo;
