import {Router} from 'express';
import ServerModel from '../server.js';

const router = Router();


//mis libros
router.get('/:id',async (req,res)=>{
    const id = req.params.id;
    try {
        const libros = await ServerModel.Libro.find({autorID:id});
        res.status(200).json(libros);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})
// Eliminar un libro por ID
router.delete('/libro/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await ServerModel.Libro.findByIdAndDelete(id);
    res.status(200).json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Conseguir los libros que quiere editar
router.get('/libro/:id', async (req, res) => {
  try {
    const libro = await ServerModel.Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(libro);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libro' });
  }
});

//Editar los libros
router.put('/libro/:id', async (req, res) => {
    //conseguir id
    const {id}=req.params
    // Buscar categoría por defecto "Todos los libros"
    
    const { titulo, precio, contenido, img, categoriaSeleccionada, coleccionSeleccionada } = req.body;
    console.log("✉️ Recibido en PUT /libro:", typeof id);

    
    try {
        // categoria que usuario ha elegido
         const categorias = [
            {
                cateID: categoriaSeleccionada,
                colleccion: [coleccionSeleccionada]
            }
        ];
        // categoria defecto
        const categoriaDefault = await ServerModel.Categoria.findOne({ nombre: 'Todos los libros' });
        // agregar categoria defecto
        if (categoriaDefault && categoriaDefault._id) {
            categorias.push({
                cateID: categoriaDefault._id,
                colleccion: ["Todos los libros"]
            });
        } else {
            console.warn('Categoría "Todos los libros" no encontrada');
        }
        //actualizar la informacion de libros
        const libroActualizado = await ServerModel.Libro.findByIdAndUpdate(id,
        {
            titulo,
            precio,
            contenido,
            img,
            categoria: categorias,
        },
        { new: true }
        );

        if (!libroActualizado) {
        return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.json(libroActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;