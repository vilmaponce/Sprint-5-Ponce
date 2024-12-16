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


// Middleware para procesar datos JSON y formularios
app.use(express.json()); // Para manejar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para manejar formularios



// Middleware para establecer 'title' de manera global
app.use((req, res, next) => {
  res.locals.title = 'Lista de Países';  // Modificado el título
  next();
});

// Ruta para la página principal (modificada para países)
app.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    console.log(countries); // Esto te permitirá ver qué datos se están pasando a la vista
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
app.post('/add-country', [
  body('name.official')
    .notEmpty().withMessage('El nombre oficial es obligatorio')
    .isString().withMessage('El nombre oficial debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 90 }).withMessage('El nombre oficial debe tener entre 3 y 90 caracteres'),

  body('capital')
    .notEmpty().withMessage('La capital es obligatoria')
    .isArray().withMessage('La capital debe ser un array de cadenas de texto')
    .custom((capitals) => {
      return capitals.every(capital => typeof capital === 'string' && capital.length >= 3 && capital.length <= 90);
    }).withMessage('Cada capital debe tener entre 3 y 90 caracteres'),

  body('area')
    .isInt({ min: 1 }).withMessage('El área debe ser un número entero positivo mayor que 0'),

  body('population')
    .isInt({ min: 1 }).withMessage('La población debe ser un número entero positivo'),

  body('languages')
    .isArray().withMessage('Los idiomas deben ser un array')
    .custom((languages) => {
      return languages.every(language =>
        typeof language === 'string' && language.trim().length >= 2 && language.trim().length <= 60
      );
    }).withMessage('Cada idioma debe ser una cadena de texto válida con entre 2 y 60 caracteres'),

  body('creator')
    .notEmpty().withMessage('El creador es obligatorio')
    .isString().withMessage('El creador debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El creador debe tener entre 3 y 100 caracteres')

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Convierte el campo 'languages' en un arreglo si es una cadena
    const languages = req.body.languages ? req.body.languages.split(',') : [];

    // Obtiene la URL de la bandera
    const flag = req.body.flag || ''; // Deberías agregar validación para asegurarte de que sea una URL válida si es necesario

    // Asignar el nombre del creador desde el cuerpo de la solicitud
    const creator = req.body.creator || "Vilma Ponce"; // Usa el nombre del creador si está en la solicitud, sino asigna un valor predeterminado

    const newCountry = new Country({
      name: {
        official: req.body.name.official,  // Usamos name.official en lugar de solo name
      },
      capital: req.body.capital,
      area: req.body.area,
      population: req.body.population,
      languages: languages,
      creator: creator,
      flag: flag,  // Aquí agregamos la bandera
      borders: req.body.borders || [], // Asegúrate de manejar la propiedad 'borders' si la recibes
    });

    await newCountry.save();
    res.redirect('/add-country');
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
      languages
      
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
