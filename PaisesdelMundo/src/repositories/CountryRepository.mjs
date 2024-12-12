import mongoose from 'mongoose';
import Country from '../models/Country.mjs'; // El modelo de país
import IRepository from './IRepository.mjs';

class CountryRepository extends IRepository {

  // Obtener un país por su ID
  async obtenerPorId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID no válido");
    }

    try {
      return await Country.findById(id);
    } catch (error) {
      console.error('Error al obtener país por ID:', error);
      throw error;
    }
  }

  // Obtener todos los países
  async obtenerTodos() {
    try {
      return await Country.find({});
    } catch (error) {
      console.error('Error al obtener todos los países:', error);
      throw error;
    }
  }

  // Buscar países por un atributo (por ejemplo, nombre o región)
  async buscarPorAtributo(atributo, valor) {
    const query = { [atributo]: new RegExp(valor, 'i') }; // Realiza la búsqueda por el atributo
    try {
      return await Country.find(query);
    } catch (error) {
      console.error(`Error al buscar países por ${atributo}:`, error);
      throw error;
    }
  }

  // Obtener países con un área mayor a un valor dado
  async obtenerPaisesConAreaMayorA(area) {
    try {
      return await Country.find({ area: { $gt: area } });
    } catch (error) {
      console.error('Error al obtener países con área mayor a', area, ':', error);
      throw error;
    }
  }

  // Método para crear un nuevo país
  async crearPais(data) {
    try {
      const nuevoPais = new Country(data);
      return await nuevoPais.save();
    } catch (error) {
      console.error('Error al crear país:', error);
      throw error;
    }
  }

  // Método para actualizar un país
  async actualizarPais(id, data) {
    try {
      const paisActualizado = await Country.findByIdAndUpdate(id, data, { new: true });
      if (!paisActualizado) {
        throw new Error("País no encontrado para actualizar");
      }
      return paisActualizado;
    } catch (error) {
      console.error(`Error al actualizar país con ID (${id}):`, error);
      throw error;
    }
  }

  // Método para eliminar un país
  async eliminarPais(id) {
    try {
      const paisEliminado = await Country.findByIdAndDelete(id);
      if (!paisEliminado) {
        throw new Error("País no encontrado para eliminar");
      }
      return paisEliminado;
    } catch (error) {
      console.error(`Error al eliminar país con ID (${id}):`, error);
      throw error;
    }
  }
}

// Exportar una instancia de la clase para usarla en otros módulos
export default new CountryRepository();
