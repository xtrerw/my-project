import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

//importar todos los apis
import librosRouter from './lector/librosApi.js';
import autorRouter from './autor/autorApi.js';
import misLibrosRouter from './autor/misLibrosApi.js';
import adminRouter from './admin/adminApi.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//Entrada de ruta unificada
app.use('/libros', librosRouter);
app.use('/autor', autorRouter);
app.use('/misLibros', misLibrosRouter);
app.use('/admin', adminRouter);


// Puerto de escucha de servidor único
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});