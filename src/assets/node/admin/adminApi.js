import { Router } from "express";
import ServerModel from "../server.js";

const router = Router();

//admin login
router.post('/admin/login',async (req,res)=>{
  try {
    //conseguir el usuario y la contraseña del administrador
    const { usuario, password } = req.body;
    //verificar si el usuario y la contraseña son correctos
    const admin = await ServerModel.Admin.findOne({ usuario, password });
    //si el usuario y la contraseña son correctos, devolver un mensaje de éxito
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // 
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
export default router;
