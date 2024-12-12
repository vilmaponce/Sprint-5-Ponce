import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { connectDB } from './config/dbConfig.mjs';
import countryRoutes from './routes/countryRoutes.mjs'; // Cambiado a 'countryRoutes'
import Country from './models/Country.mjs';  // Usando el modelo Country
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator';

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener __dirname en un módulo ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));


// Conexión a la base de datos
connectDB();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Configurar express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');


// Middleware para procesar datos del formulario
app.use(bodyParser.urlencoded({ extended: true })); // Formularios
app.use(express.json()); // JSON adicional

// Middleware para establecer 'title' de manera global
app.use((req, res, next) => {
  res.locals.title = 'Lista de Países';  // Modificado el título
  next();
});

// Ruta para la página principal (modificada para países)
app.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.render('index', {
      title: 'Lista de Países',
      countries: countries
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).send('Error al cargar países');
  }
});

// Mostrar formulario para añadir un país
app.get('/add-country', (req, res) => {
  res.render('form');  // Este formulario se puede reutilizar o adaptar para países
});

// POST para crear un nuevo país
// POST para crear un nuevo país
app.post('/countries', [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('capital').notEmpty().withMessage('La capital es obligatoria'),
  body('area').isFloat({ min: 0 }).withMessage('El área debe ser un número positivo'),
  body('population').isInt({ min: 1 }).withMessage('La población debe ser un número entero positivo'),
  body('languages').isArray().withMessage('Los idiomas deben ser una lista'),
  body('flag').notEmpty().withMessage('La URL de la bandera es obligatoria')  // Validación de la bandera
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Convierte el campo 'languages' en un arreglo si es una cadena
    const languages = req.body.languages ? req.body.languages.split(',') : [];

     // Obtiene la URL de la bandera
    const flag = req.body.flag;

    const newCountry = new Country({
      name: req.body.name,
      capital: req.body.capital,
      area: req.body.area,
      population: req.body.population,
      languages: languages,  // Aquí usas el arreglo 'languages'
      flag: flag  // Guardamos la URL de la bandera
    });

    await newCountry.save();
    res.redirect('/countries');
  } catch (error) {
    res.status(500).send('Error al crear el país');
  }
});



// Ruta para editar un país
app.get('/countries/editar/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('ID de país no válido');
  }

  try {
    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).send('País no encontrado');
    }

    res.render('editar-pais', { country });
  } catch (err) {
    console.error('Error al obtener el país:', err);
    res.status(500).send('Error al obtener los datos del país');
  }
});

// Ruta para actualizar un país
app.put('/countries/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { name, capital, area, population, languages, flag } = req.body;

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedCountry = await Country.findByIdAndUpdate(id, {
      name,
      capital,
      area,
      population,
      languages,
      flag
    }, { new: true });

    if (!updatedCountry) {
      return res.status(404).send('País no encontrado');
    }

    res.redirect('/countries');
  } catch (error) {
    res.status(500).send('Error al actualizar el país');
  }
});

// Ruta para eliminar un país
app.delete('/countries/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCountry = await Country.findByIdAndDelete(id);
    if (!deletedCountry) {
      return res.status(404).send('País no encontrado');
    }

    res.status(200).json({ success: true, message: 'País eliminado exitosamente' });

  } catch (error) {
    res.status(500).send('Error al eliminar el país');
  }
});

// Configuración de rutas API
app.use('/api/countries', countryRoutes);

// Manejador de ruta no encontrada
app.use((req, res) => {
  res.status(404).send({ mensaje: 'Ruta no encontrada' });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
