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

export default router;