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
  const { nombre,apellido,fechaNacimiento,username, password,tipoRegistro,nacionalidad,genero } = req.body;
  let user
  try {
    //verificar si es lector o autor
    if (tipoRegistro === "lector") {
      // Verificar si el nombre de usuario ya existe en la colección de lectores
      user = await ServerModel.Usuario.findOne({ usernombre: username });
      if (user) {
        return res.status(400).json({ message: "El nombre de usuario ya existe" });
      }
      // Crear un nuevo lector
      user = new ServerModel.Usuario({ nombre:nombre, apellido:apellido ,fechaNacimiento:fechaNacimiento, usernombre:username, password:hashpwd(password), tipo:tipoRegistro ,activo:true, nacionalidad:nacionalidad,genero:genero });
      await user.save();
      res.status(200).json(user);
      return;
    } 
    // verificar si es autor
    else if (tipoRegistro === "autor") {
    // Verificar si el nombre de usuario ya existe en la colección de autores
    user = await ServerModel.Autor.findOne({ usernombre: username });
    if (user) {
      return res.status(400).json({ message: "El nombre de usuario ya existe" });
    }
    // Crear un nuevo autor
    user = new ServerModel.Autor({ nombre:nombre, apellido:apellido ,fechaNacimiento:fechaNacimiento, usernombre:username, password:hashpwd(password), tipo:tipoRegistro ,activo:true, nacionalidad:nacionalidad,genero:genero });
    await user.save();
    return res.status(200).json(user);
  }
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
    let usuario;
    try {
        // Buscar el autor por ID
        usuario = await ServerModel.Autor.findById(id);
        if (!usuario) {
            // Si no se encuentra el autor, buscar en la colección de usuarios
          usuario = await ServerModel.Usuario.findById(id);
          // Si no se encuentra el usuario, devolver un error 404
          if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
          }
        }
        // Enviar la respuesta con el autor o usuario encontrado
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener autor", error });
    }
  });
  
  
// Actualizar información del autor por ID
router.put('/:id', async (req, res) => {
    // Obtener el ID del autor desde los parámetros de la solicitud
    const { id } = req.params;
    // Extraer los campos que deseas actualizar del cuerpo de la solicitud
    const { nombre, apellido, fechaNacimiento, direccion, codigoPostal, provincia, pais, nacionalidad, genero, email,telefono,tipo } = req.body;
    let usuario
    // Validar que el ID es un ObjectId válido
    try {
      //si es lector
        if (tipo==="lector") {
          usuario=await ServerModel.Usuario.findByIdAndUpdate(id,{
            nombre: nombre,apellido:apellido,fechaNacimiento:fechaNacimiento,direccion:direccion,nacionalidad:nacionalidad,codigoPostal:codigoPostal,provincia:provincia,pais:pais,telefono:telefono,genero:genero,email:email
          },
          {new: true})
        } 
        // si es autor
        else if (tipo==="autor") {
          usuario = await ServerModel.Autor.findByIdAndUpdate(id, { nombre, apellido, fechaNacimiento, direccion, codigoPostal, provincia, pais, nacionalidad, genero, email }, { new: true });
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Enviar la respuesta con el autor actualizado
        res.status(200).json(usuario);
    } catch (error) {
      console.error("PUT /autor/:id error", error.message, error.stack);
      res.status(500).json({ message: "Error al autor", error: error.message });
        //res.status(500).json({ message: "Error al actualizar autor", error });
    }
  });
//Verificar contraseña anterior por ID
router.post('/password/:id', async (req, res) => {
    const { id } = req.params;
    const { contrasena } = req.body;
    const hashedPwd = hashpwd(contrasena);
    let autor;
    try {
        // Buscar el autor por ID y verificar la contraseña
        autor = await ServerModel.Autor.findById(id);
        //contraseña incorrecta
        if (!autor) {
            autor = await ServerModel.Usuario.findById(id);
            if (!autor) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
        }
        // Verificar si la contraseña coincide
        if (hashedPwd !== autor.password) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        res.status(200).json({ message: "Contraseña correcta" });
    } catch (error) {
      console.error("verificar contraseña error", error.message, error.stack);
      res.status(500).json({ message: "Error al verificar contraseña", error: error.message });
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