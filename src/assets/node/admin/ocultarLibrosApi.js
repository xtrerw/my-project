import ServerModel from "../server.js";
import express from 'express';

const router = express.Router();

// Ocultar los libros
//conseguir los libros de un autor
router.get('/ocultarLibros/:id', async (req, res) => {
    const { id } = req.params; // conseguir id del autor
    
    try {
        // Buscar los libros del autor
        const libros = await ServerModel.Libro.find({ autorID: id }).populate("autorID","nombre apellido")

        if (!libros || libros.length === 0) {
        return res.status(404).json({ message: 'No se encontraron libros para este autor' });
        }
        //muestra los libros en el front-end
        res.status(200).json(libros);
    } catch (error) {
        res.status(500).json({ message: 'Error al ocultar los libros: ' + error.message });
    }
});

export default router;