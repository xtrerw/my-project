import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

//importar todos los apis
import librosRouter from './lector/librosApi.js';
import autorRouter from './autor/autorApi.js';
import misLibrosRouter from './autor/misLibrosApi.js';
import adminRouter from './admin/adminApi.js';
import comprasRouter from './lector/comprasApi.js';
import usuarioRouter from './lector/usuarioApi.js';
import categoriaRouter from './admin/categoriaApi.js';
import favoritoRouter from './lector/favoritoApi.js';

const app = express();
app.use(express.json({
  // eliminar el límite de tamaño de imgenes
  // para evitar errores al subir imágenes grandes
  limit: 'inifinite'
}));
app.use(express.urlencoded({
  extended:true,
  // eliminar el límite de tamaño de imgenes
  limit: 'inifinite'
}));
app.use(cors());

//Entrada de ruta unificada

//autor
app.use('/autor', autorRouter);
app.use('/misLibros', misLibrosRouter);
//lector
app.use('/compras', comprasRouter);
app.use('/usuario', usuarioRouter);
app.use('/libros', librosRouter);
app.use('/favoritos', favoritoRouter);
// admin
app.use('/admin', adminRouter);
app.use('/adminCategoria',categoriaRouter)


// Puerto de escucha de servidor único
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});