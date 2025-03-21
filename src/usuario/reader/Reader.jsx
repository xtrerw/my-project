import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Reader.css"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
function Reader() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
   fetch('http://localhost:5001/libros')
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
      markers:true,
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

  return (
    <div>
      <div className='parte-titulo'>
        <div className='parte-primero'>
          <h1 className='titulo dancing-script'>No dejes que tus sueños se ahoguen en la multitud</h1>
        </div>
      </div>
      <div className='parte-top-ventas'>
        <div className='titulo-top-ventas dancing-script'>
          <h1>Top Ventas</h1>
          <h2>Leer no es solo pasar páginas, es encender la mente. No dejes que la historia que cambiará tu vida se quede en la estantería.</h2>
        </div>
        {libros.map((libro, index) => (
          <Link key={index} to={`/Libros/${libro._id}`} className='libros'>
            <img src={libro.img} alt="" className='img-libros' />
            {/* <h3>{libro.titulo}</h3> */}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Reader; 