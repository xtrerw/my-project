import React, { useState, useEffect } from 'react';
import Author from './Author';
// import './MisLibros.css'; // Asegúrate de tener un archivo CSS para estilos
import '../../style/libro.css'; // Asegúrate de tener un archivo CSS para estilos
import { Link } from 'react-router-dom';
const MisLibros = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  // libros
  const [libros, setLibros] = useState(null);
  useEffect(() => {
    // comprobar si el usuario está autenticado
    const id = localStorage.getItem("userId");

    if (id) {
      setIsLoggedIn(true);
      setUserId(id);
    }

    if(id){
      // Fetch libros del autor desde el backend
      fetch(`http://localhost:5001/misLibros/${id}`)
        .then(response => response.json())
        .then(data => {
          setLibros(data);
          console.log(data);
          
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

  }, []);



  return (
    <>
      {isLoggedIn ? (
        <div className="mis-libros-container">
          {/* Aquí puedes mostrar los libros del autor */}
          {libros && libros.length > 0 ? (
            libros.map((libro, index) => (
              <Link to={`/Libros/${libro._id}`} key={index} className="libro-item">
                <img src={`${libro.img}`} alt={libro.titulo} />
                <h2>{libro.titulo}</h2>
                <p>{libro.precio} €</p>
              </Link>
            ))
          ) : (
            <p>No tienes libros disponibles.</p>
          )}
        </div>
      ) : (
        <Author />
      )}
    </>
  );
}

export default MisLibros;

