import React from 'react'
import { NavLink } from 'react-router-dom'
import { Routes,Route } from 'react-router-dom'
import GestionLector from './GestionLector'
import GestionAutor from './GestionAutor'
import './PaginaAdmin.css'
import { useState } from 'react';
const PaginaAdmin = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='pagina-admin'>
      {/* parte de encabezado */}
      <header>
        <h1>Administrador de TunkBook</h1>
      </header>
      {/* parte de administrador */}
      <main className='main-admin'>

      <nav className="nav-admin">
        <ul className="menu-admin">
          <li className="menu-admin-item">
            <div>
              <div className={`menu-admin-title ${isOpen ? 'open' : ''}`}
              onClick={()=>setIsOpen(!isOpen)}
              >Gestion de Cuentas</div>
              <div>
              <NavLink to={"/"} className={`menu-admin-title`}>
                  ver la página prinicipal
                </NavLink>
              </div>
              
            </div>
           
            <ul className={`submenu ${isOpen ? 'open' : ''}`}>
              <li><NavLink to="/paginaAdmin/usuarios" className="menu-admin-link">Gestion del Usuarios</NavLink></li>
              <li><NavLink to="/paginaAdmin/autores" className="menu-admin-link">Gestion del Autor</NavLink></li>
            </ul>
          </li>
        </ul>
      </nav>

        <Routes>
            {/* el path es relativo */} 
          <Route path="usuarios" element={<GestionLector/>} />
          <Route path="autores" element={<GestionAutor/>} />
        </Routes>
      </main>
    </div>
  )
}

export default PaginaAdmin
