import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
const GestionAutor = () => {

  //conseguir la lista de autores
  const [autores, setAutores] = useState([])
  //conseguir la lista de autores
  useEffect(() => {
    fetch("http://localhost:5001/autor/listado")
      .then((response) => response.json())
      .then((data) => {
        setAutores(data)
        console.log(data);
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  //actualizar el estado de un autor
  const handleChange = (id, newActivo) => {
    setAutores((preAutor) =>
      preAutor.map((autor) => {
        if (autor._id === id) {
          return { ...autor, activo: newActivo };
        }
        return autor;
      })
    );
  }
  //activar o desactivar autor
  const handleSubmit = (e,autor) => {
    e.preventDefault()
    fetch(`http://localhost:5001/admin/actualizarAutor/${autor._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({activo: autor.activo}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  }

    


  return (
    <div>
      {autores.map((autor) => (
        <form key={autor._id} onSubmit={(e)=>handleSubmit(e,autor)} >
          <h2>{autor.nombre}</h2>
          <p>{autor.apellido}</p>
          <p>{autor.usernombre}</p>
          <select name="activo" id="" 
          value={autor.activo}
          // 
          onChange={(e) => 
            handleChange(
              autor._id,
              e.target.value === "true"
            )
          }>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
          <button type='submit'>Actualizar</button>
        </form>
      ))}
    </div>
  )
}

export default GestionAutor
