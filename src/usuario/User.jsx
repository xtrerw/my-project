import { Routes, Route, Link, useLocation } from "react-router-dom";
import Reader from "./reader/Reader";
import Login from "./autor/Login";
import Contenido from "./reader/Contenido";
import { useState,useEffect } from "react";
import "./User.css";
import "../style/responsive.css"
import Categoria from "./reader/Categoria";
import tunkIcon from "../img/tunk-icon.jpg";
import EscribirOnline from "./autor/EscribirOnline";
import SubirLibro from "./autor/SubirLibro";
import MisLibros from "./autor/MisLibros";
import MisDatos from "./autor/MisDatos";
import MisVentas from "./autor/MisVentas";
import HistorialCompras from "./autor/HistorialCompras";
import PerfilReader from "./reader/PerfilReader";
import NotFound from "./NotFound";
import { useUser } from "../context/UserContext";

// Menú para autores
const menuAutor = [
  {nombre: "Mis Datos",},
  {nombre: "Mis Libros",},
  {nombre: "Modelo de Escribir",
    subItems: [
      { item: "Subir Mi Libro Completo", },
    ],
  }
]

// Componente principal
const User = () => {
  // Estado de categorías
  const [categorias, setCategorias] = useState([]);
  // Obtener las categorías del backend
  useEffect(() => {
    fetch("http://localhost:5001/usuario/categorias")
      .then((response) => response.json())
      .then((data) => {
        setCategorias(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const {user}=useUser();
  // Categoría activa
  const [activeCategory, setActiveCategory] = useState(null);
  // Determina si el usuario es autor
  const [isAuthor, setIsAuthor] = useState(false);
  // Estado del menú responsive (abierto/cerrado)
  const [menuOpen, setMenuOpen] = useState(false);

  const location=useLocation();
  const isLoginPage = location.pathname === "/login";

  // Verifica si el usuario autenticado es autor
  useEffect(() => {
    if (user) {
      setIsAuthor(user.tipo=== "autor");
    }
  }, [user]);

  return (
    <>
      <header>
        {/* icono de inicio */}
        <div className="tunk-icon-responsive">
          <Link to="/" onClick={()=>setIsAuthor(false)}>
            <img src={tunkIcon} className="tunk-icon" />
          </Link> 

          {/* Botón de menú para móviles */}
          <i className="bx bx-menu" onClick={() => setMenuOpen(!menuOpen)}>
          </i>
        </div>
        
        
        {/* Menú principal, dependiendo del tipo de usuario */}
        {!isLoginPage && ( isAuthor ? 
          <nav className={`menu ${menuOpen ? 'open' : ''}`}>
            {menuAutor.map((item, index) => (
              <div
                key={index}
                className="menu-item"
                onMouseEnter={() => setActiveCategory(index)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {/* Menú principal del autor */}
                {item.subItems ? (
                  <div className="menu-link">{item.nombre}</div>
                ) : (
                  <Link to={`/Author/${item.nombre}`} className="menu-link" onClick={() => setMenuOpen(false)}>
                    {item.nombre}
                  </Link>
                )}
                {/* Submenú del autor */}
                {item.subItems && activeCategory === index && (
                  <div className="dropdown">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={`/Author/${item.nombre}/${subItem.item}`}
                        className="dropdown-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        {subItem.item}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        : (
          <nav className={`menu ${menuOpen ? 'open' : ''}`}>
            {categorias.map((categoria, index) => (
              <div
                key={index}
                className="menu-item"
                onMouseEnter={() => setActiveCategory(index)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {/* Nombre de categoría principal */}
                <div>{categoria.nombre}</div>
                {/* Subcategorías desplegables */}
                {activeCategory === index && (
                  <div className="dropdown">
                    {categoria.colleccion.map((subitem, subIndex) => (
                      <Link key={subIndex} to={`/${categoria.nombre}/${subitem}`} className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        {subitem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        ))}

        {/* Botón de login o saludo al usuario */}
        <button className="dancing-script btn-login">
        {
          !user || isLoginPage ? (
            <Link to="/login">Iniciar Sesión</Link>
          ) : 
          user.tipo === "autor" ? (
            isAuthor ? (
              <p>Bienvenido {user.usernombre}</p>
            ) : (
              <Link to="/login">Iniciar Sesión</Link>
            )
          ) : 
          user.tipo === "lector" ? (
            !isAuthor ? (
              <Link to="/Perfil de lector">Bienvenido {user.usernombre}</Link>
            ) : (
              <Link to="/login">Iniciar Sesión</Link>
            )
          ) : (
            <Link to="/login">Iniciar Sesión</Link>
          )
        }
        </button>
      </header>

      <main className="main-content">
        {/* Rutas de navegación */}
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/" element={<Reader />} />
          <Route path="/Author/Mis Datos/*" element={<MisDatos />} />
          <Route path="/Author/Mis Libros" element={<MisLibros />} />
          <Route path="/Author/Ventas/Mis Ventas" element={<MisVentas />} />
          <Route path="/Author/Ventas/Historial de Compras" element={<HistorialCompras />} />
          <Route path="/Author/Modelo de Escribir/Subir Mi Libro Completo" element={<SubirLibro />} />
          <Route path="/Author/Modelo de Escribir/Escribir Online" element={<EscribirOnline />} />
          <Route path="/Libros/:id" element={<Contenido />} />
          <Route path="/:categoriaId/:subcategoriaId" element={<Categoria />} />
          <Route path="/Perfil de lector" element={<PerfilReader />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
      <div className="footer-categories">
        <div className="categories-grid">
          {categorias.map((categoria, index) => (
            <div key={index} className="category-column">
              <h4>{categoria.nombre}</h4>
              {categoria.colleccion.map((subitem, subIndex) => (
                <Link 
                key={subIndex} 
                to={`/${categoria.nombre}/${subitem}`} 
                className="category-link"
                onClick={()=>setIsAuthor(false)}
                >
                  {subitem}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>COPYRIGHT © 2024 TunkBooks. Todos los derechos reservados.</p>

        <div className="footer-links">
          <Link to="/aviso-legal">Aviso Legal</Link> | 
          <Link to="/politica-privacidad">Política de Privacidad</Link> | 
          <Link to="/cookies">Cookies</Link>
        </div>

        <div className="footer-social">
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="Instagram" />
            </a>
            <a href="https://twitter.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384065.png" alt="Twitter" />
            </a>
            <a href="https://linkedin.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384062.png" alt="LinkedIn" />
            </a>
            <a href="https://youtube.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="Youtube" />
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default User;
