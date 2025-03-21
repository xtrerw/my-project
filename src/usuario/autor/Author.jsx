import { useState } from 'react';
import PaginaAutor from './PaginaAuthor';
import { Navigate } from "react-router-dom";
import "./Author.css";

function Author() {
    //Variables para registro de autor
    const [actionRegistro, setRegistro] = useState("iniciar");
    //Variables para controlar el estado de registro y éxito
    const [isExito, setExisto] = useState(false);
    const [autor, setAutor] = useState('');
    const [pwd, setPwd] = useState('');
    //Variable id para navegar al autor correspondiente
    const [id,setId]=useState()
    //Función para iniciar sesión del autor
    const handleIniciar = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/iniciar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: autor, password: pwd }),
            });
            const res = await response.json();
            if (response.ok) {
                console.log(res + " con éxito");
                //conseguir id con éxito
                setId(res._id)
                setExisto(true);
            }
        } catch (error) {
            console.error("Error iniciar Sesión " + error);
        }
    };

    const [userInfo, setUserInfo] = useState({
        nombre: '',
        apellido: '',
        username: '',
        password: '',
        fechaN: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });
            const data = await response.json();
            if (data) {
                setRegistro("iniciar");
                console.log('User registered:', data);
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <>
        {/* si inciciar sesión son éxito, va a navegar a la página para subir artículos */}
            {isExito ? (
                <Navigate to={`/Author/${id}`} element={<PaginaAutor/>}/>
            ) : (
                <div className='form-iniciar'>
                    <h2>Author Dashboard</h2>
                    {actionRegistro === "iniciar" ? (
                        <form onSubmit={handleIniciar} method='POST'>
                            <input
                                type="text"
                                name='username'
                                placeholder='Username'
                                onChange={(e) => setAutor(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                name='password'
                                placeholder='Contraseña'
                                onChange={(e) => setPwd(e.target.value)}
                                required
                            />
                            <div className='buttones'>
                                <button type="submit">Iniciar Sesión</button>
                                <button onClick={() => {
                                    setRegistro("registro");
                                    console.log("Switched to registro, actionRegistro:", actionRegistro);
                                }}>Registrar</button>
                            </div>
                        </form>
                    ) : actionRegistro === "registro" ? (
                        <form onSubmit={handleRegister} method='POST'>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={userInfo.username}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={userInfo.nombre}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name='apellido'
                                placeholder='apellido'
                                value={userInfo.apellido}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="date"
                                name='fechaN'
                                placeholder='fecha de nacimiento'
                                value={userInfo.fechaN}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={userInfo.password}
                                onChange={handleInputChange}
                                required
                            />
                            <div className='buttones'>
                                <button type="submit">Register</button>
                                <button onClick={() => setRegistro("iniciar")}>Iniciar Sesión</button>
                            </div>
                        </form>
                    ) : null}
                </div>
            )}
        </>
    );
}

export default Author; 