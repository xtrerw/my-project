import { Router } from "express";
import ServerModel from "../server.js";

const router = Router();

// Obtener los favoritos de un lector
router.get("/:userId", async (req, res) => {
    const { userId } = req.params; // Obtener el ID del usuario de los parámetros de la solicitud

    try {
        // Buscar los favoritos del usuario en la base de datos
        const favoritos = await ServerModel.Favorito.findOne({ userID: userId }).populate('libros.libroID');
        
        if (!favoritos) {
           return res.status(200).json({ libros: [] });
        }
        //
        const librosSolo = favoritos.libros
        .filter(item => item.libroID)
        .map(item => item.libroID);

        res.status(200).json({ libros: librosSolo });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los favoritos", error });
    }
});

//eliminar un favorito
router.delete("/:userId/:libroId", async (req, res) => {
    const { userId, libroId } = req.params; // Obtener el ID del usuario y del libro de los parámetros de la solicitud

    try {
        // Eliminar el favorito del usuario en la base de datos
        const resultado = await ServerModel.Favorito.updateOne(
            { userID: userId },
            { $pull: { libros: { libroID: libroId } } }
        );


        if (!resultado) {
            return res.status(404).json({ message: "Favorito no encontrado." });
        }

        res.status(200).json({ message: "Favorito eliminado con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el favorito", error });
    }
});

export default router;