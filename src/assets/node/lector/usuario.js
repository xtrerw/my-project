import { Router } from "express";
import ServerModel from "../server.js";

const router = Router();
//iniciar sesion
router.post("/iniciar", async (req, res) => {
    const { usernombre, password } = req.body; // Obtener los datos del cuerpo de la solicitud
    try {
        // Buscar el usuario en la base de datos
        const usuario = await ServerModel.Usuario.findOne({ usernombre, password });
        if (!usuario) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        res.status(200).json({ message: "Inicio de sesión exitoso", usuario });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
});
//registrar usuario

router.post("registrar", async (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { nombre, apellido, usernombre, password, fechaNacimiento, direccion, codigoPostal, provincia, pais, genero, email, telefono } = req.body;
    try {
        // crear un nuevo usuario
        const usuario = new ServerModel.Usuario({ nombre, apellido, usernombre, password, fechaNacimiento, direccion, codigoPostal, provincia, pais, genero, email, telefono });
        // Guardar el usuario en la base de datos
        await usuario.save();
        res.status(200).json(usuario);
    } catch (error) {
        // Manejar errores, como duplicados o validaciones fallidas
        res.status(400).json({ message: error.message });// 400 Bad Request
    }
});
