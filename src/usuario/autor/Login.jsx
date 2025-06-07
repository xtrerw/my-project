import { useState } from 'react';
import "./Login.css";
import "../../style/calendario.css"
import "../../style/responsive.css"
// import "../../style/PasswordInput.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { validateAuthor } from '../../utils/validateAuthor';
import { useFormValidation } from '../../utils/useFormValidation';
import { paises } from '../../utils/paises';
import { provincias } from '../../utils/provincias';
import { useUser } from '../../context/UserContext';
function Author() {
    //error para iniciar sesión y registro
    const [loginError, setLoginError] = useState(null);
    const [registerError, setRegisterError] = useState(null);

    //usar el contexto de usuario
    const {user, setUser } = useUser();
    //muestra la contraseña en texto plano o encriptada
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    //validar el formulario
    const { errores, mensajeError, validar } = useFormValidation(validateAuthor);
    
    //Importar useNavigate para navegar a la página de MisDatos
    const navigate = useNavigate();
    //Variables para registro de autor
    const [actionRegistro, setRegistro] = useState("iniciar");
    //Variables para controlar el estado de registro y éxito
    const [isExito, setExisto] = useState(false);
    //variables de inicio de sesión
    const [autor, setAutor] = useState('');
    const [pwd, setPwd] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('autor');
    //Variable id para navegar al autor correspondiente
    const [id,setId]=useState()
    //
    //Función para iniciar sesión del autor
    const handleIniciar = async (e) => {
        e.preventDefault();
        setLoginError(null);
        // Validar el formulario antes de enviar
        try {
            const response = await fetch('http://localhost:5001/autor/iniciar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: autor, password: pwd, tipoUsuario: tipoUsuario }),
            });
            const res = await response.json();
            if (response.ok) {
                console.log(res + " con éxito");
                //si se ha iniciado sesión correctamente, guardar el usuario en el contexto
                setUser(res);
                //conseguir id con éxito
                setId(res._id)
                setExisto(true);
                //guardar en local storage en caso de que se haya iniciado sesión correctamente
                localStorage.setItem("loggedInUser", JSON.stringify(res));
                localStorage.setItem("userId", res._id);
            }else{
                setLoginError(res.message);
                //si no se ha iniciado sesión, mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setLoginError("Error iniciar Sesión " + error.message);
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
        tipoRegistro: 'autor',
    });
    //vaciar el formulario de registro
    const switchToRegistro = () => {
        //cambio de iniciar sesión a registro
        setRegistro("registro");
        setLoginError(null);
        setRegisterError(null);
        setUserInfo({
            nombre: '',
            apellido: '',
            username: '',
            password: '',
            fechaNacimiento: null,
            genero: '', 
            nacionalidad: '',
            tipoRegistro: 'autor',
        });
    };
    // vaciar el formulario de iniciar sesión
    const switchToIniciar = () => {
        //cambio de iniciar sesión a registro
        setRegistro("iniciar");
        setLoginError(null);
        setRegisterError(null);
        setAutor('');
        setPwd('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };

    //registrar
    const handleRegister = async (e) => {
        e.preventDefault();
        // Validar el formulario antes de enviar
        const errorAutor=validar(userInfo)
        setLoginError(null);
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
                setUserInfo({
                    nombre: '',
                    apellido: '',
                    username: '',
                    password: '',
                    fechaNacimiento: null,
                    genero: '', 
                    nacionalidad: '',
                    tipoRegistro: 'autor',
                });
                setRegistro("iniciar");
            }else{
                setRegisterError(data.message);
                //si no se ha registrado, mostrar mensaje de error
            }
        } catch (error) {
            //si no se ha registrado, mostrar mensaje de error
            setRegisterError("Error al registrar el usuario: " + error.message);
        }
    };
    // si el registro es exitoso, navegar a la página de registro
    useEffect(() => {
        if (!user || !isExito) return;
        //si iniciar sesion de autor con exito,navegar a la pagina de autor
        if (user.tipo === "autor") {
          navigate('/Author/Mis Datos');
        } 
        //si iniciar sesion de lector con exito,navegar a la pagina de lector
        else if (user.tipo === "lector") {
          navigate('/');
        }
      }, [user, isExito, navigate]);

    return (
        <>
        {/* si inciciar sesión son éxito */}
                <div className='form-iniciar'>
                    
                    {actionRegistro === "iniciar" ? (
                        //Formulario para iniciar sesión
                        <form onSubmit={handleIniciar}>
                            <h2>Iniciar Sesión</h2>
                            {/* campo de la información de autor */}
                            <label htmlFor="username">
                                Usuario
                                <input type="text" name='username' placeholder='Username' value={autor} onChange={(e) => setAutor(e.target.value)} required />
                            </label>
                            
                            {/* campo de la contraseña */}
                            <label className='password-input-container'>
                                Contraseña
                                <input 
                                type={showPassword ? "text" : "password"}
                                name='password' placeholder='Contraseña' 
                                value={pwd} 
                                onChange={(e) => setPwd(e.target.value)} 
                                required />
                                <i
                                // muestra la contraseña en texto plano o encriptada
                                // cambia el icono de ojo abierto a ojo cerrado y viceversa
                                className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`} 
                                onClick={()=>setShowPassword(!showPassword)}
                                ></i>
                            </label>
                            {/* campo de tipo de usuario */}
                            <label htmlFor="tipoUsuario" className='tipo-usuario'>
                                Tipo de Usuario
                                <select name="tipoUsuario" id="" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
                                    <option value="autor">Autor</option>
                                    <option value="lector">Lector</option>
                                </select>
                            </label>
                            {/* Mensaje de error al iniciar sesión */}
                            <div className="error-message">{loginError}</div>
                            <div className='buttones'>
                                <p style={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }} onClick={() => {switchToRegistro()}}>Crea una cuenta</p>
                                <button type="submit">Iniciar Sesión</button>
                            </div>
                        </form>
                    ) : actionRegistro === "registro" ? (
                        //Formulario para registro
                        <form onSubmit={handleRegister} className='form-registro'>
                            <h2>Registrar</h2>
                            <input type="text" name="username"  className={errores.username ? "error-input" : ""}placeholder="Username" value={userInfo.username} onChange={handleInputChange} required/>
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
                                    placeholderText="Nacimiento"
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
                            
                            <label className='password-input-container'>
                            <input type={showPassword2?`text`:`password`} className={errores.password? "error-input" :""} name="password" placeholder="Password" value={userInfo.password} onChange={handleInputChange} required/>
                            <i
                                // muestra la contraseña en texto plano o encriptada
                                // cambia el icono de ojo abierto a ojo cerrado y viceversa
                                className={`bx ${showPassword2 ? 'bx-show' : 'bx-hide'}`} 
                                onClick={()=>setShowPassword2(!showPassword2)}
                                ></i>  
                            </label>

                            <label htmlFor="tipoUsuario" className='tipo-usuario'>
                                <select name="tipoRegistro" id="" value={userInfo.tipoRegistro} onChange={handleInputChange}>
                                    <option value="autor">Autor</option>
                                    <option value="lector">Lector</option>
                                </select>
                            </label>
                            {/* Mensaje general de error */}
                            <div className="error-message">{mensajeError || registerError}</div>

                            <div className='buttones'>
                                <p style={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }} onClick={() => {switchToIniciar()}}>¿ Ya tiene una cuenta ?</p>
                                {/* botón de registro */}
                                <button type="submit">Registrar</button>
                            </div>
                        </form>
                    ) : null}
                </div>
        </>
    );
}

export default Author; 