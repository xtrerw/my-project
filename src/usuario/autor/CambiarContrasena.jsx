import React from 'react'
import { useEffect,useState } from 'react'
import './CambiarContrasena.css'
import { validatePassword } from '../../utils/validatePassword'
const CambiarContrasena = () => {
  // Estado inicial del formulario con campos vacíos
  const [formData, setFormData] = useState({
    nuevaContrasena: "",
    confirmaPassword: ""
  });

  //Si hay error
   const [error, setError] = useState(false);
  // Contenido de error de contraseña
  const [errorPassword, setErrorPassword] = useState();
 
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
    
    // Validar que la nueva contraseña y la confirmación coincidan
    const errorPassword = validatePassword(formData.nuevaContrasena, formData.confirmaPassword);
    if (errorPassword) {
      setError(true);
      setErrorPassword(errorPassword);
      return;
    }

    if (userId) {
      fetch(`http://localhost:5001/autor/password/${userId}`, {
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
        setError(false);
        // Aquí puedes manejar la respuesta del servidor después de actualizar la contraseña
        setErrorPassword("Contraseña actualizada:", data);
      })
      .catch(error => {
        setError(true);
        setErrorPassword("Error al actualizar la contraseña:", error);
      });
    }
  };

  return (
    <div className="editar-informacion">
      <h1>Cambiar Contraseña</h1>
      <form className="editar-form" onSubmit={handleSubmit}>
          <div className='cambiar-password-container'>
            <label className='cambiar-password'>
                Nueva Contraseña:
                <input className={error? "error-input": ""} name="nuevaContrasena" type='password' value={formData.nuevaContrasena} onChange={handleChange} />
              </label>
              <label className='cambiar-password'>
                Confirma Contraseña:
                <input className={error? "error-input": ""} name="confirmaPassword" type='password' value={formData.confirmaPassword} onChange={handleChange} />
              </label>
          </div>
          <div className="error-message">{errorPassword}</div>
        <button type="submit" className="guardar-btn">Cambiar Contraseña</button>
      </form>
    </div>
  )
}

export default CambiarContrasena

