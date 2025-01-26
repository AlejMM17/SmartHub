# SmartHub

Projecte per gestionar classes permetent afegir tasques i skills amb puntuacions juntant amb gamificació.

## Descripción

SmartHub es una plataforma diseñada para facilitar la gestión de clases, permitiendo a los profesores crear y asignar tareas, evaluar habilidades y gamificar el proceso de aprendizaje.

## Características

- Gestión de proyectos y actividades.
- Evaluación de habilidades con puntuaciones.
- Importación de estudiantes desde archivos CSV.
- Interfaz de usuario intuitiva y moderna.
- Soporte para múltiples roles (profesor y estudiante).

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/AlejMM17/SmartHub.git
    ```

2. Navega al directorio del proyecto:

    ```bash
    cd SmartHub
    ```

3. Instala las dependencias del backend:

    ```bash
    cd backend
    npm install
    ```

4. Instala las dependencias del frontend:

    ```bash
    cd ../frontend
    npm install
    ```

## Configuración

1. Crea un archivo `.env` en el directorio `backend` con las siguientes variables de entorno:

    ```env
    MONGODB_URI=tu_uri_de_mongodb
    PORT=3001
    ```

## Uso

1. Inicia el servidor backend:

    ```bash
    cd backend
    npm start
    ```

2. Inicia el servidor frontend:

    ```bash
    cd frontend
    npm run build
    npm start
    ```

3. Abre tu navegador y navega a [http://localhost:3000](http://localhost:3000) para ver la aplicación en funcionamiento.
