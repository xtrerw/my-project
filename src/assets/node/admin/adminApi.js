import { Router } from "express";
import ServerModel from "../server.js";

const router = Router();

//admin
router.get('/admin',async (req,res)=>{
  
  try {
    console.log("admin")
    const admin=await ServerModel.Admin.find({})
    res.status(200).json("connected")
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

export default router;
