import express from 'express';
import methodOverride from 'method-override';
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
import { eliminarPaisValidation } from './validators/countryValidator.mjs';

const app = express();
const PORT = process.env.PORT || 3000;


// Usa el middleware de method-override
app.use(methodOverride('_method'));


// Obtener __dirname en un módulo ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));



// Conexión a la base de datos
connectDB();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


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
    console.log(countries); // Verifica que estos datos se están pasando correctamente
    // Verifica el encabezado 'Accept' para determinar el tipo de respuesta
    if (req.accepts('json')) {
      // Si se acepta JSON, responde con JSON
      res.json(countries);
    } else {
      // De lo contrario, renderiza la vista HTML
      res.redirect('/countries');
    }
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).send('Error al cargar países');
  }
});



// Mostrar formulario para añadir un país
app.get('/add-country', (req, res) => {
  res.render('form', { country: null });  // Este formulario se puede reutilizar o adaptar para países
});

app.use((req, res, next) => {
  if (req.body.timezones && typeof req.body.timezones === 'string') {
    req.body.timezones = req.body.timezones.split(',').map(tz => tz.trim());
  }
  next();
});




// *****************POST para crear un nuevo país*****************************************
app.post('/add-country', [

  body('name.common')
    .notEmpty().withMessage('El nombre común es obligatorio')
    .isString().withMessage('El nombre común debe ser una cadena de texto')
    .isLength({ min: 3, max: 90 }).withMessage('El nombre común debe tener entre 3 y 90 caracteres'),


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
    .isLength({ min: 3, max: 100 }).withMessage('El creador debe tener entre 3 y 100 caracteres'),

  // Validación para el campo 'region'
  body('region')
    .notEmpty().withMessage('La región es obligatoria')
    .isString().withMessage('La región debe ser una cadena de texto')
    .isLength({ min: 3, max: 100 }).withMessage('La región debe tener entre 3 y 100 caracteres'),


  // Validación para el campo 'gini'
  body('gini')
    .optional() // Hace que el campo sea opcional
    .isFloat({ min: 0, max: 100 }).withMessage('El índice Gini debe estar entre 0 y 100')
    .custom((value) => {
      if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
        throw new Error('El índice Gini debe ser un número con hasta dos decimales.');
      }
      return true;
    }),

    // Validación para el campo 'timezones' en la creación de un país
  body('timezones')
    .optional() // Si es opcional
    .isArray().withMessage('La zona horaria debe ser un array de cadenas de texto.')
    .custom((timezones) => {
      return timezones.every(tz => typeof tz === 'string' && /^UTC[+-]\d{2}:\d{2}$/.test(tz));
    }).withMessage('Cada zona horaria debe tener el formato "UTC±HH:MM", por ejemplo, "UTC-05:00".'),

  // Validación para el campo 'borders'
  body('borders')
    .optional() // Hace que el campo sea opcional
    .isArray().withMessage('Las fronteras deben ser un array de códigos de 3 letras')
    .custom((borders) => {
      return borders.every(border => /^[A-Z]{3}$/.test(border));
    }).withMessage('Cada frontera debe ser un código de 3 letras mayúsculas')

], async (req, res) => {
    console.log('Datos recibidos:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  try {
    // Manejo inteligente de languages para soportar tanto string como array
    let languages = req.body.languages;
    if (typeof languages === 'string') {
      // Si es string (caso Postman), hacer split
      languages = languages.split(',').map(lang => lang.trim());
    } else if (Array.isArray(languages)) {
      // Si ya es array (caso frontend), usarlo directamente
      languages = languages;
    } else {
      // Si no es ni string ni array, usar array vacío
      languages = [];
    }

    // Manejo de gini (si está presente)
    let gini = req.body.gini || null; // Si no se pasa, se coloca null

    // Manejo de timezone (si está presente)
    let timezones = req.body.timezones;

    if (typeof timezones === 'string') {
      timezones = timezones.split(',').map(tz => tz.trim());
    } else if (!Array.isArray(timezones)) {
      timezones = [];
    }


    // Manejo de borders (si están presentes)
    let borders = req.body.borders || [];


    const newCountry = new Country({
      name: {
        common: req.body.name.common,
        official: req.body.name.official
      },
      capital: req.body.capital,
      area: req.body.area,
      population: req.body.population,
      languages: languages,
      creator: req.body.creator || "Vilma Ponce",
      region: req.body.region,
      borders: borders,
      gini: gini, // Añadir gini al nuevo país
      timezones: timezones // Añadir timezone al nuevo país
    });

    await newCountry.save();
    res.redirect('/api/countries');
  } catch (error) {
    console.error('Error al crear país:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: error.message || 'No se pudo guardar el país debido a un error desconocido'
    });
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

    country.languages = country.languages || [];
    country.gini = country.gini || null;
    country.timezones = country.timezones || [];
    country.borders = country.borders || [];

    res.render('editar-pais', { country });
  } catch (err) {
    console.error('Error al obtener el país:', err);
    res.status(500).send('Error al obtener los datos del país');
  }
});

// Ruta POST/PUT para actualizar un país
app.post('/countries/editar/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('ID de país no válido');
  }

  try {


    const { nameCommon, capital, languages, gini, timezones, borders, creator } = req.body;
    console.log(req.body);
    // Verifica el contenido de la solicitud
    const country = await Country.findByIdAndUpdate(id, {
      nameCommon,
      capital,
      languages,
      gini,
      timezones,
      borders,
      creator
    });

    if (!country) {
      return res.status(404).send('País no encontrado');
    }

    res.redirect('/countries'); // Redirige a la lista de países
  } catch (err) {
    console.error('Error al actualizar el país:', err);
    res.status(500).send('Error al actualizar los datos del país');
  }
});


// Ruta para actualizar un país
app.put('/countries/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { name, capital, area, population, languages, region, gini, timezones, borders, creator } = req.body;

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
      region,
      gini,
      timezones,
      borders,
      creator

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
app.delete('/:id', eliminarPaisValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCountry = await Country.findByIdAndDelete(id);
    if (!deletedCountry) {
      return res.status(404).json({ error: 'País no encontrado' });
    }

    res.status(200).json({ success: true, message: 'País eliminado exitosamente' });

  } catch (error) {
    console.error('Error al eliminar el país:', error);
    res.status(500).json({ error: 'Error al eliminar el país' });
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
