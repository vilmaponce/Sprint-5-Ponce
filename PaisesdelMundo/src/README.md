### Explicación de la construcción de la app

#### 1. **Introducción del Proyecto**

Este proyecto es una aplicación full-stack que utiliza Node.js, Express, MongoDB Compass, EJS Layouts, y Axios. Integra una API externa de países para manejar datos y realiza operaciones CRUD tanto desde el backend como desde el frontend.

#### 2. **Estructura del Proyecto**

La estructura del proyecto se organiza de la siguiente manera:

- **Archivo principal**: app.mjs (punto de entrada de la aplicación).
- **Carpetas principales**:
  - `src`: Contiene todo el código fuente.
    - `routes`: Define las rutas que conectan el cliente con los controladores.
    - `controllers`: Implementa la lógica de negocio y manipula los datos provenientes del frontend o de la base de datos.
    - `models`: Define los esquemas y la interacción con la base de datos MongoDB.
    - `views`: Contiene las vistas EJS para el frontend.
    - `public`: Archivos estáticos como CSS, JS y recursos de imagen.

#### 3. **Configuración Inicial-Ejemplo-Mayor informacion , chequear en el proyecto**

1. **Inicialización del Proyecto**:

   - Usé el comando `npm init -y` para generar el archivo `package.json`.
   - Instalé las dependencias necesarias:
     ```bash
     npm install express mongoose ejs express-validator axios express-ejs-layouts dotenv
     ```

2. **Configuración del servidor**:

   - Configuré Express en el archivo app.mjs
   - Incluí middlewares para manejar JSON, EJS Layouts y solicitudes estáticas.

   ```javascript
   import express from 'express';
   import mongoose from 'mongoose';
   import dotenv from 'dotenv';
   import ejsLayouts from 'express-ejs-layouts';

   dotenv.config();

   const app = express();
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(ejsLayouts);
   app.set('view engine', 'ejs');

   app.use(express.static('public'));

   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
       .then(() => console.log('Conectado a MongoDB'))
       .catch(err => console.error(err));

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
   ```

#### 4. **Diseño de la API y Base de Datos**

1. **Esquemas y Modelos**:

   - En `models`, creé esquemas usando Mongoose. Ejemplo de un esquema para países:
     ```javascript
     import mongoose from 'mongoose';

     const CountrySchema = new mongoose.Schema({
         name: String,
         population: Number,
         region: String,
     });

     export default mongoose.model('Country', CountrySchema);
     ```

2. **Conexión con la API Externa**:

   - Usé Axios en los controladores para obtener datos de la API externa.
     ```javascript
     import axios from 'axios';

     const fetchCountries = async () => {
         const response = await axios.get('https://restcountries.com/v3.1/all');
         return response.data;
     };

     export { fetchCountries };
     ```

#### 5. **Implementación de Rutas y Controladores**

1. **Rutas**:

   - En `routes`, definí rutas REST.
   - Ejemplo:
     ```javascript
     import express from 'express';
     import { getCountries, addCountry } from '../controllers/countryController.mjs';
     const router = express.Router();

     router.get('/countries', getCountries);
     router.post('/countries', addCountry);

     export default router;
     ```

2. **Controladores**:

   - Los controladores implementan la lógica para manejar solicitudes.
   - Ejemplo:
     ```javascript
     import Country from '../models/Country.mjs';
     import { validationResult } from 'express-validator';

     const getCountries = async (req, res) => {
         const countries = await Country.find();
         res.render('countries', { countries });
     };

     const addCountry = async (req, res) => {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
             return res.status(400).render('addCountry', { errors: errors.array() });
         }

         const newCountry = new Country(req.body);
         await newCountry.save();
         res.redirect('/countries');
     };

     export { getCountries, addCountry };
     ```

#### 6. **Validaciones con Express Validator**

- Configuré validaciones para las rutas POST.
- Ejemplo:
  ```javascript
  import { body } from 'express-validator';

  const validateCountry = [
      body('name').notEmpty().withMessage('El nombre es obligatorio'),
      body('population').isInt({ min: 1 }).withMessage('La población debe ser un número entero positivo'),
  ];

  export { validateCountry };
  ```

#### 7. **Integración del Frontend con EJS**

1. **Layouts y Vistas**:

   - En `views`, configuré plantillas EJS.

   - Ejemplo de un layout base:

     ```html
     <!DOCTYPE html>
     <html>
     <head>
         <title><%= title %></title>
         <link rel="stylesheet" href="/css/style.css">
     </head>
     <body>
         <%- body %>
     </body>
     </html>
     ```

   - Ejemplo de vista para mostrar países:

     ```html
     <h1>Lista de Países</h1>
     <ul>
         <% countries.forEach(country => { %>
             <li><%= country.name %> - <%= country.population %></li>
         <% }); %>
     </ul>
     ```

2. **Formularios**:

   - Ejemplo de formulario para agregar un país:
     ```html
     <form action="/countries" method="POST">
         <label for="name">Nombre:</label>
         <input type="text" name="name" id="name">

         <label for="population">Población:</label>
         <input type="number" name="population" id="population">

         <button type="submit">Agregar</button>
     </form>
     ```

#### 8. **Flujo de Trabajo Completo**

1. **Cuando se realiza una petición desde el frontend**:

   - El formulario en una vista EJS envía datos al servidor mediante un POST.
   - La ruta correspondiente llama al controlador.
   - El controlador valida los datos, los guarda en MongoDB y redirige al usuario a otra vista.

2. **Cuando se realiza una petición desde Postman**:

   - La ruta recibe la solicitud y pasa los datos al controlador.
   - El controlador realiza operaciones en la base de datos y devuelve una respuesta JSON.

#### 9. **Conclusión**

Este proyecto combina herramientas modernas y principios de desarrollo modular. La integración de MongoDB, validaciones, EJS y Axios permite un flujo eficiente entre el frontend y el backend, asegurando una experiencia de usuario completa.


