import { useState, useEffect,useRef } from 'react';
import { Link } from 'react-router-dom';
import "./Reader.css"
import "../../style/libro.css"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
function Reader() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
   fetch('http://localhost:5001/libros/libros')
    .then(response=>response.json())
    .then(libro=>{
      setLibros(libro)
    })
  }, []);

    // animacion del titulo de parte titulo
    gsap.registerPlugin(ScrollTrigger)
    useGSAP(()=>{
      ScrollTrigger.create({
        trigger: "header",
        animation:
        gsap.timeline().fromTo(".parte-titulo",{
          filter:"grayscale(50%) blur(2px)",
      
        },{
          duration: 1,
          ease: "sine.inOut",
          filter:"grayscale(0%) blur(0px)",
      
        }).fromTo(".titulo",{
          opacity:0,
          y:10,
          x:10,
          color:"var(--text-color3)",
        },{
          opacity:1,
          duration: 1,
          ease: "expo.inOut",
          y:0,
          x:0,
          color:"var(--text-color)"
        },"<")
      })
    })
  // animacion del titulo de parte TOP VENTAS
  useGSAP(()=>{
    ScrollTrigger.create({
      trigger: ".parte-top-ventas",
      markers:false,
      start:"0 60%",
      end:"100% 100%",
      toggleActions:"play none none reverse",
      scrub:false,
      animation:
      gsap.timeline().fromTo(".titulo-top-ventas",{
        opacity:0,
        y:30,
        color:"var(--text-color3)",
      },{
        
        opacity:1,
        duration: 2,
        ease: "expo.inOut",
        y:0,
        color:"var(--text-color)"
      },"<")
    })
  })

  // carousel
const desplazamientoTxt=useRef()
const carouselRef = useRef(); 
// Animación de desplazamiento del texto
const titulosTexto = "Nuestros libros Our books 我们的书籍 私たちの本 우리의 책 ";
const titulos=Array(20).fill(titulosTexto)//repetir el texto 5 veces
useGSAP(() => {
  if (!desplazamientoTxt.current) return;

  gsap.fromTo(
    desplazamientoTxt.current,
    { x: 0 },
    {
      x: "-50%",
      duration: 100,
      ease: "linear",
      repeat: -1
    }
  );
}, []);


 useGSAP(() => {
  // Si el carrusel aún no está disponible o no hay libros, no hacer nada
  if (!carouselRef.current || libros.length === 0) return;

  const track = carouselRef.current; // Contenedor que se moverá horizontalmente
  const slides = track.children;     // Todos los elementos (libros) dentro del carrusel
  const slideCount = slides.length;  // Número total de libros
  const slideWidth = slides[0].offsetWidth + 100; // Ancho de cada libro + espacio (gap de 20px)

  // Animación de GSAP: movimiento horizontal infinito del carrusel
  gsap.to(track, {
    x: `-=${slideWidth * slideCount}`, // Desplazamiento total hacia la izquierda
    duration: slideCount * 2,          // Duración basada en la cantidad de libros (ajusta la velocidad)
    ease: "none",                      // Sin aceleración para desplazamiento constante
    repeat: -1,                        // Repetición infinita
    modifiers: {
      // Modificador para hacer que la animación vuelva al inicio de forma suave y continua
      x: gsap.utils.unitize(x => parseFloat(x) % (slideWidth * slideCount))
    }
  });
}, [libros]); // Se ejecuta cada vez que cambie la lista de libros

// Títulos para el desplazamiento
const titulo2="Convierte tu historia en el próximo gran libro.";
useGSAP(() => {
  ScrollTrigger.create({
    trigger: ".parte-segunda",
    start: "top 50%",
    end: "30% 50%",
    markers: true,
    scrub: 2,
    animation: gsap.fromTo(
      ".parte-segundo-titulo",
      { opacity: 0, 
        y: 10,
        scale:0 },
      { 
        scale: 1,
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        stagger: 1,
        ease: "power1.inOut"
    })
  });
}, []);

  return (
    <div>
      <div className='parte-titulo'>
        <div className='parte-primero'>
          <h1 className='titulo dancing-script'>No dejes que tus sueños se ahoguen en la multitud</h1>
        </div>
      </div>
      <div className='parte-segunda'>
        <div className="desplazamiento-wrapper">
          <div className="desplazamiento-texto" ref={desplazamientoTxt}>
            {titulos.map((titulo, index) => (
              <span key={index} className="titulo-desplazamiento">{titulo}</span>
            ))}
          </div>
        </div>

        {/* titulo */}
        <div className='parte-segundo-titulos'>
          {[...titulo2].map((letra, index) => (
            <span key={index} className='parte-segundo-titulo'>{letra}</span>
          ))}
        </div>
        
        {/* libros */}
        <div className="carousel-container">
          <div className="carousel-track" ref={carouselRef}>
            {libros.map((libro, index) => (
             <div key={index} className="carousel-slide">
                <Link to={`/Libros/${libro._id}`} className="libro-item">
                  <img src={libro.img} alt={libro.titulo} />
                  <h2>{libro.titulo}</h2>
                  <h3>{libro.autorID?.nombre} {libro.autorID?.apellido}</h3>
                  <p>{libro.precio} €</p>
                </Link>
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reader; 