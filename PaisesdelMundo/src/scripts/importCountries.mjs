import mongoose from 'mongoose';
import axios from 'axios';
import Country from '../models/Country.mjs'; // Ajusta la ruta según tu estructura de proyecto

// Conexión a MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Grupo-20:grupo20@cursadanodejs.ls9ii.mongodb.net/Node-js', {
      
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1); // Salir en caso de error
  }
};

// Función para insertar un país manualmente
const insertManualCountry = async () => {
  const newCountry = {
    name: { common: 'Argentina', official: 'República Argentina' },
    capital: ['Buenos Aires'],
    region: 'Americas',
    subregion: 'South America',
    population: 45376763,
    area: 2780400,
    languages: { spa: 'Español' },
    flag: '🇦🇷',
    creator: 'Vilma Ponce',
  };

  try {
    const country = new Country(newCountry);
    await country.save();
    console.log('País insertado manualmente:', country);
  } catch (error) {
    console.error('Error al insertar país manualmente:', error.message);
  }
};


// Función para consumir la API y guardar los países hispanohablantes
const importCountries = async () => {
  try {
    console.log('Consumiendo la API...');
    const { data: countries } = await axios.get('https://restcountries.com/v3.1/all');

    console.log(countries); // Verificar si los países están siendo recibidos correctamente
    // Filtrar países hispanohablantes
    const filteredCountries = countries.filter((country) => {
      const languages = country.languages || {};
      console.log(country.name.common, languages); // Verificar qué idiomas tiene el país
      return Object.values(languages).includes('Spanish');
    });
    console.log(filteredCountries); // Verifica los países filtrados
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
      // Extraer los idiomas como un array de cadenas
      languages: country.languages ? Object.values(country.languages) : [],
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
  await insertManualCountry();
  await importCountries();
};

run();
