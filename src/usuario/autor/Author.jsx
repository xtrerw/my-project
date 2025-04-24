import { useState } from 'react';
import "./Author.css";
import "../../style/calendario.css"
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { validateAuthor } from '../../utils/validateAuthor';
import { useFormValidation } from '../../utils/useFormValidation';
import { paises } from '../../utils/paises';
import { provincias } from '../../utils/provincias';
import { set } from 'mongoose';
function Author() {
    //validar el formulario
    const { errores, mensajeError, validar } = useFormValidation(validateAuthor);
    
    //Importar useNavigate para navegar a la página de MisDatos
    const navigate = useNavigate();
    //Variables para registro de autor
    const [actionRegistro, setRegistro] = useState("iniciar");
    //Variables para controlar el estado de registro y éxito
    const [isExito, setExisto] = useState(false);
    const [autor, setAutor] = useState('');
    const [pwd, setPwd] = useState('');
    //Variable id para navegar al autor correspondiente
    const [id,setId]=useState()
    //
    const [errorIniciar, setErroresIniciar] = useState();
    //Función para iniciar sesión del autor
    const handleIniciar = async (e) => {
        e.preventDefault();
        setErroresIniciar(null);
        // Validar el formulario antes de enviar
        try {
            const response = await fetch('http://localhost:5001/autor/iniciar', {
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
                //guardar en local storage en caso de que se haya iniciado sesión correctamente
                localStorage.setItem("loggedInUser", JSON.stringify(res));
                localStorage.setItem("userId", res._id);
            }else{
                setErroresIniciar(res.message);
                //si no se ha iniciado sesión, mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setErroresIniciar("Error iniciar Sesión "+error.message);
      }
    };
    //Función para manejar el registro del autor
    //se usa para guardar la información del autor
    const [userInfo, setUserInfo] = useState({
        nombre: '',
        apellido: '',
        username: '',
        password: '',
        fechaNacimiento: null,
        genero: '', 
        nacionalidad: '',
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
        // Validar el formulario antes de enviar
        const errorAutor=validar(userInfo)
        setErroresIniciar(null);
        //si hay error, mostrar mensaje de error
        if(errorAutor) return;

        try {
            const response = await fetch('http://localhost:5001/autor/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });
            const data = await response.json();
            if (response.ok) {
                //
                setRegistro("iniciar");
            }else{
                setErroresIniciar(data.message);
                //si no se ha registrado, mostrar mensaje de error
            }
        } catch (error) {
            //si no se ha registrado, mostrar mensaje de error
            setErroresIniciar("Error al registrar el usuario: " + error.message);
        }
    };
    // si el registro es exitoso, navegar a la página de registro
    useEffect(() => {
        if (isExito) {
            navigate('/Author/MisDatos');
        }
    }, [isExito, navigate]);

    return (
        <>
        {/* si inciciar sesión son éxito */}
                <div className='form-iniciar'>
                    <h2>Author Dashboard</h2>
                    {actionRegistro === "iniciar" ? (
                        //Formulario para iniciar sesión
                        <form onSubmit={handleIniciar}>
                            <input type="text" name='username' placeholder='Username' value={autor} onChange={(e) => setAutor(e.target.value)} required />
                            <input type="password" name='password' placeholder='Contraseña' value={pwd} onChange={(e) => setPwd(e.target.value)} required />
                            {/* Mensaje de error al iniciar sesión */}
                            <div className="error-message">{errorIniciar}</div>
                            <div className='buttones'>
                                <button type="submit">Iniciar Sesión</button>
                                <button onClick={() => {setRegistro("registro");}}>Registrar</button>
                            </div>
                        </form>
                    ) : actionRegistro === "registro" ? (
                        //Formulario para registro
                        <form onSubmit={handleRegister} className='form-registro'>
                            <input type="text" name="username"  className={errores.username || errorIniciar ? "error-input" : ""} placeholder="Username" value={userInfo.username} onChange={handleInputChange} required/>
                            {/* campo de la información de persona */}
                            <div className='registro-info'>
                                <input type="text" name="nombre"  className={errores.nombre? "error-input" : ""} placeholder="Nombre" value={userInfo.nombre} onChange={handleInputChange} required/>
                                <input type="text"  className={errores.apellido? "error-input" : ""} name='apellido' placeholder='Apellido' value={userInfo.apellido} onChange={handleInputChange} required/>
                               
                            </div>
                            
                            <div className='registro-info'>
                                {/* fecha nacimiento */}
                                <DatePicker
                                    locale="es"
                                    selected={userInfo.fechaNacimiento}
                                    onChange={(date) => {
                                    setUserInfo({
                                        ...userInfo,
                                        fechaNacimiento: date,
                                        });
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Selecciona una fecha"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    // Añadir clase de error condicional
                                    className={`registro-input-text ${errores.fechaNacimiento ? "error-input" : ""}`}
                                    calendarClassName="custom-calendar"
                                    dayClassName={() => "custom-day"}
                                    minDate={new Date(1900, 0, 1)}
                                    maxDate={new Date(2007, 11, 31)}
                                    renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => {
                                    const years = Array.from({ length: 2007 - 1900 + 1 }, (_, i) => 1900 + i);
                                    const months = [
                                        "enero", "febrero", "marzo", "abril", "mayo", "junio",
                                        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
                                    ];
                                    return (
                                        <div className="custom-header">
                                        {/* Año y mes seleccionables */}
                                        <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(parseInt(value))}>
                                            {years.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <select value={date.getMonth()} onChange={({ target: { value } }) => changeMonth(parseInt(value))}>
                                            {months.map((month, index) => (
                                            <option key={month} value={index}>{month}</option>
                                            ))}
                                        </select>
                                        </div>
                                    );
                                    }}
                                />
                                {/* género */}
                                <select
                                name="genero"
                                value={userInfo.genero}
                                onChange={handleInputChange}
                                className={errores.genero? "error-input" : ""}>
                                    <option value="">-- Selecciona tu género --</option>
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                
                            </div>

                            {/* nacionalidad */}
                            <select name="nacionalidad"
                                value={userInfo.nacionalidad}
                                onChange={handleInputChange}
                                className={errores.nacionalidad? "error-input" : ""}>
                                    <option value="">-- Selecciona tu nacionalidad --</option>
                                    {paises.map((pais, index) => (
                                        <option key={index} value={pais}>{pais}</option>
                                    ))}
                            </select>

                            <input type="password" className={errores.password? "error-input" :""} name="password" placeholder="Password" value={userInfo.password} onChange={handleInputChange} required/>
                            
                            {/* Mensaje general de error */}
                            <div className="error-message">{mensajeError}{errorIniciar}</div>

                            <div className='buttones'>
                                <button type="submit">Register</button>
                                <button onClick={() => setRegistro("iniciar")}>Iniciar Sesión</button>
                            </div>
                        </form>
                    ) : null}
                </div>
        </>
    );
}

export default Author; 