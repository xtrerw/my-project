import React, { useState, useEffect } from 'react';
import './EditarInformacion.css'; // Asegúrate de tener este archivo CSS para estilos
import DatePicker from 'react-datepicker'; // Si necesitas un selector de fecha más avanzado
import "react-datepicker/dist/react-datepicker.css"; // Estilos para el DatePicker
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es"; // Importa el locale español
import { paises } from '../../utils/paises';
import { validateEditarInformacion } from '../../utils/validateEditarInformacion'; // Importa la función de validación
registerLocale("es", es); // Registra el locale español
const EditarInformacion = ({onSuccess}) => {
    //Si hay error      
    const [errores, setErrores] = useState({});
    // Contenido de error de contraseña
    const [errorInformacion, setErrorInformacion] = useState();
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
  
    // Si hay un userId en el localStorage, realiza la solicitud a la API
    
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
    
    // Validar los campos del formulario    // validar que la informacion no esté vacía
    const errorInform = validateEditarInformacion(formData);
    if (errorInform) {
      setErrores({ [errorInform.campo]: true });
      setErrorInformacion(errorInform.mensaje);
      return;
    }    
    
    if (userId) {
      // Realizar la solicitud PUT a la API para actualizar los datos del usuario
      fetch(`http://localhost:5001/autor/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        // Enviar los datos del formulario como JSON
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
      {/* Campo de nombre con clase de error condicional */}
      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        className={errores.nombre ? "error-input" : ""}
      />
    </label>

    <label>
      Apellido:
      {/* Campo de apellido con clase de error condicional */}
      <input
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        className={errores.apellido ? "error-input" : ""}
      />
    </label>

    <label>
      Sexo:
      {/* Selector de género con clase de error condicional */}
      <select
        name="sexo"
        value={formData.sexo}
        onChange={handleChange}
        className={errores.sexo ? "error-input" : ""}
      >
        <option value="">-- Selecciona tu género --</option>
        <option value="Hombre">Hombre</option>
        <option value="Mujer">Mujer</option>
        <option value="Otro">Otro</option>
      </select>
    </label>
  </div>

  <div className="form-row">
    <label>
      Fecha de Nacimiento:
      {/* DatePicker con clase de error condicional */}
      <DatePicker
        locale="es"
        selected={
          // muestra la fecha de nacimiento anteriormente guardada
          // o null si no hay fecha guardada
          formData.fechaNacimiento
            ? new Date(formData.fechaNacimiento)
            : null
        }
        onChange={(date) => {
          setFormData({
            ...formData,
            // Convertir la fecha de nacimiento a formato ISO
            fechaNacimiento: date
              ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
              : ""
          });
        }}
        dateFormat="dd/MM/yyyy"
        placeholderText="Selecciona una fecha"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        // Añadir clase de error condicional
        className={`input-text ${errores.fechaNacimiento ? "error-input" : ""}`}
        calendarClassName="custom-calendar"
        dayClassName={() => "custom-day"}
        minDate={new Date(1900, 0, 1)}
        maxDate={new Date(2007, 11, 31)}
        renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => {
          const years = Array.from({ length: 2007 - 1900 + 1 }, (_, i) => 1900 + i);
          const months = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
          ];
          return (
            <div className="custom-header">
              {/* Año y mes seleccionables */}
              <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(parseInt(value))}>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select value={date.getMonth()} onChange={({ target: { value } }) => changeMonth(parseInt(value))}>
                {months.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
            </div>
          );
        }}
      />
    </label>

    <label>
      Nacionalidad:
      {/* Selector de nacionalidad con clase de error condicional */}
      <select
        name="nacionalidad"
        value={formData.nacionalidad}
        onChange={handleChange}
        className={errores.nacionalidad ? "error-input" : ""}
      >
        <option value="">-- Selecciona un país --</option>
        {paises.map((pais, index) => (
          <option key={index} value={pais}>{pais}</option>
        ))}
      </select>
    </label>
  </div>

  <div className="form-row">
    <label>
      Provincia:
      {/* Campo de provincia con clase de error condicional */}
      <input
        name="provincia"
        value={formData.provincia}
        onChange={handleChange}
        className={errores.provincia ? "error-input" : ""}
      />
    </label>

    <label>
      País:
      {/* Campo de país con clase de error condicional */}
      <input
        name="pais"
        value={formData.pais}
        onChange={handleChange}
        className={errores.pais ? "error-input" : ""}
      />
    </label>
  </div>

  <div className="form-row">
    <label>
      Dirección:
      {/* Campo de dirección con clase de error condicional */}
      <input
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        className={errores.direccion ? "error-input" : ""}
      />
    </label>

    <label>
      Código Postal:
      {/* Campo de código postal con clase de error condicional */}
      <input
        name="codigoPostal"
        value={formData.codigoPostal}
        onChange={handleChange}
        className={errores.codigoPostal ? "error-input" : ""}
      />
    </label>
  </div>

  <div className="form-row-full">
    <label>
      Email:
      {/* Campo de email con clase de error condicional */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className={errores.email ? "error-input" : ""}
      />
    </label>
  </div>

  {/* Mensaje general de error */}
  <div className="error-message">{errorInformacion}</div>

  {/* Botón para enviar el formulario */}
  <button type="submit" className="guardar-btn">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditarInformacion;