import React, { useState, useEffect } from 'react';
import './EditarInformacion.css'; // Asegúrate de tener este archivo CSS para estilos
const EditarInformacion = () => {
  // Estado inicial del formulario con campos vacíos
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    direccion: "",
    codigoPostal: "",
    provincia: "",
    pais: "",
    nacionalidad: "",
    sexo: "",
    email: ""
  });

  // Cargar datos del usuario desde la API cuando el componente se monta
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetch(`http://localhost:5001/autor/${userId}`)
        .then(response => response.json())
        .then(data => {
          setFormData({
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.slice(0,10) : "",
            direccion: data.direccion || "",
            codigoPostal: data.codigoPostal || "",
            provincia: data.provincia || "",
            pais: data.pais || "",
            nacionalidad: data.nacionalidad || "",
            sexo: data.sexo || "",
            email: data.email || ""
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

  return (
    <div className="editar-informacion">
    <h2>Editar Información</h2>
    <form className="editar-form">
      <div className="form-row">
        <label>
          Nombre:
          <input name="nombre" value={formData.nombre} onChange={handleChange} />
        </label>
        <label>Apellido:
          <input name="apellido" value={formData.apellido} onChange={handleChange} />
        </label>
        <label>Sexo:
          <select name="sexo" value={formData.sexo} onChange={handleChange}>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>Fecha de Nacimiento:
          <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
        </label>
        <label>Nacionalidad:
          <input name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} />
        </label>
      </div>

      <div className="form-row">
        <label>Provincia:
          <input name="provincia" value={formData.provincia} onChange={handleChange} />
        </label>
        <label>País:
          <input name="pais" value={formData.pais} onChange={handleChange} />
        </label>
      </div>

      <div className="form-row">
        <label>Dirección:
          <input name="direccion" value={formData.direccion} onChange={handleChange} />
        </label>
        <label>Código Postal:
          <input name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} />
        </label>
      </div>

      <div className="form-row-full">
        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
      </div>

      <button type="submit" className="guardar-btn">Guardar Cambios</button>
    </form>
  </div>
  );
}

export default EditarInformacion;