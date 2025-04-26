import React from 'react'
import { NavLink } from 'react-router-dom'
import { Routes,Route } from 'react-router-dom'
import GestionLector from './GestionLector'
import GestionAutor from './GestionAutor'
const PaginaAdmin = () => {
  return (
    <>
      <header>
        <nav>
            <ul>
                {/* link absoluto */}
                <li><NavLink to="/paginaAdmin/usuarios">Gestion del Usuarios</NavLink></li>
                <li><NavLink to="/paginaAdmin/autores">Gestion del Autor</NavLink></li>
            </ul>
        </nav>
      </header>
      <main>
        <Routes>
            {/* el path es relativo */} 
          <Route path="usuarios" element={<GestionLector/>} />
          <Route path="autores" element={<GestionAutor/>} />
        </Routes>
      </main>
    </>
  )
}

export default PaginaAdmin
