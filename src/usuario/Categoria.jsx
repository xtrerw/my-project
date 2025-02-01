import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./Categoria.css"
const Categoria = () => {
  //conseguir las categorias de libros
  const {id}=useParams()
  //set categoria
  const [categoria, setCategorias] =useState(null)
  //set libros
  const [libros,setLibros] = useState(null)
  //set collections
  const [collections, setCollections] = useState([])
  //conseguir las categorias desde mango db
  useEffect(()=>{
    fetch(`http://localhost:5001/categorias/${id}`)
    .then(response=>response.json())
    .then(resulta=>{
        setCategorias(resulta.categoria); 
        setLibros(resulta.libros);
        setCollections(resulta.categoria.colleccion[0]);
    })
    .catch(error => console.error("Error al obtener categorias:", error));
  },[id])

  if (!categoria || !libros) return <p>Cargando...</p>;
  console.log(libros);
  
  return (
    <>
      <select onChange={e=>setCollections(e.target.value)}>
      {categoria.colleccion.map((c, index) => (
        <option key={index} value={c}>{c}</option>
      ))}
      </select>
      <div>
        {libros
        //filtrar todos los libros que cumple con las condiciones
        .filter(libro => libro.colleccion.includes(collections))
        .map((libro, index) => (
          //acceder a contenido del libro
          <Link to={`/Libros/${libro._id}`} className='libro-categoria' key={index}>
            <img src={`${libro.img}`} alt="" />
            <h2>{libro.titulo}</h2>
          </Link>
        ))}
      </div>
    </>
  )
}

export default Categoria