import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./Categoria.css"
import '../../style/libro.css' // Asegúrate de tener un archivo CSS para estilos
import NotFound from '../NotFound'
import Cargando from '../../utils/Cargando'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ChevronUp, ChevronDown, Star } from 'lucide-react';
import { useUser } from '../../context/UserContext'

const Categoria = () => {
  //conseguir las categorias de libros
  const { categoriaId, subcategoriaId } = useParams();
  //set categoria
  const [categoria, setCategorias] =useState(null)
  //set libros
  const [libros,setLibros] = useState(null)
  //sidebar de libros
  const [showRating, setShowRating] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  // conseguir usuario
  const {user}=useUser();
  //buscador
  const [searchTerm, setSearchTerm] = useState("");


  //conseguir las categorias desde mango db
  useEffect(()=>{
    fetch(`http://localhost:5001/libros/categorias/${categoriaId}`)
    .then(response=>response.json())
    .then(resulta=>{
      console.log(" Resultado de backend:", resulta.categoria);
        setCategorias(resulta.categoria); 
        setLibros(resulta.libros);
    })
    .catch(error => console.error("Error al obtener categorias:", error));
  },[categoriaId])

  //funcion para comprar libros
  const handleComprar = (libro) => {

    fetch("http://localhost:5001/comprar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        libroId: libro._id,
        userId: user._id,
      }),
    })

    .then((response) => {
      if (response.ok) {
        console.log("Compra realizada con éxito");
      } else {
        console.log("Error al realizar la compra");
      }
    })
    .catch((error) => {
      console.error("Error al realizar la compra:", error);
    });
  };

const tituloRef = useRef();
const librosRef = useRef();
const libroRefs=useRef([])
//registro de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
//titulo
useGSAP(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  if (!tituloRef.current || !librosRef.current || !libroRefs.current.length) return;

  //titulos
  ScrollTrigger.create({
    trigger: tituloRef.current,
    animation: gsap.timeline()
      .fromTo(tituloRef.current,{
        backgroundImage:"linear-gradient(to right bottom,#0f0c29, #302b63,var(--text-color))"
      },{
        backgroundImage:"linear-gradient(to right bottom,#0f0c2900, #302b6300)",
        duration: 1, 
        ease: "sine.inOut"
      },"<")
      .fromTo(tituloRef.current.querySelector("h1"), {
        x: -100, opacity: 0
      }, {
        x: 0, opacity: 1, duration: 1, ease: "power1.inOut"
      })
      .fromTo(tituloRef.current.querySelector("p"), {
        y: 100, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 1, ease: "power1.inOut"
      },"<")
      .fromTo(tituloRef.current.querySelector("hr"),{
        width:"0%",opacity:0
      },{
        width:"80%",opacity:1, duration: 1, ease: "power1.inOut"
      },"<")
  });
  //libros
  ScrollTrigger.create({
    trigger:tituloRef.current,
    markers:true,
    scrub:1,
    start:"0% top",
    end:"60% top",
    animation:gsap.timeline()
    .fromTo(librosRef.current,{
      scale:0.8,
      borderRadius:"30px"
    },{
      scale:1,
      borderRadius:"0"
    })
    .fromTo(librosRef.current.querySelector("aside"),{
      y:30
    },{
      y:0,
    },"<")
    .fromTo(libroRefs.current.filter(Boolean),{
      y:300,
      opacity:0
    },{
      y:0,
      opacity:1,
      stagger:0.2
    },"<")
  })
}, { dependencies: [libros, subcategoriaId]  });


  //registro de usuario
  if (!categoria || !libros) return <Cargando />;

  return (
    <>
    <div className='categoria-titulo' ref={tituloRef}>
      <h1> {
        categoria.colleccion.includes(subcategoriaId)
          ? subcategoriaId
          : null
      }</h1>
      <hr />
      <p>¡Hazte Socio! 5% de descuento en libros</p>
    </div>

    <div style={{
      display:"flex",
      justifyContent:"center"
    }} className='categoria-libros' ref={librosRef}>
      {/* fitro de libros */}
     <aside>
          <h2>Filtros</h2>
          {/* Buscador */}
          <div className='filtro-buscador'>
            <h3>Buscador</h3>
            <div className='filtro-buscador-contenedor'>
              <input type="text" 
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value.toLowerCase())}
              />
              <i className="bx bx-search-alt" id='icon-buscador'/>
            </div>
          </div>
          {/* Puntuación */}
          <div className="filtro-bloque">
            <div className="filtro-header" onClick={() => setShowRating(!showRating)}>
              <h3>Puntuación</h3>
              {showRating ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {showRating && (
              <ul>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <li key={stars}>
                    <input type="checkbox" id={`rating-${stars}`} />
                    <label htmlFor={`rating-${stars}`}>
                      {[...Array(stars)].map((_, i) => (
                        <Star key={i} size={25} style={{ color: '#facc15', marginRight: '2px' }} />
                      ))}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Precio */}
          <div className="filtro-bloque">
            <div className="filtro-header" onClick={() => setShowPrice(!showPrice)}>
              <h3>Precio</h3>
              {showPrice ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {showPrice && (
              <ul>
                {['0€ - 8€', '8€ - 14€', '14€ - 19€', '19€ - 25€', '25€ - 50€'].map((range, i) => (
                  <li key={i}>
                    <input type="checkbox" id={`price-${i}`} />
                    <label htmlFor={`price-${i}`}>{range}</label>
                  </li>
                ))}
                
              </ul>
            )}
          </div>
        </aside>

      {/* libros */}
      <div>
        {libros
        //filtrar todos los libros que cumple con las condiciones
         .filter(libro =>
            {
              //verificar la categoria seleccionado si esta coincide a la categoria de los libros
              const coincideSubcategoria = !subcategoriaId || libro.categoria.some(cat => cat.colleccion.includes(subcategoriaId));
              //verificar los texto insertados si esta coincide al nombre de libros,"" es para evitar fallback de undefine
              const coincideBusqueda = libro.titulo.toLowerCase().includes(searchTerm) || "";
              return coincideSubcategoria && coincideBusqueda;
            }
          )
        .map((libro, index) => (
            <div key={index} ref={el => libroRefs.current[index] = el} className='categoria-libro'>
              <Link to={`/Libros/${libro._id}`} className='libro-item'>
                <img src={`${libro.img}`} alt={libro.titulo} />
                <h2>{libro.titulo}</h2>
                <h3>{libro.autorID?.nombre} {libro.autorID?.apellido}</h3>
                <p>{libro.precio} €</p>
              </Link>
              <div className='categoria-libro-cantidad'>
                <div onClick={() => handleComprar(libro)}>Comprar</div>
              </div>
            </div>
        ))}
      </div>
    </div> 
      
      
    </>
  )
}

export default Categoria