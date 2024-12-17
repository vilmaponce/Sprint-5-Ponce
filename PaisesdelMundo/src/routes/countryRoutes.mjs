import express from 'express';
import {
  obtenerPaisPorIdController,
  obtenerTodosLosPaisesController,
  buscarPaisesPorAtributoController,
  crearPaisController,
  actualizarPaisController,
  mostrarFormularioDeEdicion,
  eliminarPaisController
} from '../controllers/countryController.mjs';
import {
  crearPaisValidation,
  actualizarPaisValidation,
  eliminarPaisValidation
} from '../validators/countryValidator.mjs';
import { validationHandler } from '../validators/validationHandler.mjs';

const router = express.Router();

//Esto significa que cualquier ruta definida en countryRoutes será accesible bajo el prefijo /api/countries. Por ejemplo:

//GET /api/countries/ → Llama a obtenerTodosLosPaisesController.
//GET /api/countries/:id → Llama a obtenerPaisPorIdController.
//POST /api/countries/add-country → Llama a crearPaisController.
//La línea router.post('/add-country', ...) se combina con /api/countries.


// Rutas para obtener información
router.get('/', obtenerTodosLosPaisesController); 
router.get('/:id', obtenerPaisPorIdController);  
router.get('/search/:atributo/:valor', buscarPaisesPorAtributoController);  
router.get('/:id/edit', mostrarFormularioDeEdicion);  

//RUTA POST--->Ruta creacion de pais 
router.post('/add-country', crearPaisValidation, validationHandler, crearPaisController); 

// Ruta POST ---> Para editar país desde el formulario (usando method-override para PUT)
router.post('/editar/:id', actualizarPaisController);

//RUTA PUT ----> Ruta para actualizacion de un pais
router.put('/:id', actualizarPaisValidation, validationHandler, actualizarPaisController);

//RUTA DELETE  
router.delete('/:id', eliminarPaisValidation, validationHandler, eliminarPaisController);  

export default router;