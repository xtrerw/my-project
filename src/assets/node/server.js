import mongoose from 'mongoose';
import { createHash } from 'crypto';

const hashpwd = (pwd) => {
    return createHash('sha256').update(pwd).digest('hex');
}

const user=encodeURIComponent('root');

const password=encodeURIComponent('root');

const nombreBD=encodeURIComponent('FreeLibro');

const url=`mongodb+srv://${user}:${password}@cluster0.3emmgzn.mongodb.net/${nombreBD}`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>console.log('Conectado a MongoDB')).catch((err)=>console.log(err)).catch((err)=>console.log("Error al conectar a MongoDB: "+err));
//agregar documento
const addDocument=(modelo,doc)=>{
    return modelo.findOne({nombre:doc.nombre}).then((docExiste)=>{
        if(!docExiste){//si no existe el documento
            return modelo.create(doc);//crea el documento
        }else{
            return null
        }
    })
}

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
addDocument(Admin,nuevoAdmin)
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
    tipo:String
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
        tipo:"autor"
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
const insertarDatos=async()=>{
    try {
        
        //insertar id de autor
        const autorInsertar=await Autor.insertMany(nuevoAutor)
        const autorID=autorInsertar.map(a=>a._id);

        //insertar id de categoría
        const categoriaInsertar=await Categoria.insertMany(nuevoCategorias)
        const categoriaID=categoriaInsertar.map(c=>c._id);

        const nuevoLibros=[
            {
                img:"src/img/libro.jpg",
                titulo:"ASAs",
                autorID:autorID[0],
                precio:15,
                cateID:categoriaID[0],
                colleccion:categoriaInsertar[0].colleccion[0],
            }
        ];
        //insertar id de libro
        const libroInsertar=await Libro.insertMany(nuevoLibros)
        const libroID=libroInsertar.map(l=>l.id);
        const nuevoContenidos=[
            {
                libroID:libroID[0],
                contenido:"Contenido del libro ASAs"
            }
        ];

        await Contenido.insertMany(nuevoContenidos)
    } catch (error) {
        console.error("Error al insertar datos:", error);
    }
}

insertarDatos();

//exposrtar todos los modelos a api.js
export default {Usuario,Autor,Libro,Contenido,Admin,Categoria,addDocument};