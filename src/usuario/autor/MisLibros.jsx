import React, { useState, useEffect } from 'react';
import Author from './Author';

const MisLibros = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // 检查 localStorage 里是否存有用户的 ID
    const id = localStorage.getItem("userId");

    if (id) {
      setIsLoggedIn(true);
      setUserId(id);
    }
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className="mis-libros-container">
          <h2>Mis Libros</h2>
          <p>Bienvenido, tu ID es: <strong>{userId}</strong></p>
          <p>Aquí puedes gestionar tus libros.</p>
        </div>
      ) : (
        <Author />
      )}
    </>
  );
}

export default MisLibros;

