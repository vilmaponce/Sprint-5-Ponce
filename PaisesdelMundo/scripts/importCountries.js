import mongoose from 'mongoose';
import axios from 'axios';
import Country from '../models/Country.js'; // Ajusta la ruta según tu estructura de proyecto

// Conexión a MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1); // Salir en caso de error
  }
};

// Función para consumir la API y guardar los países hispanohablantes
const importCountries = async () => {
  try {
    console.log('Consumiendo la API...');
    const { data: countries } = await axios.get('https://restcountries.com/v3.1/all');

    // Filtrar países hispanohablantes
    const filteredCountries = countries.filter((country) => {
      const languages = country.languages || {};
      return Object.values(languages).includes('Spanish');
    });

    // Transformar y guardar en la base de datos
    const countriesToSave = filteredCountries.map((country) => ({
      name: {
        common: country.name.common,
        official: country.name.official,
      },
      capital: country.capital ? country.capital[0] : 'Desconocido',
      region: country.region || 'Desconocido',
      subregion: country.subregion || 'Desconocido',
      population: country.population || 0,
      area: country.area || 0,
      languages: country.languages || {},
      flag: country.flags?.svg || '',
      creator: 'Vilma Ponce',
    }));

    await Country.insertMany(countriesToSave);
    console.log('Países importados correctamente');
  } catch (error) {
    console.error('Error al importar países:', error.message);
  } finally {
    mongoose.connection.close(); // Cierra la conexión
  }
};

// Ejecutar el script
const run = async () => {
  await connectToDB();
  await importCountries();
};

run();
