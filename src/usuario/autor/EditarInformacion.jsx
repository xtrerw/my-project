import React, { useState, useEffect } from 'react';
import './EditarInformacion.css'; // Asegúrate de tener este archivo CSS para estilos
import DatePicker from 'react-datepicker'; // Si necesitas un selector de fecha más avanzado
import "react-datepicker/dist/react-datepicker.css"; // Estilos para el DatePicker
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es"; // Importa el locale español

registerLocale("es", es); // Registra el locale español
const EditarInformacion = ({onSuccess}) => {
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
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
    console.log("userId", userId);
    
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
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Datos actualizados:", data);
          if (onSuccess) {
            onSuccess(); // Llama a la función de éxito pasada como prop y actualiza el estado en el componente padre <MisDatos />
          }
        })
        .catch(error => {
          console.error("Error al actualizar datos:", error);
        });
    }
  };

  return (
    <div className="editar-informacion">
      <h1>Editar Información</h1>
      <form className="editar-form" onSubmit={handleSubmit}>
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
            <DatePicker
              locale="es" // Idioma español
              selected={fechaNacimiento}
              onChange={(date) => {
                setFechaNacimiento(date);
                setFormData({ ...formData, fechaNacimiento: date.toISOString().split("T")[0] });
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
              className="input-text"
              calendarClassName="custom-calendar"
              dayClassName={() => "custom-day"}
              renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                // Contenedor del encabezado personalizado del calendario
                <div className="custom-header">
              
                  {/* Muestra el mes y el año actual en español, como "abril 2025" */}
                  <span className="month-label">
                    {date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                  </span>
              
                  {/* Botones para cambiar de mes */}
                  <div className="arrow-buttons">
                    {/* Botón para ir al mes anterior */}
                      <i className='bx bx-left-arrow-alt arrow-button' type="button"  onClick={(e) => { e.preventDefault(); decreaseMonth();}}></i>
                    {/* Botón para ir al mes siguiente */}
                      <i class='bx bx-right-arrow-alt arrow-button' type="button" onClick={(e) => { e.preventDefault(); increaseMonth();}}></i>
                  </div>
                </div>
              )}
            />
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