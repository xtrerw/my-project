import { useState } from 'react'
import mammoth from 'mammoth';
import { useParams } from 'react-router-dom';

const Subir = () => {
    const {id}=useParams()
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
    //subir contenidos
    const handlePublish = async (e) => {
        e.preventDefault();
        try {
            //conecta a api
            const response = await fetch('http://localhost:5001/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content,id }),
            });
            //conseguir los datos de la base de datos
            const data = await response.json();
            console.log('los datos conseguido:', data);
        } catch (error) {
            console.error('Error publishing work:', error);
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
    

  return (
    <form onSubmit={handlePublish}>
        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
        />
        <input
            type="file"
            accept=".docx"
            onChange={handleFileUpload}
        />
         <input
                type="number"
                placeholder="Precio en euros"
                value={price}
                onChange={handlePriceChange}
                min="0"
                step="0.01"
            /> €
        <select>

        </select>
        <button type="submit">Subir</button>
    </form>
  )
}

export default Subir