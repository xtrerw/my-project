import { Routes, Route, Link } from "react-router-dom";
import Reader from "./Reader";
import Author from "./Author";
import Subir from "./Subir";
import Contenido from "./Contenido";
import { useState } from "react";
import "./User.css";
import Categoria from "./Categoria";
import tunkIcon from "../img/tunk-icon.jpg";
const User = () => {
    //dividir las paginas de autores y lectores
    const [isAuthor, setIsAuthor] = useState(false)
    // items del menu
    const arrayItemsMenu=["Imprescindibles","Ficción","No Ficción","Cómic y Manga"]

  
  return (
    <>
      {/* menu */}
      <header>
        {/* icon de home */}
        <Link to="/" onClick={()=>setIsAuthor(false)}>
          <img src={tunkIcon} alt="" className="tunk-icon" />
        </Link> 
        {isAuthor? 
          null :
          <div className="menu">
            {arrayItemsMenu.map((item,index)=>(
              <Link className="menu-item" key={index} to={`/${item}`}>{item}</Link>
            ))}
          </div>
        }
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