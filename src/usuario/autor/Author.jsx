import { useState } from 'react';
import "./Author.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
function Author() {
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
                //guardar en local storage en caso de que se haya iniciado sesión correctamente
                localStorage.setItem("loggedInUser", JSON.stringify(res));
                localStorage.setItem("userId", res._id);
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
        fechaNacimiento: '',
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
                //guardar en local storage en caso de que se haya registrado correctamente
            }
        } catch (error) {
            console.error('Error registering user:', error);
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
                        <form onSubmit={handleIniciar} method='POST'>
                            <input type="text" name='username' placeholder='Username' onChange={(e) => setAutor(e.target.value)} required />
                            <input type="password" name='password' placeholder='Contraseña' onChange={(e) => setPwd(e.target.value)} required />
                            <div className='buttones'>
                                <button type="submit">Iniciar Sesión</button>
                                <button onClick={() => {setRegistro("registro");}}>Registrar</button>
                            </div>
                        </form>
                    ) : actionRegistro === "registro" ? (
                        //Formulario para registro
                        <form onSubmit={handleRegister} method='POST'>
                            <input type="text" name="username" placeholder="Username" value={userInfo.username} onChange={handleInputChange} required/>
                            <input type="text" name="nombre" placeholder="Nombre" value={userInfo.nombre} onChange={handleInputChange} required/>
                            <input type="text" name='apellido' placeholder='apellido' value={userInfo.apellido} onChange={handleInputChange} required/>
                            <DatePicker
                                    locale="es"
                                    selected={
                                      // muestra la fecha de nacimiento anteriormente guardada
                                      // o null si no hay fecha guardada
                                      userInfo.fechaNacimiento
                                        ? new Date(userInfo.fechaNacimiento)
                                        : null
                                    }
                                    onChange={(date) => {
                                      setFormData({
                                        ...userInfo,
                                        // Convertir la fecha de nacimiento a formato ISO
                                        fechaNacimiento: date
                                          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                                          : ""
                                      });
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Selecciona una fecha"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    // Añadir clase de error condicional
                                    className={`input-text ${errores.fechaNacimiento ? "error-input" : ""}`}
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
                            <input type="password" name="password" placeholder="Password" value={userInfo.password} onChange={handleInputChange} required/>
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