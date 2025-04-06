import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createHash } from 'crypto';
import ServerModel from './server.js';

const hashpwd = (pwd) => {
    return createHash('sha256').update(pwd).digest('hex');
}

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(cors());

//admin
app.get('/admin',async (req,res)=>{
  
  try {
    console.log("admin")
    const admin=await ServerModel.Admin.find({})
    res.status(200).json("connected")
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})
// Register route
app.post('/register', async(req, res) => {
  const { nombre,apellido,fechaN,username, password } = req.body;
  try {
    const user = new ServerModel.Autor({ nombre:nombre, apellido:apellido ,fechaNacimiento:fechaN, usernombre:username, password:hashpwd(password),tipo:"autor" });
    await user.save();
   res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//iniciar sesión
app.post('/iniciar', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await ServerModel.Autor.findOne({ usernombre: username, password: hashpwd(password)});
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Publish route
app.post('/publish', async (req, res) => {
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
//libros que presentan en front-end
app.get('/libros', async (req, res) => {
  const works = await ServerModel.Libro.find({});
  res.status(200).json(works);
});
app.get('/libros/:id', async (req, res) => {
  const { id } = req.params; // conseguir id

  try {
    // Buscar por el campo libroID, no por _id
    const contenidos = await ServerModel.Contenido.find({ libroID: id });

    if (!contenidos || contenidos.length === 0) {
      return res.status(404).json({ message: 'Contenido no encontrado' });
    }

    res.status(200).json(contenidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el contenido: ' + error });
  }
});
//categoria

app.get('/categorias/:id', async (req, res) => {
  try {
      const { id } = req.params; // conseguir id
      const categorias = await ServerModel.Categoria.findOne({ nombre: id }); // Usa `findOne` en vez de `find`
      
      if (!categorias) {
          return res.status(404).json({ error: "Categoría no encontrada" });
      }

      const libros = await ServerModel.Libro.find({ cateID: categorias._id });

      res.status(200).json({ categoria: categorias, libros: libros }); // Solo una respuesta
  } catch (error) {
      res.status(500).json({ error: "Error en el servidor", detalle: error.message });
  }
});

//autores
// Obtener información del autor por ID
app.get('/autor/:id', async (req, res) => {
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
app.put('/autor/:id', async (req, res) => {
  // Obtener el ID del autor desde los parámetros de la solicitud
  const { id } = req.params;
  // Extraer los campos que deseas actualizar del cuerpo de la solicitud
  const { nombre, apellido, fechaNacimiento, direccion, codigoPostal, provincia, pais, nacionalidad, sexo, email } = req.body;
  // Validar que el ID es un ObjectId válido
  try {
      const autor = await ServerModel.Autor.findByIdAndUpdate(id, { nombre, apellido, fechaNacimiento, direccion, codigoPostal, provincia, pais, nacionalidad, sexo, email }, { new: true });
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
app.listen(5001,()=>console.log('Servidor corriendo en el puerto 5001'));