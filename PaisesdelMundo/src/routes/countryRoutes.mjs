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

/* Rutas para obtener información */
// Rutas para obtener información
router.get('/', obtenerTodosLosPaisesController);  // Cambié '/countries' por '/'
router.get('/:id', obtenerPaisPorIdController);  // Cambié '/countries/:id' por '/:id'
router.get('/search/:atributo/:valor', buscarPaisesPorAtributoController);  // Cambié '/countries/search/:atributo/:valor' por '/search/:atributo/:valor'
router.get('/edit/:id', mostrarFormularioDeEdicion);  // Cambié '/countries/edit/:id' por '/edit/:id'


router.post('/add-country', crearPaisValidation, validationHandler, crearPaisController);  // Cambié '/countries' por '/'
router.put('/:id', actualizarPaisValidation, validationHandler, actualizarPaisController);  // Cambié '/countries/:id' por '/:id'
router.delete('/:id', eliminarPaisValidation, validationHandler, eliminarPaisController);  // Cambié '/countries/:id' por '/:id'

export default router;