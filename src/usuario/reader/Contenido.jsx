import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../../style/contenido.css' // Asegúrate de tener un archivo CSS para estilos
import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from 'gsap/all';
const Contenido = () => {
    const {id}=useParams()
    
    const [contenidos,setContenidos]=useState([])
    //conseguir los contenidos de los libros
    useEffect(()=>{
        fetch(`http://localhost:5001/libros/libros/${id}`)
        .then(response=>response.json())
        .then(resulta=>{
            setContenidos(resulta)
            console.log(resulta);
        })
        .catch(error => console.error("Error al obtener contenido:", error)); 
    },[id])


    gsap.registerPlugin(ScrollTrigger);
    // animacion del contenido
    useGSAP(() => {
      ScrollTrigger.create({
        trigger: ".contenido-item", 
        markers: true,
        start: "0% 100%", 
        end: "0% 100%",
        animation: 
        gsap.timeline()
          .fromTo(".contenido-texto", {
            opacity: 0.3,
            fontWeight: "lighter",
          }, {
            opacity: 1,
            fontWeight: "bolder",
            ease: "circ",
            stagger: 0.001,
          }) 
      });
    },[contenidos]); // Dependencia para que se ejecute cuando cambie el contenido
      
    
    if (!contenidos || contenidos.length === 0) return <p>Cargando...</p>;

  return (
    <div className="contenido-container">
      {contenidos.map((contenido, index) => (
        <div
          key={index}
          className="contenido-item"
        >
          <h1 className="contenido-titulo">{contenido.titulo}</h1>
          {/* muestrar contenido*/}
          {contenido.contenido.split("").map((item, index) => (
            <span key={index} className="contenido-texto">{item}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Contenido