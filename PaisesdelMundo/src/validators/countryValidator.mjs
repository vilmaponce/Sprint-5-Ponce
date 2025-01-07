import { body, param } from 'express-validator';


// Validación para crear un país
export const crearPaisValidation = [

  // Validación para el nombre común del país
  body('name.common')
    .notEmpty().withMessage('El nombre común del país es obligatorio')
    .isString().withMessage('El nombre común debe ser una cadena de texto')
    .trim()
    .matches(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/).withMessage('El nombre común solo puede contener letras y espacios')
    .isLength({ min: 3, max: 90 }).withMessage('El nombre común debe tener entre 3 y 90 caracteres'),


  // Validación para el nombre del país
  body('name.official')
    .notEmpty().withMessage('El nombre oficial del país es obligatorio')
    .isString().withMessage('El nombre oficial debe ser una cadena de texto')
    .trim()
    .matches(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/).withMessage('El nombre oficial solo puede contener letras y espacios')
    .isLength({ min: 3, max: 90 }).withMessage('El nombre oficial debe tener entre 3 y 90 caracteres'),

  // Validación para la capital
  body('capital')
    .notEmpty().withMessage('La capital es obligatoria')
    .isArray({ min: 1 }).withMessage('La capital debe ser un array no vacío')
    .custom(capitals => {
      return capitals.every(capital =>
        typeof capital === 'string' &&
        /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(capital.trim()) &&
        capital.length >= 3 && capital.length <= 90
      );
    }).withMessage('Cada capital debe ser una cadena de texto válida (3-90 caracteres, solo letras y espacios)'),

  // Validación para la región
  body('region')
    .notEmpty().withMessage('La región es obligatoria')
    .isString().withMessage('La región debe ser una cadena de texto')
    .trim()
    .matches(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/).withMessage('La región solo puede contener letras y espacios')
    .isLength({ min: 3, max: 100 }).withMessage('La región debe tener entre 3 y 100 caracteres'),

  // Validación para las fronteras
  body('borders')
    .optional()
    .isArray().withMessage('Las fronteras deben ser un array de códigos de país')
    .custom((borders) => {
      return borders.every(border => /^[A-Z]{3}$/.test(border));
    }).withMessage('Cada código de frontera debe ser una cadena de 3 letras mayúsculas'),

  // Validación para la población
  body('population')
    .notEmpty().withMessage('La población es obligatoria')
    .isInt({ min: 0 }).withMessage('La población debe ser un número entero mayor o igual a 0'),

  // Para el Gini
  body('gini')
    .optional()
    .custom((value) => {
      // Si es un número simple
      if (typeof value === 'number') {
        return true;
      }
      // Si es un objeto con años
      if (typeof value === 'object' && value !== null) {
        const validYears = Object.keys(value).every(year => 
          /^\d{4}$/.test(year) && 
          typeof value[year] === 'number' &&
          value[year] >= 0 &&
          value[year] <= 100
        );
        return validYears;
      }
      return false;
    })
    .withMessage('Gini debe ser un número entre 0 y 100 o un objeto con años y valores numéricos'),

  // Para los timezones
  body('timezones')  
    .isArray({ min: 1 }).withMessage('Las zonas horarias deben ser un array de al menos un elemento.')
    .custom((timezones) => {
      return timezones.every(tz => typeof tz === 'string' && /^[A-Za-z]+\/[A-Za-z_\-]+$/.test(tz));
    }).withMessage('Cada zona horaria debe ser una cadena de texto válida, como "America/New_York"'),


  // Validación para el área
  body('area')
    .optional()
    .isInt({ min: 1 }).withMessage('El área debe ser un número entero mayor que 0'),

  // Validación para los idiomas
  body('languages')
    .optional()
    .isArray().withMessage('Languages debe ser un array')
    .custom((languages) => {
      return languages.every(language =>
        typeof language === 'string' && language.trim().length >= 2 && language.trim().length <= 60
      );
    }).withMessage('Cada idioma debe ser una cadena de texto válida con entre 2 y 60 caracteres'),

  // Validación para la URL de la bandera
  body('flag')
    .optional()
    .isURL().withMessage('La URL de la bandera debe ser válida'),

  // Validación para el creador
  body('creator')
    .notEmpty().withMessage('El creador es obligatorio')
    .isString().withMessage('El creador debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El creador debe tener entre 3 y 100 caracteres')
];

// Validación para actualizar un país
export const actualizarPaisValidation = [

  // Validación para el nombre común del país
  body('name.common')
    .optional()
    .isString().withMessage('El nombre común debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 90 }).withMessage('El nombre común debe tener entre 3 y 90 caracteres'),

  // Validación para el nombre oficial
  body('name.official')
    .not().isEmpty().withMessage('El nombre oficial del país es obligatorio')
    .isString().withMessage('El nombre oficial debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 90 }).withMessage('El nombre oficial debe tener entre 3 y 90 caracteres'),

  // Validación para la capital
  body('capital')
    .optional()
    .isArray().withMessage('La capital debe ser un array de cadenas de texto')
    .custom((capitals) => {
      return capitals.every(capital => typeof capital === 'string' && capital.length >= 3 && capital.length <= 90);
    }).withMessage('Cada capital debe ser una cadena de texto de entre 3 y 90 caracteres'),

  // Validación para la región
  body('region')
    .optional()
    .isString().withMessage('La región debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('La región debe tener entre 3 y 100 caracteres'),

  // Validación para las fronteras
  body('borders')
    .optional()
    .isArray().withMessage('Las fronteras deben ser un array de códigos de país')
    .custom((borders) => {
      return borders.every(border => /^[A-Z]{3}$/.test(border));
    }).withMessage('Cada código de frontera debe ser una cadena de 3 letras mayúsculas'),

  // Validación para la población
  body('population')
    .optional()
    .isInt({ min: 0 }).withMessage('La población debe ser un número entero mayor o igual a 0'),

  body('gini')
    .optional()
    .isNumeric().withMessage('Gini debe ser un número')
    .custom((gini) => {
      if (typeof gini === 'object') {
        return Object.keys(gini).every(year => /^[0-9]{4}$/.test(year) && typeof gini[year] === 'number');
      }
      return typeof gini === 'number'; // Permitir solo un número
    })
    .withMessage('Gini debe ser un número o un objeto de años con valores numéricos'),
  


  // Validación para las zonas horarias
  body('timezones')
    .optional()
    .isArray().withMessage('Las zonas horarias deben ser un array')
    .custom((timezones) => {
      return timezones.every(timezone =>
        typeof timezone === 'string' && /^[A-Za-z/_+-]+$/.test(timezone)
      );
    }).withMessage('Cada zona horaria debe ser una cadena válida como "Europe/Madrid" o "UTC+1"'),

  // Validación para el área
  body('area')
    .optional()
    .isInt({ min: 1 }).withMessage('El área debe ser un número entero mayor que 0'),

  // Validación para los idiomas
  body('languages')
    .optional()
    .isArray().withMessage('Languages debe ser un array')
    .custom((languages) => {
      return languages.every(language =>
        typeof language === 'string' && language.trim().length >= 2 && language.trim().length <= 60
      );
    }).withMessage('Cada idioma debe ser una cadena de texto válida con entre 2 y 60 caracteres'),

  // Validación para la URL de la bandera
  body('flag')
    .optional()
    .isURL().withMessage('La URL de la bandera debe ser válida'),

  // Validación para el creador
  body('creator')
    .optional()
    .isString().withMessage('El creador debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El creador debe tener entre 3 y 100 caracteres')
];


// Validación para eliminar un país
export const eliminarPaisValidation = [
  param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),
];
