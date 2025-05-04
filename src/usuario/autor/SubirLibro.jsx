import { useState } from 'react'
import mammoth from 'mammoth';
import { useParams } from 'react-router-dom';
import './SubirLibro.css'
import { useEffect } from 'react';
const SubirLibro = () => {
    //conseguir el id del autor
    const id = localStorage.getItem("userId");
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState(0); // 价格状态
    //   
    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value >= 0) {
            setPrice(value);
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
        e.preventDefault();
        try {
            //conecta a api
            const response = await fetch('http://localhost:5001/autor/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content,id,price,categoriaSeleccionada,coleccionSeleccionada }),
            });
            //conseguir los datos de la base de datos
            const data = await response.json();
            console.log('los datos conseguido:', data);
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
    console.log("categorias", categorias._id);
    console.log("✔ categoría:", categoriaSeleccionada);
    console.log("✔ colección:", coleccionSeleccionada);
    
  return (
    <form onSubmit={handlePublish} className="subir-libro-form">
        <h2>Subir Libro</h2>
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
            accept=".docx"
            onChange={handleFileUpload}
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
}

export default SubirLibro