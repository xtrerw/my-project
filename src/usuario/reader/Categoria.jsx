import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./Categoria.css"
const Categoria = () => {
  //conseguir las categorias de libros
  const { categoriaId, subcategoriaId } = useParams();
  //set categoria
  const [categoria, setCategorias] =useState(null)
  //set libros
  const [libros,setLibros] = useState(null)
  //conseguir las categorias desde mango db
  useEffect(()=>{
    fetch(`http://localhost:5001/categorias/${categoriaId}`)
    .then(response=>response.json())
    .then(resulta=>{
        setCategorias(resulta.categoria); 
        setLibros(resulta.libros);
    })
    .catch(error => console.error("Error al obtener categorias:", error));
  },[categoriaId])

  if (!categoria || !libros) return <p>Cargando...</p>;

  return (
    <>
      <div>
        {libros
        //filtrar todos los libros que cumple con las condiciones
        .filter(libro => libro.colleccion.includes(subcategoriaId))
        .map((libro, index) => (
          //acceder a contenido del libro
          <Link to={`/Libros/${libro._id}`} className='libro-categoria' key={index}>
            <img src={`http://localhost:5173/${libro.img}`} alt={libro.titulo} />
            <h2>{libro.titulo}</h2>
            <p>{libro.precio} €</p>
          </Link>
        ))}
      </div>
    </>
  )
}

export default Categoria