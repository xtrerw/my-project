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
  const { nombre,apellido,fechaNacimiento,username, password } = req.body;
  try {
    const user = new ServerModel.Autor({ nombre:nombre, apellido:apellido ,fechaNacimiento:fechaNacimiento, usernombre:username, password:hashpwd(password),tipo:"autor",activo:true });
    await user.save();
   res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//iniciar sesión
router.post('/iniciar', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await ServerModel.Autor.findOne({ usernombre: username, password: hashpwd(password),activo:true });
        
        if(!user.activo){
          // si el usuario sin activo, devolver un mensaje de error
            res.status(401).json({ message: 'Usuario inactivo' });
        }

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuario no disponible' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Publish route
router.post('/publish', async (req, res) => {
  const { title, content ,id } = req.body;
  try {
    const libro = new ServerModel.Libro({ titulo:title,autorID:id});
    await libro.save();
    res.status(200).json(libro);
    const contenido=new ServerModel.Contenido({ contenido:content,libroID:libro._id })
    await contenido.save()
    res.status(200).json(contenido)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
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