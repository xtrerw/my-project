import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./Categoria.css"
import '../../style/libro.css' // Asegúrate de tener un archivo CSS para estilos
import NotFound from '../NotFound'
import Cargando from '../../utils/Cargando'
const Categoria = () => {
  //conseguir las categorias de libros
  const { categoriaId, subcategoriaId } = useParams();
  //set categoria
  const [categoria, setCategorias] =useState(null)
  //set libros
  const [libros,setLibros] = useState(null)
  //cantidad de compras
  const [cantidad, setCantidad] = useState(0);
  //id del usuario

  //conseguir las categorias desde mango db
  useEffect(()=>{
    fetch(`http://localhost:5001/libros/categorias/${categoriaId}`)
    .then(response=>response.json())
    .then(resulta=>{
        setCategorias(resulta.categoria); 
        setLibros(resulta.libros);
    })
    .catch(error => console.error("Error al obtener categorias:", error));
  },[categoriaId])

  //funcion para comprar libros
  const handleComprar = (libro) => {
    if (cantidad<=0) return

    fetch("http://localhost:5001/comprar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        libroId: libro._id,
        userId: localStorage.getItem("userId"),
        cantidad: cantidad,
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

  //registro de usuario
  
  if (!categoria || !libros) return <Cargando />;

  return (
    <>
        <div>
        {libros
        //filtrar todos los libros que cumple con las condiciones
        .filter(libro => libro.colleccion.includes(subcategoriaId))
        .map((libro, index) => (
          <div  key={index}>
            <Link to={`/Libros/${libro._id}`} className='libro-item'>
              <img src={`${libro.img}`} alt={libro.titulo} />
              <h2>{libro.titulo}</h2>
              <p>{libro.precio} €</p>
            </Link>
            <div>
              <button onClick={() => 
                {
                  if (cantidad > 0) {
                    setCantidad(cantidad-1)
                  }
                }
              }>-</button>
              <p>{cantidad}</p>
              <button onClick={() => setCantidad(cantidad+1)}>+</button>
              <button onClick={()=> handleComprar(libro)}>Comprar</button>
            </div>
          </div>
        ))}
      </div>
      
    </>
  )
}

export default Categoria