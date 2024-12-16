import axios from 'axios';
import mongoose from 'mongoose';
import Country from '../models/Country.mjs'; // El modelo de país
import { validationResult } from 'express-validator';

// Función que consume la API de países y guarda los países en la base de datos
// Función que consume la API de países y guarda los países en la base de datos
export const fetchCountries = async () => {
  try {
    // Obtener todos los países desde la API
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countries = response.data;

    console.log(`Países obtenidos de la API: ${countries.length}`); // Verificar cantidad de países

    // Filtrar los países que tienen el idioma español
    const spanishSpeakingCountries = countries.filter(country =>
      country.languages && country.languages.spa
    );

    // Log para verificar los nombres de los países que hablan español
    console.log('Países que hablan español:', spanishSpeakingCountries.map(c => c.name.common));


    // Preparar los países para insertarlos en la base de datos
    for (const country of spanishSpeakingCountries) {
      try {
        const newCountry = {
          name: {
            common: country.name.common || 'No especificado',
            official: country.name.official || 'No especificado',
          },
          capital: country.capital ? country.capital[0] : 'No especificado',
          region: country.region || 'No especificado',
          subregion: country.subregion || 'No especificado',
          population: country.population || 0,
          area: country.area || 0,
          languages: country.languages || {}, // Mantener el Map de idiomas
          flag: country.flags ? country.flags.png : '',
          creator: 'Vilma Ponce',
        };

        // Verificar si el país ya existe en la base de datos
        const existing = await Country.findOne({ 'name.common': newCountry.name.common });
        if (!existing) {
          const savedCountry = await Country.create(newCountry);
          console.log(`Guardado en la base de datos: ${savedCountry.name.common}`);
        } else {
          console.log(`El país ya existe en la base de datos: ${existing.name.common}`);
        }
      } catch (error) {
        console.error(`Error al guardar el país ${country.name.common}:`, error.message);
      }
    }

    console.log('Todos los países procesados.');
  } catch (error) {
    console.error('Error al consumir la API o al procesar los datos:', error.message);
  }
};


export async function obtenerTodosLosPaisesController(req, res) {
  try {
    let countries = await Country.find({ "name.common": { $exists: true } }).lean();

    if (countries.length === 0) {
      // Solo hacer la consulta a la API si no hay países en la base de datos
      console.log('No se encontraron países en la base de datos, se recuperan de la API...');
      const response = await axios.get('https://restcountries.com/v3.1/all');
      
      // Filtrar países de habla hispana y asignar la bandera correctamente
      countries = response.data.filter(country => country.languages && country.languages.spa).map(country => {
        if (!country.flags || !country.flags.png) {
          country.flags = { png: '/img/flag.png' }; // Establecer una bandera predeterminada si no existe
        }

        // Asegurarte de que solo se guarda la URL de la bandera
        return {
          ...country,
          flag: country.flags.png || '/img/flag.png' // Asegurar que la bandera tenga una URL válida
        };
      });

      await Country.insertMany(countries);
      console.log("Se han insertado países desde la API externa.");
    }

    console.log('Países encontrados:', countries.length);
    console.log('Primer país:', countries[0]);

    res.render('index', { 
      countries,
      mensaje: `Se encontraron ${countries.length} países` 
    });
  } catch (error) {
    console.error("Error al obtener países:", error);

    res.status(500).render('error', { 
      mensaje: "Error interno del servidor. No se pudo obtener la información de los países.",
      error: error.message 
    });
  }
}





// Función para obtener un país por su ID
export async function obtenerPaisPorIdController(req, res) {
  const { id } = req.params;

  // Verifica si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ mensaje: "ID de país no válido" });
  }

  try {
    // Busca el país por ID
    const country = await Country.findById(id);

    // Si no se encuentra el país
    if (!country) {
      return res.status(404).send({ mensaje: "País no encontrado" });
    }

    // Si el país es encontrado, se envía como respuesta
    res.json(country);
  } catch (error) {
    console.error("Error al obtener el país:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
}


// Controlador para buscar países por un atributo específico
export async function buscarPaisesPorAtributoController(req, res) {
  const { atributo, valor } = req.params; // Obtener los parámetros de la URL

  if (!atributo || !valor) {
    return res.status(400).send({ mensaje: "Faltan parámetros requeridos" });
  }

  try {
    const paises = await Country.find({ [atributo]: valor }); // Buscar países con el atributo y valor dados
    if (paises.length > 0) {
      res.status(200).json(paises); // Devuelve los países encontrados
    } else {
      res.status(404).send({ mensaje: `No se encontraron países con el atributo ${atributo} = ${valor}` });
    }
  } catch (error) {
    console.error("Error al buscar países por atributo:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
}


// Controlador para agregar un país
export async function crearPaisController(req, res) {
  console.log(req.body); // Verifica los datos recibidos

  // Verifica los errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  // Desestructuración de los datos de la solicitud
  const { name: { official, common }, capital, region, borders, population, area, languages, flag, creator } = req.body;

  const newCountry = new Country({
    name: {
      official, // Asignar directamente desde la desestructuración
      common
    },
    capital,
    region,
    borders,
    population,
    area,
    languages,
    flag,
    creator,
  });

  try {
    // Guardar el país en la base de datos
    const savedCountry = await newCountry.save();
    // Responder con el país creado
    res.status(201).json({ mensaje: "País creado exitosamente", country: savedCountry });
  } catch (error) {
    console.error("Error al crear país:", error);
    res.status(500).send({ mensaje: "Error interno del servidor", error: error.message });
  }
}


// Controlador para editar un país
export async function editarPaisController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ mensaje: "ID de país no válido" });
  }

  try {
    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).send({ mensaje: "País no encontrado" });
    }

    res.render('editar-pais', { country });
  } catch (error) {
    console.error("Error al obtener el país:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
}

// Controlador para actualizar un país
export async function actualizarPaisController(req, res) {
  const { id } = req.params; // Obtén el ID del país desde los parámetros de la URL
  console.log(req.body); // Verifica los datos recibidos

  // Verifica los errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    // Buscar el país por el ID
    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ mensaje: "País no encontrado" });
    }

    // Desestructuración de los datos de la solicitud
    const { nameOfficial, nameCommon, capital, region, borders, population, area, languages, flag, creator } = req.body;

    // Actualizar el país con los nuevos datos
    country.name.official = nameOfficial || country.name.official;
    country.name.common = nameCommon || country.name.common;
    country.capital = capital || country.capital;
    country.region = region || country.region;
    country.borders = borders || country.borders;
    country.population = population || country.population;
    country.area = area || country.area;
    country.languages = languages || country.languages;
    country.flag = flag || country.flag;
    country.creator = creator || country.creator;

    // Guardar los cambios
    const updatedCountry = await country.save();
    res.status(200).json({ mensaje: "País actualizado exitosamente", country: updatedCountry });

  } catch (error) {
    console.error("Error al actualizar país:", error);
    res.status(500).send({ mensaje: "Error interno del servidor", error: error.message });
  }
}


// Controlador para mostrar el formulario de edición
export async function mostrarFormularioDeEdicion(req, res) {
  const { id } = req.params;  // Obtener el ID del país desde los parámetros de la ruta

  try {
    // Buscar el país en la base de datos por su ID
    const country = await Country.findById(id);

    // Verificar si el país existe
    if (!country) {
      return res.status(404).send('País no encontrado');
    }

    // Renderizar la vista de formulario con los datos del país
    res.render('form', { country });  // Pasar el objeto 'country' a la vista
  } catch (error) {
    console.error('Error al buscar país:', error);
    res.status(500).send('Error interno del servidor');
  }
}




export const eliminarPaisController = async (req, res) => {
  const { id } = req.params;

  try {
    // Intentamos eliminar el país por su ID
    const result = await Country.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'País no encontrado' });
    }

    return res.status(200).json({ message: 'País eliminado con éxito' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el país', error });
  }
};
