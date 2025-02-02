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

    // animacion del main
    gsap.registerPlugin(ScrollTrigger)
    useGSAP(()=>{
      ScrollTrigger.create({
        trigger: "header",
        animation:
        gsap.timeline().fromTo(".parte-titulo",{
          filter:"grayscale(50%) blur(2px)",
          y:10,
        },{
          duration: 1,
          ease: "sine.inOut",
          filter:"grayscale(0%) blur(0px)",
          y:0,
        }).fromTo(".titulo",{
          textShadow:"0px 0px 0px rgba(0, 0, 0, 0.5)",
          opacity:0,
          y:10,
          color:"rgb(0, 255, 94)",
        },{
          textShadow:"5px 5px 2px rgb(101, 98, 0)",
          opacity:1,
          duration: 2,
          ease: "expo.inOut",
          y:0,
          color:"rgba(255,215,0)"
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
      <div>
        {libros.map((libro, index) => (
          <Link key={index} to={`/Libros/${libro._id}`}>
            <img src={libro.img} alt="" />
            <h3>{libro.titulo}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Reader; 