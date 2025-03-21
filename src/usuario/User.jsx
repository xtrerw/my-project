import { Routes, Route, Link } from "react-router-dom";
import Reader from "./reader/Reader";
import Author from "./autor/Author";
import PaginaAuthor from "./autor/PaginaAuthor";
import Contenido from "./reader/Contenido";
import { useState,useEffect } from "react";
import "./User.css";
import Categoria from "./reader/Categoria";
import tunkIcon from "../img/tunk-icon.jpg";

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
//componente principal
const User = () => {
  // categoria activa para reader
  const [activeCategory, setActiveCategory] = useState(null);

  //dividir las paginas de autores y lectores
  const [isAuthor, setIsAuthor] = useState(() => {
    return localStorage.getItem("isAuthor") === "true"; //si es true es author
  });
  //guardar el estado de isAuthor en local storage
  useEffect(() => {
    localStorage.setItem("isAuthor", isAuthor);
  }, [isAuthor]);

  // items del menu para author
  // const arrayItemsMenuAuthor=["Registro","Mis Libros","Ventas","Modelo de Escribir"]

  return (
    <>
      {/* menu */}
      <header>
        {/* icon de home */}
        <Link to="/" onClick={()=>setIsAuthor(false)}>
          <img src={tunkIcon} alt="" className="tunk-icon" />
        </Link> 
        {isAuthor ? null : (
          // menu de reader
          <nav className="menu">
            {categorias.map((categoria, index) => (
              <div
                key={index}
                className="menu-item"
                onMouseEnter={() => setActiveCategory(index)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link to={`/${categoria.nombre}`}>{categoria.nombre}</Link>

                {/* menu desplada */}
                {activeCategory === index && (
                  <div className="dropdown">
                    {categoria.colleccion.map((subitem, subIndex) => (
                      <Link key={subIndex} to={`/${categoria.nombre}/${subitem}`} className="dropdown-item">
                        {subitem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
        <button className="dancing-script" onClick={() => setIsAuthor(!isAuthor)}>
          {isAuthor ? 
          <Link to="/">Reader</Link> : 
          <Link to="/Author">Author</Link>
          }
        </button>
      </header>
      
      {/* main */}
      <main>
        <Routes>
          
          <Route path="/Author" element={<Author />} /> 
          <Route path="/" element={<Reader />} />
          {/* tipo de libros para author */}
          <Route path="/Registro" element={<Author />} />
          <Route path="/Author/:id" element={<PaginaAuthor />} />
          <Route path="/Libros/:id" element={<Contenido />} />

          {/* router de subitem */}
          {/* {categorias.map((categoria, index) =>
            categoria.colleccion.map((subitem, subIndex) => (
              <Route key={`${index}-${subIndex}`} path={`/${categoria.nombre}/${subitem}`} element={<Categoria />} />
            ))
          )} */}
           <Route path="/:categoriaId" element={<Categoria />} />
           <Route path="/:categoriaId/:subcategoriaId" element={<Categoria />} />
        </Routes>
      </main>

      {/* footer */}
      <footer>
        <p>Share and discover amazing stories!</p>
      </footer>
    </>
  );
};

export default User