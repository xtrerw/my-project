import React, { useState, useEffect } from 'react';
import Author from './Author';
import './MisDatos.css';
import { Route, Routes,Link } from 'react-router-dom';
import CambiarContrasena from './CambiarContrasena';
import EditarInformacion from './EditarInformacion';


const MisDatos = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Mi Tunk"); // controlar el contenido seleccionado

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      setIsRegistered(true);

      fetch(`http://localhost:5001/autor/${userId}`)
        .then(response => response.json())
        .then(data => {
          setUserData(data);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  return (
    <>
      {isRegistered && userData ? (
        <div className="profile-container">
          {/* parte izquierda */}
          <aside className="profile-sidebar">
            <h2 
              className={selectedTab === "Mi Tunk" ? "active-tab" : ""}
              onClick={() => setSelectedTab("Mi Tunk")}
            >
              Mi Tunk
            </h2>
            <h2 
              className={selectedTab === "Dirección" ? "active-tab" : ""}
              onClick={() => setSelectedTab("Dirección")}
            >
              Dirección
            </h2>
          </aside>

          {/* parte información derecha */}
          <main className="profile-content">
            <Routes>
              <Route path='/' element={(
                <>
                  <h1>Información Personal</h1>
                  {/* información perfil */}
                  {selectedTab === "Mi Tunk" && (
                    <section className="info-section">
                      <div className="info-item">
                        <span className="info-label">Nombre:</span>
                        <span className="info-value">{userData.nombre} {userData.apellido}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Género:</span>
                        <span className="info-value">{userData.sexo || "No especificado"}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Nacionalidad:</span>
                        <span className="info-value">{userData.nacionalidad || "No especificado"}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Correo Electrónico:</span>
                        <span className="info-value">{userData.email}</span>
                      </div>
                    </section>
                  )}
                  {/* dirección */}
                  {selectedTab === "Dirección" && (
                    <section className="info-section">
                      <div className="info-item">
                        <span className="info-label">País:</span>
                        <span className="info-value">{userData.pais || "No especificado"}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Provincia:</span>
                        <span className="info-value">{userData.provincia || "No especificado"}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Dirección:</span>
                        <span className="info-value">{userData.direccion || "No especificado"}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Código Postal:</span>
                        <span className="info-value">{userData.codigoPostal || "No especificado"}</span>
                      </div>
                    </section>
                  )}

                  <div className="info-actions">
                    <Link className="edit-link" to="editar">Editar Información</Link>
                    <Link className="change-password" to="password">Cambiar Contraseña</Link>
                  </div>
                </>
              )}/>
               <Route path="editar" element={<EditarInformacion />} />
               <Route path="password" element={<CambiarContrasena />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Author />
      )}
    </>
  );
}

export default MisDatos;