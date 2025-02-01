import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Contenido = () => {
    const {id}=useParams()
    console.log(typeof(id));
    
    const [contenidos,setContenidos]=useState([])
    //conseguir los contenidos de los libros
    useEffect(()=>{
        fetch(`http://localhost:5001/libros/${id}`)
        .then(response=>response.json())
        .then(resulta=>{
            setContenidos(resulta)
        })
        .catch(error => console.error("Error al obtener contenido:", error)); 
    },[id])
    
  return (
    <div>
       { contenidos.map((contenido,index)=>(
            <p key={index}>
                {contenido.contenido}
            </p>
       ))}
    </div>
  )
}

export default Contenido