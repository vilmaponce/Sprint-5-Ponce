import { body, param } from 'express-validator';


// Validación para crear un país
export const crearPaisValidation = [
  body('name')
    .notEmpty().withMessage('El nombre del país es obligatorio')
    .isString().withMessage('El nombre del país debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre del país debe tener entre 3 y 100 caracteres'),

  body('capital')
    .notEmpty().withMessage('La capital es obligatoria')
    .isString().withMessage('La capital debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('La capital debe tener entre 3 y 100 caracteres'),

  body('region')
    .notEmpty().withMessage('La región es obligatoria')
    .isString().withMessage('La región debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('La región debe tener entre 3 y 100 caracteres'),

  body('population')
    .notEmpty().withMessage('La población es obligatoria')
    .isInt({ min: 0 }).withMessage('La población debe ser un número entero mayor o igual a 0'),
  
  body('area')
    .optional()
    .isInt({ min: 1 }).withMessage('El área debe ser un número entero mayor que 0'),

  body('languages')
    .optional()
    .isObject().withMessage('Languages debe ser un objeto')
    .custom((languages) => {
      return Object.keys(languages).every(key =>
        typeof key === 'string' && key.trim().length >= 2 && key.trim().length <= 60 &&
        typeof languages[key] === 'string' && languages[key].trim().length >= 2 && languages[key].trim().length <= 60
      );
    }).withMessage('Cada idioma debe tener un código de idioma válido y un nombre de idioma con entre 2 y 60 caracteres'),

  body('flag')
    .optional()
    .isURL().withMessage('La URL de la bandera debe ser válida'),
];

// Validación para actualizar un país
export const actualizarPaisValidation = [
  param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),

  body('name')
    .optional()
    .notEmpty().withMessage('El nombre del país no puede estar vacío')
    .isString().withMessage('El nombre del país debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre del país debe tener entre 3 y 100 caracteres'),

  body('capital')
    .optional()
    .notEmpty().withMessage('La capital no puede estar vacía')
    .isString().withMessage('La capital debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('La capital debe tener entre 3 y 100 caracteres'),

  body('region')
    .optional()
    .notEmpty().withMessage('La región no puede estar vacía')
    .isString().withMessage('La región debe ser una cadena de texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('La región debe tener entre 3 y 100 caracteres'),

  body('population')
    .optional()
    .isInt({ min: 0 }).withMessage('La población debe ser un número entero mayor o igual a 0'),

  body('area')
    .optional()
    .isInt({ min: 1 }).withMessage('El área debe ser un número entero mayor que 0'),

  body('languages')
    .optional()
    .isArray().withMessage('Los idiomas deben ser un arreglo')
    .custom((languages) => languages.every(language =>
      typeof language === 'string' &&
      language.trim().length >= 2 &&
      language.trim().length <= 60
    )).withMessage('Cada idioma debe ser una cadena de texto sin espacios en blanco y tener entre 2 y 60 caracteres'),

  body('flag')
    .optional()
    .isURL().withMessage('La URL de la bandera debe ser válida'),
];

// Validación para eliminar un país
export const eliminarPaisValidation = [
  param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),
];
