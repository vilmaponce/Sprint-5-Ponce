import { validationResult } from 'express-validator';

export const validationHandler = (req, res, next) => {


  
  // Obtener los resultados de la validación
  const errors = validationResult(req);

  // Si hay errores de validación, se devuelven al cliente con un status 400
  if (!errors.isEmpty()) {
    console.log('Errores de validación:', errors.array());
    return res.status(400).json({
      errors: errors.array(), // Devuelve los errores de validación como un array
    });
  }

  // Si no hay errores, se pasa al siguiente middleware o controlador
  next();
};
