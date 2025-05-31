import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Cargando from '../utils/Cargando';
const OcultarLibros = () => {
    //conseguir id de autor
    const {id}= useParams();
    //conseguir los libros de un autor
    const [libros, setLibros] = useState([]);
    //cargando
    const [loading, setLoading] = useState(true);
    //conseguir los libros de un autor
    useEffect(() => {
        setLoading(true);
    // Realizar la petición a la API para obtener los libros del autor
        fetch(`http://localhost:5001/ocultarLibros/ocultarLibros/${id}`)
            .then(response => response.json())
            .then(data => {
                setLibros(data);
                // Desactivar el indicador de carga después de obtener los datos
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener los libros:", error);
            });
    }, [id]);



    // Si está cargando, mostrar un mensaje de carga
    if (loading) return <Cargando />;
  return (
    <div>
        <h1>Libros del Autor</h1>
         {libros.length > 0 ? (
        <div className="mis-libros-container">
          {libros.map(libro => (
            <div className="libro-item" key={libro._id}>
              <img src={libro.img || "https://via.placeholder.com/300x300"} alt={libro.titulo} />
              <h2>{libro.titulo}</h2>
              <h3>Autor: {libro.autorID ? `${libro.autorID.nombre} ${libro.autorID.apellido}` : "Desconocido"}</h3>
              <button type='button'>Ocultar su libro</button>
              <button type='button'>Muestrar su libro</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron libros para este autor.</p>
      )}
    </div>
  )
}

export default OcultarLibros
