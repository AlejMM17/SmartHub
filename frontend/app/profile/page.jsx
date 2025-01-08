"use client";

import { useUser } from '@/context/UserContext';
import { SidebarDemo as StudentSidebar } from '@/components/SidebarStudent';
import { SidebarDemo as ProfessorSidebar } from '@/components/SidebarProfessor';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSettings() {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //Crear el hook para que se pueda updatear el user. poner la imagen y cambiar para 
  //que primero sea visual y con un boton te deje editar, esto es de prueba

  const Layout = user?.role === 'professor' ? ProfessorSidebar : StudentSidebar;

  return (
    <Layout>
      <div>
        <h1>Configuración del Perfil</h1>
        <form>
          <div>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </Layout>
  );
}