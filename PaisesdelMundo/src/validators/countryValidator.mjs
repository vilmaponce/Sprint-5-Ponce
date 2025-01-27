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
      .trim() // Eliminar espacios en blanco al principio y al final
      .notEmpty().withMessage('El índice Gini no puede estar vacío.') // Validar que no esté vacío
      .isFloat({ min: 0, max: 100, decimal_digits: '0,2' }) // Validar que sea un número entre 0 y 100 con hasta 2 decimales
      .withMessage('El índice Gini debe ser un número entre 0 y 100, con hasta dos decimales.'),
    
  // Para los timezones
  body('timezones')
  .isArray().withMessage('La zona horaria debe ser un array de cadenas de texto')
  .custom((timezones) => {
    return timezones.every(tz => 
      typeof tz === 'string' && 
      tz.match(/^UTC[+-]\d{2}:\d{2}$/)  // Solo acepta el formato UTC±HH:MM
    );
  })
  .withMessage('Cada zona horaria debe tener el formato "UTC±HH:MM", por ejemplo, "UTC-06:00".'),


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
    .optional() // La validación es opcional si el campo Gini no se proporciona
    .trim() // Eliminar espacios en blanco al principio y al final
    .notEmpty().withMessage('El índice Gini no puede estar vacío.') // Validar que no esté vacío
    .isFloat({ min: 0, max: 100, decimal_digits: '0,2' }) // Validar que sea un número entre 0 y 100 con hasta 2 decimales
    .withMessage('El índice Gini debe ser un número entre 0 y 100, con hasta dos decimales.'),


  body('timezones')
    .optional()
    .custom((timezones) => {
      // Si es una cadena, la convierte en un array
      if (typeof timezones === 'string') {
        timezones = [timezones];
      }
      
      // Validar que cada zona horaria sea una cadena válida con el formato UTC±hh:mm
      return timezones.every(timezone =>
        typeof timezone === 'string' && /^UTC[+-]\d{2}:\d{2}$/.test(timezone)
      );
    })
    .withMessage('Cada zona horaria debe tener el formato "UTC±HH:MM", por ejemplo, "UTC-05:00".'),
  
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
