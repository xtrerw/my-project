import { Routes, Route, Link } from "react-router-dom";
import Reader from "./Reader";
import Author from "./Author";
import Subir from "./Subir";
import Contenido from "./Contenido";
import { useState } from "react";
import "./User.css";
import Categoria from "./Categoria";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
const User = () => {
    //dividir las paginas de autores y lectores
    const [isAuthor, setIsAuthor] = useState(false)
    // items del menu
    const arrayItemsMenu=["Imprescindibles","Ficción","No Ficción","Cómic y Manga"]

    // animacion del main
    gsap.registerPlugin(ScrollTrigger)
    useGSAP(()=>{
      ScrollTrigger.create({
        trigger: "header",
        markers: true,
        animation:
        gsap.fromTo(".parte-titulo",{
          filter:"grayscale(100%) blur(2px)",
          borderRadius: 0,
          y:10,
          scale:1
        },{
          duration: 1,
          ease: "sine.inOut",
          filter:"grayscale(0%) blur(0px)",
          borderRadius: 20,
          scale:0.95,
          y:0
        })
      })
    })
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
          {isAuthor ? 
            <Route path="/Author" element={<Author />} /> : 
            <Route path="/" element={<Reader />} />
          }
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