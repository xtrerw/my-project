import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import './GestionCuenta.css'
const GestionLector = () => {
  //conseguir la lista de usuarios
  const [usuarios, setUsuarios] = useState([])
  //conseguir la lista de usuarios
  useEffect(() => {
    fetch("http://localhost:5001/usuario/listado")
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(data)
        console.log(data);
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  //actualizar el estado de un usuario
  const handleChange = (id, newActivo) => {
    setUsuarios((preUsers) =>
      preUsers.map((user) => {
        if (user._id === id) {
          return { ...user, activo: newActivo };
        }
        return user;
      })
    );
  }
  //activar o desactivar usuario
  const handleSubmit = (e,usuario) => {
    e.preventDefault()
    fetch(`http://localhost:5001/admin/actualizarLector/${usuario._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({activo: usuario.activo}),
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
    <div className="contenedor-cards">
      {/* conseguir todos usuarios */}
      {usuarios.map((usuario) => (
        <form key={usuario._id} onSubmit={(e)=>handleSubmit(e,usuario)} className='card-usuario' >
          <h2>{usuario.nombre} {usuario.apellido}</h2>
          <p>usuario: {usuario.usernombre}</p>
          <select name="activo" id="" 
          value={usuario.activo}
          // 
          onChange={(e) => 
            handleChange(
              usuario._id, 
            //convertir el valor a booleano
            e.target.value=== "true"
            )}>
            <option value="true">activo</option>
            <option value="false">inactivo</option>
          </select>
          <button type="submit">actualizar</button>
          {/* btn eliminar */}
          <button className='btn-eliminar'>Eliminar</button>
        </form>
      ))}
    </div>
  )
}

export default GestionLector
