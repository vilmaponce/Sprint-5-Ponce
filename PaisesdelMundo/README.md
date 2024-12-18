


# Paises del Mundo - Proyecto Node.js

## Descripcion General

Este proyecto implementa una aplicación web desarrollada con Node.js, Express y una base de datos MongoDB. El objetivo es ofrecer una API para manejar información de países del mundo, incluyendo datos relevantes y funcionalidades de CRUD (Crear, Leer, Actualizar y Eliminar).

---

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework de servidor para Node.js.
- **MongoDB**: Base de datos NoSQL para almacenar los datos.
- **Mongoose**: ODM (Object Document Mapper) para MongoDB.
- **dotenv**: Para manejar variables de entorno.
- **Postman/Thunder Client**: Para pruebas de la API.

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <URL-DEL-REPOSITORIO>
   ```
2. Instalar las dependencias:
   ```bash
   cd PaisesdelMundo
   npm install
   ```
3. Configurar las variables de entorno:
   - Crear un archivo `.env` en la carpeta principal.
   - Definir la URI de la base de datos MongoDB:
     ```
     MONGO_URI=mongodb://localhost:27017/paisesdb
     PORT=3000
     ```
4. Iniciar la aplicación:
   ```bash
   node src/app.mjs
   ```
   La aplicación se ejecuta en `http://localhost:3000`.

---

## Estructura del Proyecto

```
PaisesdelMundo/
│
├── package.json          # Configuración de dependencias y scripts
├── src/
│   ├── app.mjs           # Configuración principal del servidor Express
│   ├── config/
│   │   └── dbConfig.mjs  # Conexión a la base de datos MongoDB
│   ├── controllers/
│   │   └── countryController.mjs  # Lógica para manejar peticiones HTTP
│   ├── models/
│   │   └── Country.mjs   # Modelo de datos de los países
│
└── .env                  # Variables de entorno (ignorado en Git)
```

---

## Endpoints de la API

| Método | Ruta                | Descripción                   |
| ------ | ------------------- | ----------------------------- |
| GET    | /api/countries      | Obtener todos los países.     |
| GET    | /api/countries/\:id | Obtener un país por su ID.    |
| POST   | /api/countries      | Crear un nuevo país.          |
| PUT    | /api/countries/\:id | Actualizar un país existente. |
| DELETE | /api/countries/\:id | Eliminar un país por su ID.   |

---

## Documentación de Archivos Clave

### 1. `app.mjs`

- **Propósito**: Configurar y levantar el servidor Express.
- **Funciones clave**:
  - Configura middlewares globales como `express.json()` para manejar datos en formato JSON.
  - Define rutas usando el controlador `countryController.mjs`.
  - Escucha en el puerto definido en las variables de entorno o en `3000` por defecto.

**Código relevante:**

```javascript
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/dbConfig.mjs';
import countryRouter from './controllers/countryController.mjs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/countries', countryRouter);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2. `dbConfig.mjs`

- **Propósito**: Establecer la conexión con la base de datos MongoDB.
- **Funciones clave**:
  - Conecta con MongoDB utilizando `mongoose.connect()`.
  - Muestra un mensaje de confirmación si la conexión es exitosa.

**Código relevante:**

```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
```

### 3. `countryController.mjs`

- **Propósito**: Manejar las peticiones relacionadas con los países.
- **Funciones clave**:
  - **GET /api/countries**: Devuelve todos los países almacenados.
  - **GET /api/countries/\*\*\*\*****:id**: Devuelve un país según su ID.
  - **POST /api/countries**: Agrega un nuevo país a la base de datos.
  - **PUT /api/countries/\*\*\*\*****:id**: Actualiza la información de un país existente.
  - **DELETE /api/countries/\*\*\*\*****:id**: Elimina un país según su ID.

**Código relevante:**

```javascript
import Country from '../models/Country.mjs';

export const getCountries = async (req, res) => {
    const countries = await Country.find();
    res.json(countries);
};

export const createCountry = async (req, res) => {
    const { name, capital, population } = req.body;
    const newCountry = new Country({ name, capital, population });
    await newCountry.save();
    res.json(newCountry);
};
```

### 4. `Country.mjs`

- **Propósito**: Definir el esquema de los datos para los países.
- **Funciones clave**:
  - Utiliza `mongoose.Schema` para definir la estructura de un documento de país.
  - Exporta el modelo para ser usado en los controladores.

**Código relevante:**

```javascript
import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    capital: { type: String, required: true },
    population: { type: Number, required: true }
});

export default mongoose.model('Country', countrySchema);
```

---

## Relación entre Archivos y Componentes

### Comunicación Backend

1. \`\` actúa como punto de entrada principal.
2. **Rutas**: `app.mjs` dirige las solicitudes a las rutas definidas en `countryController.mjs`.
3. **Controladores**: `countryController.mjs` maneja las operaciones CRUD invocando los métodos de Mongoose definidos en `Country.mjs`.
4. **Base de Datos**: La conexión es gestionada en `dbConfig.mjs`, asegurando que el backend pueda interactuar con MongoDB.

### Flujo de Trabajo

1. **Cliente (Frontend)** envía solicitudes HTTP al servidor (por ejemplo, `POST /api/countries`).
2. **Servidor (Express)** recibe la solicitud y la enruta al controlador adecuado.
3. **Controlador** interactúa con la base de datos a través del modelo definido en `Country.mjs`.
4. **Base de Datos** devuelve los datos o confirma la operación (por ejemplo, creación exitosa).
5. **Controlador** procesa la respuesta y la envía de vuelta al cliente.

---

## Consideraciones Finales

Este proyecto es ideal para aprender y practicar:

- Desarrollo de servidores RESTful con Express.
- Conexión y manejo de datos en MongoDB usando Mongoose.
- Separación de responsabilidades en controladores y modelos.
- Uso de variables de entorno para mayor seguridad.

---

## Autor

- **Nombre del estudiante**: Vilma Ponce
- **Proyecto realizado para**: Sprint 5 - Curso Node.js






