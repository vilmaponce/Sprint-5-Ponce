// Función para renderizar un país
export function renderizarPais(pais) {
  return {
    Nombre: pais.name,
    Capital: pais.capital.join(", ") || "No disponible", // Algunas veces puede ser un array vacío
    Área: pais.area || "No disponible",
    Población: pais.population || "No disponible",
    Idiomas: pais.languages ? pais.languages.join(", ") : "No disponible",
    Bandera: `<img src="${pais.flag}" alt="Bandera de ${pais.name}" style="width: 50px; height: auto;">`, // Mostrar la bandera
    Autor: pais.creador || 'Vilma Ponce'  // Asegúrate de que 'creador' se use en el modelo del país
  };
}

// Función para renderizar la lista de países
export function renderizarListaPaises(paises) {
  return paises.map(pais => renderizarPais(pais));
}
