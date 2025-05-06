import mongoose from 'mongoose';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { type } from 'os';
// cargar el archivo .env con seguridad
dotenv.config({ path: path.resolve('src/assets/node/.env') });
const hashpwd = (pwd) => {
    return createHash('sha256').update(pwd).digest('hex');
}
console.log("usuario de mango:", process.env.DB_USER);
console.log("contraseña de mango:", process.env.DB_PASSWORD);

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
    tipo:{
        type:String,
        default:"admin",
    }
})
const Admin=mongoose.model('Admin',SchemaAdmin)
//eje de admin
const nuevoAdmin=[
    {
        username:"root",
        password:hashpwd("root")
    }
]

//Reader
const SchemaUsuario=new mongoose.Schema({
    nombre:String,
    apellido:String,
    usernombre:{
      type:String,
      unique:[true, "el nombre de usuario debe ser único"],
      required: [true," el nombre de usuario es obligatorio"],
    },
    password:{
      type:String,
      required: [true," el nombre de usuario es obligatorio"],
    },
    fechaNacimiento: { type: Date },
    direccion:String,
    codigoPostal:String,
    provincia:String,
    pais:String,
    genero:String,
    email:String,
    telefono:Number,
    tipo:{
      type:String,
      default:"lector",
    },
    activo:{
      type:Boolean,
      default:true,
    }
});

const Usuario=mongoose.model('Usuario',SchemaUsuario);

const nuevoUsuario=[
    {
        nombre:"Sara",
        apellido:"López",
        usernombre:"sara",
        password:hashpwd("1234"),
        fechaNacimiento: new Date("2000-01-01"), // fecha de nacimiento
        direccion:"Calle RTX5060 7 izquierda",
        codigoPostal:"23000",
        provincia:"Jaén",
        pais:"España",
        genero:"Mujer",
        email:"xqe@gmail.com",
        telefono:666666666,
    },
    {
        nombre:"Juan",
        apellido:"López",
        usernombre:"juan",
        password:hashpwd("1234"),
        fechaNacimiento: new Date("1995-01-01"), // fecha de nacimiento
        direccion:"Calle RTX4060 5 izquierda",
        codigoPostal:"23000",
        provincia:"Jaén",
        pais:"España",
        genero:"Hombre",
        email:"juan@gmail.com",
        telefono:680145361,
    },
  ]
        
//autor
const SchemaAutor=new mongoose.Schema({
    nombre:String,
    apellido:String,
    usernombre:{
      type:String,
      unique:[true, "el nombre de usuario debe ser único"],
      required: [true," el nombre de usuario es obligatorio"],
    },
    password:{
      type:String,
      required: [true," el nombre de usuario es obligatorio"],
    },
    fechaNacimiento: { type: Date },
    direccion:String,
    codigoPostal:String,
    provincia:String,
    pais:String,
    nacionalidad:String,
    genero:String,
    email:String,
    tipo:{
      type:String,
      default:"autor",
    },
    activo:{
      type:Boolean,
      default:true,
    }
});

const Autor=mongoose.model('Autor',SchemaAutor);
//define los atributos de autor
const nuevoAutor=[
    {
        nombre:"Mike",
        apellido:"Lork",
        usernombre:"weak",
        password:hashpwd("1234"),
        fechaNacimiento: new Date("1990-01-01"), // fecha de nacimiento
        direccion:"Calle RTX4060 5 izquierda",
        codigoPostal:"23000",
        provincia:"Jaén",
        pais:"España",
        nacionalidad:"China",
        genero:"Hombre",
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
    img:{
      type:String,
      required:true,
    },
    titulo:{
      type:String,
      required:true,
    },
    //relacion entre autor y libros
    autorID:{type:mongoose.Schema.Types.ObjectId,ref:'Autor'},
    precio:{
      type:Number,
      required:true,
    },
    // relaciones entre categoría y libros
    cateID:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Categoria',
      required:true,
    },
    colleccion:[{type:String}]
});

const Libro=mongoose.model('Libro',SchemaLibro);

//CONTENIDO
const SchemaContenido=new mongoose.Schema({
    libroID:{type:mongoose.Schema.Types.ObjectId,ref:'Libro'},
    titulo:String,
    contenido:String,
});

const Contenido=mongoose.model('Contenido',SchemaContenido);
//agregar libros y contenido de ejemplo
const nuevoLibros = [
    {
      img:"http://localhost:5173/src/img/libro.jpg",
      titulo:"El Árbol de los Deseos",
      precio:15,
      // insertar los datos luego
      autorID:null,
      cateID:null,
      colleccion:null
    }
  ];
  
  // compras
  const SchemaCompra=new mongoose.Schema({
    libroID:{type:mongoose.Schema.Types.ObjectId,ref:'Libro'},
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'Usuario'},
    cantidad:Number,
  });
  // crear el modelo de compra
  const Compra=mongoose.model('Compra',SchemaCompra);
  //agregar compras de ejemplo
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
      let libroInsertar = []; // variable para almacenar los libros insertados
      if (!libroExistente) {
        libroInsertar = await Libro.insertMany(nuevoLibros);
        const libroID = libroInsertar.map(l => l.id);

        const nuevoContenidos = [
          {
            libroID: libroID[0],
            titulo: nuevoLibros[0].titulo,
            // contenido de ejemplo
            contenido: "Mateo pensó que su aventura había terminado, pero el Árbol de los Deseos tenía otros planes.\nEsa noche, mientras dormía junto al árbol, soñó con una puerta dorada que flotaba entre las nubes.\n\nAl despertar, encontró un pequeño brote a sus pies con un mensaje en sus hojas: “La verdadera felicidad no se guarda, se comparte”.\n\nIntrigado, Mateo decidió seguir el sendero que se abría mágicamente frente a él.\nMientras avanzaba, el bosque cambiaba: los colores eran más vivos, el aire más dulce, y las flores susurraban palabras de ánimo.\n\nEn su camino, conoció a una niña llamada Lila, que había perdido la memoria.\nMateo la acompañó y le contaba historias cada noche, esperando que algún recuerdo volviera a ella.\n\nUna tarde, al contarle sobre el Árbol de los Deseos, Lila rompió en llanto.\n“¡Yo también soñé con ese árbol! ¡Y tenía un hermano que me hablaba de él cuando éramos pequeños!”\n\nMateo la miró fijamente. Algo en su voz le resultaba familiar.\nCon el corazón latiendo con fuerza, sacó el mapa antiguo de su mochila y se lo mostró.\n\nLila lo reconoció al instante.\n“Ese mapa... ¡mi abuela también tenía uno igual!”\nAmbos entendieron entonces que sus caminos estaban unidos desde mucho antes.\n\nAl llegar a una colina iluminada por luciérnagas, encontraron la puerta dorada del sueño de Mateo.\nLa tocaron juntos, y en un destello de luz, fueron transportados a un lugar más allá del tiempo.\n\nAllí, se encontraron con las almas guardianas del bosque, quienes les explicaron:\n“Ustedes son los portadores de los deseos puros. Solo aquellos que desean para otros, reciben lo que realmente necesitan.”\n\nCon lágrimas en los ojos, Lila recordó todo: su familia, su hogar, su hermano... que era Mateo.\nAmbos se abrazaron bajo una lluvia de estrellas y supieron que la vida los había separado solo para volver a unirlos con más fuerza.\n\nEl bosque los nombró guardianes del Árbol de los Deseos, encargados de guiar a otros en sus propios viajes del corazón.\n\nDesde entonces, Mateo y Lila caminaron juntos, contando historias, sembrando esperanza y recordándole al mundo...\nQue la magia existe donde hay bondad, y que los deseos más poderosos nacen del amor compartido."
          }
        ];
        // insertar el contenido en la base de datos
  
        await Contenido.insertMany(nuevoContenidos);
      } else {
        console.log("El libro ya existe, no se insertará nuevamente.");
        libroInsertar=await Libro.find({titulo:nuevoLibros[0].titulo});
      }





      // insertar compra ejemplo
      const usuarioEjemplo = await Usuario.findOne({ usernombre: "sara" });

      if (usuarioEjemplo && libroInsertar.length > 0) {
        // crear un objeto de compra de ejemplo
        const compraEjemplo = [
          {
            libroID: libroInsertar[0]._id,
            userID: usuarioEjemplo._id,
            cantidad: 1
          }
        ];
        // insertar la compra en la base de datos
        await Compra.insertMany(compraEjemplo);
        console.log("Compra de ejemplo insertada");
      } else {
        console.log("No se pudo insertar la compra de ejemplo, usuario o libro no encontrado.");
      }


    } catch (error) {
      console.error("Error al insertar datos:", error);
    }
  };
  
  
const initDB = async () => {
    await addDocument(Admin, nuevoAdmin, 'username');
    await addDocument(Autor, nuevoAutor, 'usernombre');
    await addDocument(Categoria, nuevoCategorias, 'nombre');
    await addDocument(Usuario, nuevoUsuario, 'usernombre');
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