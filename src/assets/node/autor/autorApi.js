import { Router } from "express";
import ServerModel from "../server.js";
import { createHash } from 'crypto';

const router = Router();

// Hash password function
const hashpwd = (pwd) => {
    return createHash('sha256').update(pwd).digest('hex');
}
// conseguir todos los autores
router.get("/listado", async (req, res) => {
    try {
        // Obtener todos los autores de la base de datos
        const autores = await ServerModel.Autor.find();
        res.status(200).json(autores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los autores", error });
    }
});
// Register route
router.post('/register', async(req, res) => {
  const { nombre,apellido,fechaNacimiento,username, password,tipoRegistro } = req.body;
  try {
    const user = new ServerModel.Autor({ nombre:nombre, apellido:apellido ,fechaNacimiento:fechaNacimiento, usernombre:username, password:hashpwd(password), tipo:tipoRegistro ,activo:true });
    await user.save();
   res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//iniciar sesión
router.post('/iniciar', async (req, res) => {
    const { username, password,tipoUsuario } = req.body;
    try {
      const hashedPwd = hashpwd(password);
      let usuario;
      // Verificar el tipo de usuario y buscar en la colección correspondiente
      // Si el tipo de usuario es "Autor", buscar en la colección de autores
      // Si el tipo de usuario es "Lector", buscar en la colección de lectores
      if (tipoUsuario === "autor") {
        // conseguir en la colección de autores
        usuario = await ServerModel.Autor.findOne({ usernombre: username, password: hashedPwd, tipo: tipoUsuario });
      } else if (tipoUsuario === "lector") {
        // conseguir en la colección de lectores
        usuario = await ServerModel.Usuario.findOne({ usernombre: username, password: hashedPwd, tipo: tipoUsuario });
      }
      // Verificar si el usuario existe
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no disponible' });
      }
      // Verificar si el usuario está activo
      if (!usuario.activo) {
        return res.status(401).json({ message: 'Usuario inactivo' });
      }
    
      res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// publicar libro
router.post('/publish', async (req, res) => {
  // Obtener toda informacion del autor desde el cuerpo de la solicitud
  const { img,title, content,id,price,categoriaSeleccionada,coleccionSeleccionada} = req.body;
  

  try {
    // Crear un nuevo libro y guardarlo en la base de datos
    const libro = new ServerModel.Libro({ 
      img:img,
      titulo:title,
      autorID:id,
      contenido:content,
      precio:price,
      cateID:categoriaSeleccionada,
      colleccion:[coleccionSeleccionada],
    });
    // Guardar el libro en la base de datos
    await libro.save();
    
    // Crear un nuevo contenido y guardarlo en la base de datos
    const contenido=new ServerModel.Contenido({ contenido:content,libroID:libro._id })
    await contenido.save()
    res.status(200).json({
      message: "Libro y contenido guardados correctamente",
      libro,
      contenido
    });
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//obtener todos los colecciones de libros
router.get('/categorias', async (req, res) => {
    try {
        // Obtener todas las categorías de la base de datos
        const todasLasCategorias = await ServerModel.Categoria.find();
        // Filtrar las categorías para excluir la primera (índice 0)
        const categorias = todasLasCategorias.slice(1)
        res.status(200).json(categorias);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})
//autores
// Obtener información del autor por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const autor = await ServerModel.Autor.findById(id);
        if (!autor) {
            return res.status(404).json({ message: "Autor no encontrado" });
        }
        res.status(200).json(autor);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener autor", error });
    }
  });
  
  
// Actualizar información del autor por ID
router.put('/:id', async (req, res) => {
    // Obtener el ID del autor desde los parámetros de la solicitud
    const { id } = req.params;
    // Extraer los campos que deseas actualizar del cuerpo de la solicitud
    const { nombre, apellido, fechaNacimiento, direccion, codigoPostal, provincia, pais, nacionalidad, genero, email } = req.body;
    // Validar que el ID es un ObjectId válido
    try {
        const autor = await ServerModel.Autor.findByIdAndUpdate(id, { nombre, apellido, fechaNacimiento, direccion, codigoPostal, provincia, pais, nacionalidad, genero, email }, { new: true });
        if (!autor) {
            return res.status(404).json({ message: "Autor no encontrado" });
        }
        // Enviar la respuesta con el autor actualizado
        res.status(200).json(autor);
    } catch (error) {
      console.error("PUT /autor/:id error", error.message, error.stack);
      res.status(500).json({ message: "Error al asdasd autor", error: error.message });
        //res.status(500).json({ message: "Error al actualizar autor", error });
    }
  });
  
// Cambiar contraseña del autor por ID
router.put('/password/:id', async (req, res) => {
    const { id } = req.params;
    const { contrasena } = req.body;
    try {
        const autor = await ServerModel.Autor.findByIdAndUpdate(id, { password: hashpwd(contrasena) }, { new: true });
        if (!autor) {
            return res.status(404).json({ message: "Autor no encontrado" });
        }
        res.status(200).json(autor);
    } catch (error) {
      console.error("cambiar contraseña error", error.message, error.stack);
      res.status(500).json({ message: "Error al actualizar contraseña", error: error.message });
    }
  });

  export default router;