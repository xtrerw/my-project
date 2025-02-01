import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Reader.css"
function Reader() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
   fetch('http://localhost:5001/libros')
    .then(response=>response.json())
    .then(libro=>{
      setLibros(libro)
    })
  }, []);

  return (
    <div className='parte-titulo'>
      <h1 className='titulo'>La Plataform de Lector</h1>
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