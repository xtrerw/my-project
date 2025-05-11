import { Routes, Route, Link, useLocation } from "react-router-dom";
import Reader from "./reader/Reader";
import Login from "./autor/Login";
import Contenido from "./reader/Contenido";
import { useState,useEffect } from "react";
import "./User.css";
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

 //categorias para readers
 const categorias = [
  {
    nombre: "Imprescindibles",
    colleccion: ["Más vendidos", "Todos los libros", "Recomendados"]
  },
  {
    nombre: "Ficción",
    colleccion: ["Romántica y erótica", "Negra", "Histórica", "Fantástica", "Ciencia ficción", "Terror", "Humor", "Viajes"]
  },
  {
    nombre: "No Ficción",
    colleccion: ["Ciencias y tecnología", "Humanidades", "Arte", "Filología", "Historia"]
  },
  {
    nombre: "Cómic y Manga",
    colleccion: ["Libros de ilustración", "Cómic de humor", "Historia y técnica", "Manga"]
  }
];
// menu para autores
const menuAutor = [
  {nombre: "Mis Datos",},
  {nombre: "Mis Libros",},
  {nombre: "Ventas",
    subItems: [
      { item: "Mis Ventas", },
      { item: "Historial de Compras", },
    ],
  },
  {nombre: "Modelo de Escribir",
    subItems: [
      { item: "Subir Mi Libro Completo", },
      { item: "Escribir Online", },
    ],
  }
]
//componente principal
const User = () => {
  //conseguir el estado de autenticación del usuario
  const {user}=useUser();
  // categoria activa para reader
  const [activeCategory, setActiveCategory] = useState(null);

  //dividir las paginas de autores y lectores
  const [isAuthor, setIsAuthor] = useState(false);
  //pagina de inicio de sesión
  const location=useLocation();
  const isLoginPage = location.pathname === "/login";
  //comprobar si el usuario es autor o lector
  useEffect(() => {
    if (user) {
      setIsAuthor(user.tipo=== "autor");
    }
  }, [user]);
  


  return (
    <>
      {/* menu */}
      <header>
        {/* icon de home */}
        <Link to="/" onClick={()=>setIsAuthor(false)}>
          <img src={tunkIcon} className="tunk-icon" />
        </Link> 
        {!isLoginPage && ( isAuthor ? 
         // menu de autor
         ( <nav className="menu">
          {menuAutor.map((item, index) => (
            <div
              key={index}
              className="menu-item"
              onMouseEnter={() => setActiveCategory(index)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {/* menu principal */}
              {/* para evitar saltar a otras páginas por item principal sin subitem */}
              {item.subItems ? (
                <div className="menu-link">{item.nombre}</div>
              ) : (
                <Link to={`/Author/${item.nombre}`} className="menu-link">
                  {item.nombre}
                </Link>
              )}
    
              {/* submenu */}
              {item.subItems && activeCategory === index && (
                <div className="dropdown">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={`/Author/${item.nombre}/${subItem.item}`}
                      className="dropdown-item"
                    >
                      {subItem.item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>) : (
          // menu de reader
          <nav className="menu">
            {categorias.map((categoria, index) => (
              <div
                key={index}
                className="menu-item"
                onMouseEnter={() => setActiveCategory(index)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {/* menu principal */}
                <div to={`/${categoria.nombre}`}>{categoria.nombre}</div>

                {/* menu desplada */}
                {activeCategory === index && (
                  <div className="dropdown">
                    {categoria.colleccion.map((subitem, subIndex) => (
                      <Link key={subIndex} to={`/${categoria.nombre}/${subitem}`} className="dropdown-item" >
                        {subitem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        ))}
        <button className="dancing-script btn-login">
        {
          // si el usuario no está autenticado o está en la página de inicio de sesión
          !user || isLoginPage ? (
            <Link to="/login">Iniciar Sesión</Link>
          ) : 
          // si el usuario es autor
          user.tipo === "autor" ? (
            isAuthor ? (
              <p>Bienvenido {user.usernombre}</p>
            ) : (
              <Link to="/login">Iniciar Sesión</Link>
            )
          ) : 
          // si el usuario es lector
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
      
      {/* main */}
      <main className="main-content">
        {/* rutas */}
        <Routes>
          
          <Route path="/login" element={<Login />} /> 
          <Route path="/" element={<Reader />} />
          {/* router para author */}
          {/* 1 -（Mis Datos, Mis Libros, Ventas, Modelo de Escribir） */}
          <Route path="/Author/Mis Datos/*" element={<MisDatos />} />
          <Route path="/Author/Mis Libros" element={<MisLibros />} />

          {/* 2 - Ventas */}
          
          <Route path="/Author/Ventas/Mis Ventas" element={<MisVentas />} />
          <Route path="/Author/Ventas/Historial de Compras" element={<HistorialCompras />} />

          {/* 2 - Modelo de Escribir */}
          
          <Route path="/Author/Modelo de Escribir/Subir Mi Libro Completo" element={<SubirLibro />} />
          <Route path="/Author/Modelo de Escribir/Escribir Online" element={<EscribirOnline />} />

          {/* Lector */}
          {/* router de libros */}
          <Route path="/Libros/:id" element={<Contenido />} />
          {/* router de subitem */}
           <Route path="/:categoriaId/:subcategoriaId" element={<Categoria />} />
          {/* router de perfil de lector */}
          <Route path="/Perfil de lector" element={<PerfilReader />} /> 

          {/* 404 not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* footer */}
      <footer>
      {/* categoría */}
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

      {/* linea devisoria */}
      <div className="footer-divider"></div>

      {/* imformación debaja */}
      <div className="footer-bottom">
        <p>COPYRIGHT © 2024 TunkBooks. Todos los derechos reservados.</p>

        <div className="footer-links">
          <Link to="/aviso-legal">Aviso Legal</Link> | 
          <Link to="/politica-privacidad">Política de Privacidad</Link> | 
          <Link to="/cookies">Cookies</Link>
        </div>

        {/* red social */}
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

export default User