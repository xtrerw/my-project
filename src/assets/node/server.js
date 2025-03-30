import mongoose from 'mongoose';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
// cargar el archivo .env con seguridad
dotenv.config({ path: path.resolve('src/assets/node/.env') });
const hashpwd = (pwd) => {
    return createHash('sha256').update(pwd).digest('hex');
}
console.log("用户名:", process.env.DB_USER);
console.log("密码:", process.env.DB_PASSWORD);

const user=encodeURIComponent(process.env.DB_USER);

const password=encodeURIComponent(process.env.DB_PASSWORD);

const nombreBD=encodeURIComponent(process.env.DB_NAME);

const url=`mongodb+srv://${user}:${password}@cluster0.3emmgzn.mongodb.net/${nombreBD}`;

mongoose.connect(url).then(()=>console.log('Conectado a MongoDB')).catch((err)=>console.log(err)).catch((err)=>console.log("Error al conectar a MongoDB: "+err));
//agregar documento
const addDocument = async (modelo, docs, campoUnico = 'nombre') => {
    if (!Array.isArray(docs)) {
      docs = [docs]; // si lo que insertar no es Array, convertir en array
    }
    for (const doc of docs) {
      const consulta = {};
      consulta[campoUnico] = doc[campoUnico]; // consultar array dinamicamente

      const docExiste = await modelo.findOne(consulta);
      if (!docExiste) {
        await modelo.create(doc);
      }
    }
};

  

//administrador
const SchemaAdmin=new mongoose.Schema({
    username:String,
    password:String,
    tipo:String
})
const Admin=mongoose.model('Admin',SchemaAdmin)
//eje de admin
const nuevoAdmin=[
    {
        username:"root",
        password:hashpwd("root"),
        tipo:"admin"
    }
]

//Reader
const SchemaUsuario=new mongoose.Schema({
    nombre:String,
    password:String,
    tipo:String,
});

const Usuario=mongoose.model('Usuario',SchemaUsuario);
//autor
const SchemaAutor=new mongoose.Schema({
    nombre:String,
    apellido:String,
    usernombre:String,
    password:String,
    fechaNacimiento:Date,
    direccion:String,
    codigoPostal:String,
    provincia:String,
    pais:String,
    nacionalidad:String,
    sexo:String,
    email:String,
});

const Autor=mongoose.model('Autor',SchemaAutor);
//define los atributos de autor
const nuevoAutor=[
    {
        nombre:"Mike",
        apellido:"Lork",
        usernombre:"weak",
        password:hashpwd("1234"),
        fechaNacimiento:new Date("2025-01-07"),
        direccion:"Calle RTX4060 5 izquierda",
        codigoPostal:"23000",
        provincia:"Jaén",
        pais:"España",
        nacionalidad:"USA",
        sexo:"Hombre",
        email:"mike@tunkbooks.com",
    }
]
//agregar autores de ejemplo

//categorias

const SchemaCategoria=new mongoose.Schema({
    nombre:String,
    colleccion:[String],
});
const Categoria=mongoose.model('Categoria',SchemaCategoria)
//crea categorias

const nuevoCategorias=[
    {
        nombre:"Imprescindibles",
        colleccion:["Más vendidos","Todos los libros","Recomendados"]
    },
    {
        nombre:"Ficción",
        colleccion:["Romántica y erótica","Negra","Histórica","Fantástica","Ciencia ficción","Terror","Humor","Viajes"]
    },
    {
        nombre:"No Ficción",
        colleccion:["Ciencias y tecnología","Humanidades","Arte","Filología","Historia"]
    },
    {
        nombre:"Cómic y Manga",
        colleccion:["Libros de ilustración","Cómic de humor","Historia y técnica","Manga"]
    }
]


//libros
const SchemaLibro=new mongoose.Schema({
    img:String,
    titulo:String,
    //relacion entre autor y libros
    autorID:{type:mongoose.Schema.Types.ObjectId,ref:'Autor'},
    precio:Number,
    // relaciones entre categoría y libros
    cateID:{type:mongoose.Schema.Types.ObjectId,ref:'Categoria'},
    colleccion:[{type:String}]
});

const Libro=mongoose.model('Libro',SchemaLibro);

//CONTENIDO
const SchemaContenido=new mongoose.Schema({
    libroID:{type:mongoose.Schema.Types.ObjectId,ref:'Libro'},
    contenido:String,
});

const Contenido=mongoose.model('Contenido',SchemaContenido);
//agregar libros y contenido de ejemplo
const nuevoLibros = [
    {
      img:"src/img/libro.jpg",
      titulo:"ASAs",
      precio:15,
      // insertar los datos luego
      autorID:null,
      cateID:null,
      colleccion:null
    }
  ];
  
  const insertarDatos = async () => {
    try {
      // comprobar los datos si están establecidos
      const autorExistente = await Autor.findOne({ usernombre: nuevoAutor[0].usernombre });
      const categoriaExistente = await Categoria.findOne({ nombre: nuevoCategorias[0].nombre });
  
      if (!autorExistente || !categoriaExistente) {
        console.log("Autor o categoría no encontrados, asegúrate de haberlos insertado primero.");
        return;
      }
  
      nuevoLibros[0].autorID = autorExistente._id;
      nuevoLibros[0].cateID = categoriaExistente._id;
      nuevoLibros[0].colleccion = categoriaExistente.colleccion[0];
  
      // si existen los libros antes de insertar los datos
      const libroExistente = await Libro.findOne({ titulo: nuevoLibros[0].titulo });
      if (!libroExistente) {
        const libroInsertar = await Libro.insertMany(nuevoLibros);
        const libroID = libroInsertar.map(l => l.id);
  
        const nuevoContenidos = [
          {
            libroID: libroID[0],
            contenido: "Contenido del libro ASAs"
          }
        ];
  
        await Contenido.insertMany(nuevoContenidos);
      } else {
        console.log("El libro ya existe, no se insertará nuevamente.");
      }
    } catch (error) {
      console.error("Error al insertar datos:", error);
    }
  };
  
  
const initDB = async () => {
    await addDocument(Admin, nuevoAdmin, 'username');
    await addDocument(Autor, nuevoAutor, 'usernombre');
    await addDocument(Categoria, nuevoCategorias, 'nombre');
  
    for (const libro of nuevoLibros) {
      const libroExistente = await Libro.findOne({ titulo: libro.titulo });
      if (!libroExistente) {
        await insertarDatos(); // realizar sin existir los libros
        break; // parar bucle depués de insertar los datos
      }
    }
  };
  
  initDB();

//exportar todos los modelos a api.js
export default {Usuario,Autor,Libro,Contenido,Admin,Categoria,addDocument};