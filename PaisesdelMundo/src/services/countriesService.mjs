import countryRepository from '../repositories/CountryRepository.mjs'; //repositorio de países
import Country from '../models/Country.mjs'; // modelo de país

// Obtener un país por su ID
export async function obtenerPaisPorId(id) {
  return await Country.findById(id).exec(); // Esto busca por el ID
}

// Obtener todos los países
export async function obtenerTodosLosPaises() {
  return await countryRepository.obtenerTodos();
}

// Buscar países por un atributo específico (como nombre, región, etc.)
export async function buscarPaisesPorAtributo(atributo, valor) {
  return await countryRepository.buscarPorAtributo(atributo, valor);
}

// Función que filtra países con un área mayor a un valor dado
export async function obtenerPaisesConAreaMayorA(area) {
  const paises = await countryRepository.obtenerPaisesConAreaMayorA(area);
  return paises; // Devuelve los países con área mayor a 'area'
}

// Nuevas Peticiones

// Crear un nuevo país
export async function crearPais(data) {
  try {
    const nuevoPais = new Country(data);
    return await nuevoPais.save();
  } catch (error) {
    console.error("Error al crear país en el servicio:", error);
    throw error;
  }
}

// Actualizar un país por su ID
export async function actualizarPais(id, data) {
  try {
    return await Country.findByIdAndUpdate(id, data, { new: true }); // { new: true } devuelve el documento actualizado
  } catch (error) {
    console.error("Error al actualizar país:", error);
    throw error;
  }
}

// Eliminar un país por su ID
export async function eliminarPais(id) {
  try {
    return await Country.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error al eliminar país:", error);
    throw error;
  }
}
