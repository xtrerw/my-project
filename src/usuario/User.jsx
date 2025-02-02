import { Routes, Route, Link } from "react-router-dom";
import Reader from "./Reader";
import Author from "./Author";
import Subir from "./Subir";
import Contenido from "./Contenido";
import { useState } from "react";
import "./User.css";
import Categoria from "./Categoria";

const User = () => {
    //dividir las paginas de autores y lectores
    const [isAuthor, setIsAuthor] = useState(false)
    // items del menu
    const arrayItemsMenu=["Imprescindibles","Ficción","No Ficción","Cómic y Manga"]

  
  return (
    <>
      {/* menu */}
      <header>
        <Link to="/">
          <h2>Writers Platform</h2>
        </Link> 
        {isAuthor? 
          null :
          <div className="menu">
            {arrayItemsMenu.map((item,index)=>(
              <Link className="menu-item" key={index} to={`/${item}`}>{item}</Link>
            ))}
          </div>
        }
        <button onClick={() => setIsAuthor(!isAuthor)}>
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
          
          <Route path="/Author/:id" element={<Subir />} />
          <Route path="/Libros/:id" element={<Contenido />} />

          {/* tipo distintos de libros */}
          {arrayItemsMenu.map((item,index)=>(
          <Route key={index} path={`/:id`} element={<Categoria />} />
          ))}
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