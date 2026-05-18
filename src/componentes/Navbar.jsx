const Navbar = () => {

  return(

    <header className="barraNavegacion">

      <div className="nav-izquierda">

        <img src="public/iconos/logo.png"  />

      </div>

      <nav className="nav-centro">
        <a href="#">Hombre</a>
        <a href="#">Mujer</a>
        <a href="#">Accesorios</a>
        <a href="#">Ofertas</a>
      </nav>

      <div className="nav-derecha">

        <input
          type="text"
          placeholder="Buscar..."
          className="buscador"
        />

        <button>🔍</button>

        <span>👤</span>

        <span>🛒</span>

      </div>

    </header>

  );

}

export default Navbar;