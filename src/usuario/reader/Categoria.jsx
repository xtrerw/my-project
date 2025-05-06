import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./Categoria.css"
import '../../style/libro.css' // Asegúrate de tener un archivo CSS para estilos
const Categoria = () => {
  //conseguir las categorias de libros
  const { categoriaId, subcategoriaId } = useParams();
  //set categoria
  const [categoria, setCategorias] =useState(null)
  //set libros
  const [libros,setLibros] = useState(null)
  //cantidad de compras
  const [cantidad, setCantidad] = useState(0);
  //id del usuario
  const [userId, setUserId] = useState();
  //registro de usuario
  const [isRegistrado, setIsRegistrado] = useState(false);
  //formulario de registro
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    username: "",
    password: "",
    fechaNacimiento: "",
    direccion: "",
    codigoPostal: "",
    provincia: "",
    pais: "",
    genero: "",
    email: "",
    telefono: "",
  });
  //
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //
  const handleRegister = (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/usuario/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Registro exitoso");
          setIsRegistrado(true);
        } else {
          console.log("Error en el registro");
        }
      })
      .catch((error) => {
        console.error("Error en el registro:", error);
      });
  };
  //conseguir las categorias desde mango db
  useEffect(()=>{
    fetch(`http://localhost:5001/libros/categorias/${categoriaId}`)
    .then(response=>response.json())
    .then(resulta=>{
        setCategorias(resulta.categoria); 
        setLibros(resulta.libros);
    })
    .catch(error => console.error("Error al obtener categorias:", error));
  },[categoriaId])

  //funcion para comprar libros
  const handleComprar = (libro) => {
    if (cantidad<=0) return

    fetch("http://localhost:5001/comprar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        libroId: libro._id,
        userId: localStorage.getItem("userId"),
        cantidad: cantidad,
      }),
    })

    .then((response) => {
      if (response.ok) {
        console.log("Compra realizada con éxito");
      } else {
        console.log("Error al realizar la compra");
      }
    })
    .catch((error) => {
      console.error("Error al realizar la compra:", error);
    });
  };

  //registro de usuario
  
  if (!categoria || !libros) return <p>Cargando...</p>;

  return (
    <>
      { userId? (
        <div>
        {libros
        //filtrar todos los libros que cumple con las condiciones
        .filter(libro => libro.colleccion.includes(subcategoriaId))
        .map((libro, index) => (
          <div  key={index}>
            <Link to={`/Libros/${libro._id}`} className='libro-item'>
              <img src={`http://localhost:5173/${libro.img}`} alt={libro.titulo} />
              <h2>{libro.titulo}</h2>
              <p>{libro.precio} €</p>
            </Link>
            <div>
              <button onClick={() => 
                {
                  if (cantidad > 0) {
                    setCantidad(cantidad-1)
                  }
                }
              }>-</button>
              <p>{cantidad}</p>
              <button onClick={() => setCantidad(cantidad+1)}>+</button>
              <button onClick={()=> handleComprar(libro)}>Comprar</button>
            </div>
          </div>
        ))}
      </div>
      ):(
        //si no hay id de usuario, mostrar el formulario de registro y login
        isRegistrado ? (
          <div>
            <h2>Registro Exitoso</h2>
            <p style={{cursor:"pointer"}} onClick={()=>setIsRegistrado(false)}>
              ¿Ya tienes una cuenta? Inicia sesión aquí.
            </p>
          </div>
        ) : (
        // pagina de registro y login
       <div>
          <form>
            <h2>Iniciar Sesión</h2>
            <label htmlFor="usuario">Usuario:</label>
            <input type="text" id="usuario" name="usuario" required />
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" required />
            <p style={{cursor:"pointer"}} onClick={()=>setIsRegistrado(true)}>
              ¿No tienes una cuenta? Regístrate aquí.
            </p>
            <button type="submit">Iniciar Sesión</button>
          </form>
       </div>
      )
    )}
      
    </>
  )
}

export default Categoria