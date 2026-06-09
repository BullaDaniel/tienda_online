// src/data/productos.js
// ─────────────────────────────────────────────
// Datos iniciales del catálogo.
// El Admin puede agregar más en tiempo real.
// ─────────────────────────────────────────────
export const productosIniciales = [
    {
        id: 1,
        nombre: "Set Satín Rosa Perla",
        precio: 89900,
        precioOriginal: 119900,
        imagen: "/imagenes/Producto1.jpg",
        etiqueta: "Nuevo",
        descripcion: "Set de pijama en satín suave con acabados en encaje. Perfecto para noches especiales.",
        tallas: ["S", "M", "L", "XL"],
    },
    {
        id: 2,
        nombre: "Pijama Algodón Nubes",
        precio: 74900,
        precioOriginal: null,
        imagen: "/imagenes/Producto2.jpg",
        etiqueta: "Hot Sale",
        descripcion: "Pijama de algodón 100% premium con estampado de nubes. Comodidad garantizada.",
        tallas: ["XS", "S", "M", "L"],
    },
    {
        id: 3,
        nombre: "Conjunto Loungewear Lila",
        precio: 99900,
        precioOriginal: 129900,
        imagen: "/imagenes/Producto3.jpg",
        etiqueta: "Nuevo",
        descripcion: "Conjunto loungewear en color lila con detalles de seda. Ideal para trabajar en casa.",
        tallas: ["S", "M", "L"],
    },
    {
        id: 4,
        nombre: "Camisa Noche Bordada",
        precio: 65900,
        precioOriginal: null,
        imagen: "/imagenes/Producto4.jpg",
        etiqueta: null,
        descripcion: "Camisa de noche con bordados florales artesanales. Elegante y confortable.",
        tallas: ["XS", "S", "M", "L", "XL"],
    },
    {
        id: 5,
        nombre: "Pijama Invierno Cálido",
        precio: 109900,
        precioOriginal: 149900,
        imagen: "/imagenes/Producto5.jpg",
        etiqueta: "Descuento",
        descripcion: "Pijama polar de invierno con forro suave. Máxima calidez sin sacrificar el estilo.",
        tallas: ["S", "M", "L"],
    },
    {
        id: 6,
        nombre: "Set Corto Verano Gloss",
        precio: 59900,
        precioOriginal: null,
        imagen: "/imagenes/Producto6.jpg",
        etiqueta: "Nuevo",
        descripcion: "Set corto veraniego en tela fresca y ligera. La opción perfecta para el calor.",
        tallas: ["XS", "S", "M"],
    },
];
