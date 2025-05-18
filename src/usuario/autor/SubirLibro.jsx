import { useState } from 'react'
import mammoth from 'mammoth';
import './SubirLibro.css'
import { useEffect } from 'react';
import subirImgDefault from '../../img/subir-img-default.png'
import { useNavigate } from 'react-router-dom';
import Author from './Login';
const SubirLibro = () => {
    //useNavigate para redirigir al usuario
    const navigate = useNavigate();
    //conseguir el id del autor
    const id = localStorage.getItem("userId");
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState(0); // precio inicial
    const [img, setImg] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    //conseguir el precio
    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value >= 0) {
            setPrice(value);
        }
    };
    //conseguir la vista previa de la imagen
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
    //set contenidos
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                setContent(result.value);
            } catch (error) {
                console.error('Error reading Word file:', error);
            }
        }
    };
    //subir contenidos
    const handlePublish = async (e) => {
        //prevenir el comportamiento por defecto del formulario
        e.preventDefault();
        try {
            let base64Img = "";

            if (img) {
                // Convertir la imagen a base64
                const toBase64 = (file) => new Promise((resolve, reject) => {
                    // Crear un objeto FileReader para leer el archivo
                    const reader = new FileReader();
                    // Leer el archivo como una URL de datos (base64)
                    reader.readAsDataURL(file);
                    // Cuando la lectura se complete, resolver la promesa con el resultado
                    reader.onload = () => resolve(reader.result);
                    // Si hay un error al leer el archivo, rechazar la promesa
                    reader.onerror = (error) => reject(error);
                });
                base64Img = await toBase64(img);
            }
            const formData={
                img: base64Img,
                title,
                content,
                id,
                price,
                categoriaSeleccionada,
                coleccionSeleccionada
            }
            //conecta a api
            const response = await fetch('http://localhost:5001/autor/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            //conseguir los datos de la base de datos
            const data = await response.json();
            if (response.ok) {
                //si se sube correctamente, redirigir al usuario a la página de mis libros
                navigate("/Author/Mis Libros")
                console.log('los datos subidos:', data);
            }
            
        } catch (error) {
            console.error('Error publishing work:', error);
        }
    };
    
    //conseguir categorias
    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:5001/autor/categorias');
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategorias();
    }, []);
    //conseguir colecciones seleccionadas
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [coleccionSeleccionada, setColeccionSeleccionada] = useState("");
    //conseguir las colecciones según la categoria seleccionada
    const categoriaObj = categorias.find(c => c._id === categoriaSeleccionada);
    
  return (
    <>
    {id? (
            <form onSubmit={handlePublish} className="subir-libro-form">
        <h2>Subir Libro</h2>
        <label htmlFor="img" className="preview-container">
            {/* muestra la imagen subida */}
            
                <img src={previewUrl || subirImgDefault} alt="Vista previa" className="preview-image" />

            {/* subir img */}
            <input
            id="img"
            accept="image/*" 
            type="file"
            name=""
            onChange={handleImageUpload}
            required
            hidden
            />
           
        </label>
        
        <label htmlFor="titulo">
            Titulo:
            <input
                id="titulo"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
        </label>
        <label htmlFor="archivo">
            Contenido:
            <input
            id="archivo"
            type="file"
            accept=".docx,.pdf,.epub,.mobi"
            onChange={handleFileUpload}
            required
            />
        </label>
        <label htmlFor="precio" className='input-precio'>
            Precio:
            <input
                id="precio"
                type="number"
                placeholder="Precio en euros"
                value={price}
                onChange={handlePriceChange}
                required
            />
            <p className="currency-symbol">€</p>
        </label>
        <div className='select-categoria'>
            <div>
                <label htmlFor="">Categoria:</label>
                <select name="" id="" 
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                required>
                    <option value="" disabled>Selecciona la categoría de tu libro</option>
                    {categorias.map((categoria) => (
                        <option key={categoria._id} value={categoria._id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="colecciones">Colecciones:</label>
                <select id="colecciones" name="colecciones" 
                value={coleccionSeleccionada}
                onChange={(e) => setColeccionSeleccionada(e.target.value)}
                required>
                    <option value="" disabled>Selecciona una colección</option>
                    {categoriaObj?.colleccion?.map((c,index) => (
                        <option key={index} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        <button type="submit">Subir</button>
    </form>
    )
    : (
        <Author />
    )}
    </>
  )
}

export default SubirLibro