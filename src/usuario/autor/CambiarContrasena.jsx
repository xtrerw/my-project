import React from 'react'
import { useEffect } from 'react'
const CambiarContrasena = () => {
  // Estado inicial del formulario con campos vacíos
  const [formData, setFormData] = React.useState({
    usuario: "",
    nuevaContrasena: ""
  });

  useEffect(() => {
    // Cargar datos del usuario desde la API cuando el componente se monta
    const userId = localStorage.getItem("userId");
    console.log("userId", userId);
    
    if (userId) {
      fetch(`http://localhost:5001/autor/${userId}`)
        .then(response => response.json())
        .then(data => {
          setFormData({
            usuario: data.usernombre || "",
          });
        })
        .catch(error => {
          console.error("Error al obtener datos del usuario:", error);
        });
    }
  }, []);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const userId = localStorage.getItem("userId");
    console.log("userId", userId);
    
    if (userId) {
      fetch(`http://localhost:5001/autor/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contrasena: formData.nuevaContrasena
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log("Contraseña actualizada:", data);
      })
      .catch(error => {
        console.error("Error al actualizar la contraseña:", error);
      });
    }
  };

  return (
    <div className="editar-informacion">
      <h1>Cambiar Contraseña</h1>
      <form className="editar-form" onSubmit={handleSubmit}>
          <label>
            Usuario :{formData.usuario}
          </label>
          <label>
            Nueva Contraseña:
            <input name="password" value="" onChange={handleChange} />
          </label>
          <label>
            Confirma Contraseña:
            <input name="confirmaPassword" value="" onChange={handleChange} />
          </label>
        <button type="submit" className="guardar-btn">Cambiar Contraseña</button>
      </form>
    </div>
  )
}

export default CambiarContrasena

