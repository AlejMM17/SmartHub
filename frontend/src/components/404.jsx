import React from 'react'

function NotFound() {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>404</h1>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <Link to="/" style={{ color: 'blue' }}>Volver al inicio</Link>
      </div>
    );
  }
export default NotFound