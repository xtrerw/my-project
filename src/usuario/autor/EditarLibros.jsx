// Componente para editar un libro existente
import React, { useState, useEffect } from 'react';
// manejar tipo de docx,pdf,epub
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import ePub from 'epubjs';
import subirImgDefault from '../../img/subir-img-default.png';

const EditarLibros = ({ libroId, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    precio: '',
    contenido: '',
    img: '',
    categoriaSeleccionada: '',
    coleccionSeleccionada: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Cargar datos del libro y categorías al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      const res = await fetch(`http://localhost:5001/misLibros/libro/${libroId}`);
      const data = await res.json();

      setFormData({
        titulo: data.titulo || '',
        precio: data.precio || '',
        contenido: data.contenido || '',
        img: data.img || '',
        categoriaSeleccionada: data.categoria?.[0]?.cateID || '',
        coleccionSeleccionada: data.categoria?.[0]?.colleccion?.[0] || ''
      });

      setPreviewUrl(data.img);

      const resCat = await fetch('http://localhost:5001/autor/categorias');
      const dataCat = await resCat.json();
      setCategorias(dataCat);
    };

    if (libroId) cargarDatos();
  }, [libroId]);

  // Manejar carga de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, img: reader.result });
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //  Convertir archivo .docx a texto
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    try {
        if (file) {
            //.docx con mammoth
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            setFormData({ ...formData, contenido: result.value });
        }
        else if (fileName.endsWith('.pdf')) {
        // .pdf con pdfjs
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let texto = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            texto += pageText + '\n\n';
        }
        setFormData({ ...formData, contenido: texto });

        }else if (fileName.endsWith('.epub')) {
        //.epub con epub.js
        const reader = new FileReader();
        reader.onload = async () => {
            const book = ePub(reader.result);
            const rendition = book.renderTo('epub-view', { width: 0, height: 0 }); // invisible
            await book.ready;

            let text = '';
            const spineItems = book.spine.items;

            for (const item of spineItems) {
            const content = await item.load(book.load.bind(book));
            const rawText = content.textContent || '';
            text += rawText + '\n\n';
            item.unload();
            }

            setFormData({ ...formData, contenido: text });
        };
        reader.readAsArrayBuffer(file);
        } else {
        alert('Formato no soportado. Solo .docx, .pdf, .epub');
        }
    } catch (error) {
        console.error('Error al leer archivo:', err);
        alert('No se pudo leer el archivo. Verifique el formato.');
    } 
  };

  // Enviar formulario para guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5001/misLibros/libro/${libroId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      onSuccess(); // Notificar éxito al padre
    } else {
      alert('Error al guardar los cambios');
    }
    console.log("Enviando:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="subir-libro-form">
      <h2>Editar Libro</h2>

      <label htmlFor="img" className="preview-container">
        <img src={previewUrl || subirImgDefault} alt="Vista previa" className="preview-image" />
        <input id="img" type="file" accept="image/*" onChange={handleImageUpload} hidden />
      </label>

      <label>Título:
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          required
        />
      </label>

      <label>Contenido:
        <input type="file" accept=".docx,.pdf,.epub,.mobi" onChange={handleFileUpload} />
      </label>

      <label>Precio (€):
        <input
          type="number"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
          required
        />
      </label>

      <label>Categoría:
        <select
          value={formData.categoriaSeleccionada}
          onChange={(e) => setFormData({ ...formData, categoriaSeleccionada: e.target.value })}
          required
        >
          <option value="">Seleccione una</option>
          {categorias.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.nombre}</option>
          ))}
        </select>
      </label>

      <label>Colección:
        <select
          value={formData.coleccionSeleccionada}
          onChange={(e) => setFormData({ ...formData, coleccionSeleccionada: e.target.value })}
          required
        >
          <option value="">Seleccione una</option>
          {categorias.find(c => c._id === formData.categoriaSeleccionada)?.colleccion?.map((col, idx) => (
            <option key={idx} value={col}>{col}</option>
          ))}
        </select>
      </label>

      <button type="submit">Guardar Cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default EditarLibros;
