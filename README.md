# Glossé — Tienda Online Unificada

Proyecto React + Vite + SCSS que fusiona el Código A y el Código B en una sola aplicación modular con autenticación y panel Admin.

## Instalación rápida

```bash
npm install
npm run dev
```

---

## Credenciales de prueba (mock)

| Email                 | Contraseña  | Rol   |
|-----------------------|-------------|-------|
| admin@glosse.com      | glosse123   | Admin |
| user@glosse.com       | user123     | User  |

---

## Rutas

| Ruta             | Componente  | Acceso       |
|------------------|-------------|--------------|
| `/`              | Home        | Pública      |
| `/producto/:id`  | PageCard    | Pública      |
| `/login`         | Login       | Pública      |
| `/admin`         | Admin       | Solo Admin   |

---

## Estructura del proyecto

```
src/
├── context/
│   ├── AuthContext.jsx       ← Estado global de autenticación
│   └── ProductosContext.jsx  ← Estado global de productos (reactivo)
│
├── data/
│   ├── productos.js          ← Catálogo inicial
│   └── carruselList.js       ← Slides del carrusel
│
├── pages/
│   ├── Home.jsx              ← Landing page completa
│   ├── PageCard.jsx          ← Detalle de producto (Código B)
│   ├── Login.jsx             ← Formulario de login
│   └── Admin.jsx             ← Panel admin protegido
│
├── componentes/
│   ├── Navbar.jsx            ← Con menú de cuenta y logout
│   ├── Cards.jsx             ← Con Link + carrito + tallas
│   ├── Catalogo.jsx          ← Lee del contexto (tiempo real)
│   ├── Carrusel.jsx
│   ├── Colecciones.jsx
│   ├── Hero.jsx
│   ├── ValueProps.jsx
│   ├── Testimonios.jsx
│   ├── Footer.jsx
│   └── Petalo.jsx
│
├── styles/
│   └── main.scss             ← Todos los estilos unificados
│
├── App.jsx                   ← Router con rutas protegidas
└── main.jsx                  ← Entry: BrowserRouter + Providers
```

---

## Cómo agregar un producto real (reemplazar mock)

En `src/context/ProductosContext.jsx`, reemplaza la función `agregarProducto`:

```js
const agregarProducto = async (nuevoProducto) => {
    const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
    });
    const data = await res.json();
    setProductos((prev) => [data, ...prev]);
    return data;
};
```

## Cómo conectar autenticación real

En `src/context/AuthContext.jsx`, reemplaza la función `login`:

```js
const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
        const data = await res.json();
        setUsuario(data.user);
        return true;
    }
    setError('Credenciales incorrectas.');
    return false;
};
```
