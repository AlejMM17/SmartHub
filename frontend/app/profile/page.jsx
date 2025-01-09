"use client";


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUpdateUser from '@/hooks/useUpdateUser';
import { SidebarDemo as StudentSidebar } from '@/components/SidebarStudent';
import { SidebarDemo as ProfessorSidebar } from '@/components/SidebarProfessor';
import { useUser } from '@/context/UserContext';
import Cookies from 'js-cookie';
import { setAuthCookie } from '@/utils/setAuthCookie';

export default function ProfileSettings() {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({ name: '', email: '', image: null });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { updateUser, loading, error } = useUpdateUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = await updateUser(user._id, formData)
   
    if (updatedUser) {
      setUser(updatedUser); // Actualiza el estado del usuario primero
      setAuthCookie(updatedUser); // Luego actualiza la cookie con la información correcta
      setFormData({ name: updatedUser.name, email: updatedUser.email }); // Actualiza formData con los nuevos datos
      setIsEditing(false);
    }
  };
 
  const Layout = user?.role === 'professor' ? ProfessorSidebar : StudentSidebar;

  return (
    <Layout>
      <div>
        <h1>Configuración del Perfil</h1>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
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
            <div>
              <label htmlFor="image">Imagen</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={loading}>Guardar Cambios</button>
            {error && <p>{error}</p>}
          </form>
        ) : (
          <div>
            <p>Nombre: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <img src={user?.image} alt="User profile" />
            <button onClick={() => setIsEditing(true)}>Editar</button>
          </div>
        )}
      </div>
    </Layout>
  );
}