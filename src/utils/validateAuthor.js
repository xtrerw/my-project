// validateAuthor.js
// Función para validar campos del formulario de registro de autor

export const validateAuthor = (formData) => {
    // Validar username obligatorio
    if (!formData.username || !formData.username.trim()) {
      return { campo: "username", mensaje: "El nombre de usuario es obligatorio." };
    }
  
    // Validar nombre
    if (!formData.nombre || !formData.nombre.trim()) {
      return { campo: "nombre", mensaje: "El nombre es obligatorio." };
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(formData.nombre)) {
      return { campo: "nombre", mensaje: "El nombre no puede contener números ni caracteres especiales." };
    }
  
    // Validar apellido
    if (!formData.apellido || !formData.apellido.trim()) {
      return { campo: "apellido", mensaje: "El apellido es obligatorio." };
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(formData.apellido)) {
      return { campo: "apellido", mensaje: "El apellido no puede contener números ni caracteres especiales." };
    }
  
    // Validar fecha de nacimiento
    if (!formData.fechaNacimiento) {
      return { campo: "fechaNacimiento", mensaje: "La fecha de nacimiento es obligatoria." };
    }
    const fecha = new Date(formData.fechaNacimiento);
    const minFecha = new Date(1900, 0, 1);
    const maxFecha = new Date(2007, 11, 31);
  
    if (isNaN(fecha.getTime())) {
      return { campo: "fechaNacimiento", mensaje: "La fecha de nacimiento no es válida." };
    }
    if (fecha < minFecha || fecha > maxFecha) {
      return { campo: "fechaNacimiento", mensaje: "La fecha debe estar entre 01/01/1900 y 31/12/2007." };
    }
  
    // Validar contraseña con confirmación y requisitos de seguridad
    if (!formData.password || !formData.password.trim()) {
      return { campo: "password", mensaje: "La contraseña es obligatoria." };
    }
  
    if (formData.password.length < 6) {
      return { campo: "password", mensaje: "La contraseña debe tener al menos 6 caracteres." };
    }
  
    if (formData.password.length > 20) {
      return { campo: "password", mensaje: "La contraseña no puede tener más de 20 caracteres." };
    }
  
    if (!/[A-Z]/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña debe contener al menos una letra mayúscula." };
    }
  
    if (!/[a-z]/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña debe contener al menos una letra minúscula." };
    }
  
    if (!/[0-9]/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña debe contener al menos un número." };
    }
  
    if (!/[!@#$%^&*]/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña debe contener al menos un carácter especial (!@#$%^&*)." };
    }
  
    if (/\s/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña no puede contener espacios en blanco." };
    }
  
    return null; // No hay errores
  };
  