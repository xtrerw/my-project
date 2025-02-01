import { useState } from 'react';
import Subir from './Subir';
import { Navigate } from "react-router-dom";

function Author() {
    const [actionRegistro, setRegistro] = useState("iniciar");
    const [isExito, setExisto] = useState(false);
    const [autor, setAutor] = useState('');
    const [pwd, setPwd] = useState('');
    const [id,setId]=useState()
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
            {isExito ? (
                <Navigate to={`/Author/${id}`} element={<Subir/>}/>
            ) : (
                <div>
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
                            <button type="submit">Iniciar Sesión</button>
                            <p onClick={() => {
                                setRegistro("registro");
                                console.log("Switched to registro, actionRegistro:", actionRegistro);
                            }}>Registrar</p>
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
                            <button type="submit">Register</button>
                            <p onClick={() => setRegistro("iniciar")}>Iniciar Sesión</p>
                        </form>
                    ) : null}
                </div>
            )}
        </>
    );
}

export default Author; 