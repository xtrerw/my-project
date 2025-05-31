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


    // Realizar la petición a la API para obtener los libros del autor
    const fetchLibros = () => {
        setLoading(true);
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
        }
    //conseguir los libros de un autor
    useEffect(() => {
       fetchLibros(); // Llamar a la función para obtener los libros
    }, [id]);
    //Ocultar libros
    // Función para ocultar o mostrar un libro
    const toggleOcultarLibro = (libroID, ocultar) => {
    // Mostrar mensaje de confirmación
    const confirmar = window.confirm(
        ocultar ? "¿Está seguro de que desea ocultar este libro?" : "¿Desea mostrar este libro?"
    );
    if (!confirmar) return; // Si el usuario cancela, salir

    // Hacer la solicitud al servidor para cambiar el estado de 'oculto'
    fetch(`http://localhost:5001/ocultarLibros/ocultar/${libroID}`, {
        method: "PUT", // Método HTTP PUT para actualizar
        headers: {
        "Content-Type": "application/json", // Indicamos que el cuerpo es JSON
        },
        body: JSON.stringify({ oculto: ocultar }), // Enviamos el nuevo estado: true o false
    })
        .then((res) => {
        // Verificar si la respuesta es exitosa
        if (!res.ok) {
            throw new Error("Error al actualizar el estado del libro.");
        }
        return res.json(); // Convertir la respuesta a JSON
        })
        .then((data) => {
        fetchLibros(); // Volver a cargar la lista de libros
        })
        .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un problema al actualizar el estado del libro.");
        });
    };
    // Si está cargando, mostrar un mensaje de carga
    if (loading) return <Cargando />;

  return (
    <div>
        <h1>Libros del Autor</h1>
         {libros.length > 0 ? (
        <div className="mis-libros-container">
          {libros.map(libro => (
            <div className={libro.oculto? "libro-item libro-oculto" :"libro-item"} key={libro._id}>
              <img src={libro.img || "https://via.placeholder.com/300x300"} alt={libro.titulo} />
              <h2>{libro.titulo}</h2>
              <h3>Autor: {libro.autorID ? `${libro.autorID.nombre} ${libro.autorID.apellido}` : "Desconocido"}</h3>
              <p>{libro.precio} €</p>
              {libro.oculto?
                (<button type='button' onClick={()=>toggleOcultarLibro(libro._id, false)} className='mostrar'>Muestrar su libro</button>):
                (<button type='button' onClick={()=>toggleOcultarLibro(libro._id, true)} className='ocultar'>Ocultar su libro</button>)}
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
