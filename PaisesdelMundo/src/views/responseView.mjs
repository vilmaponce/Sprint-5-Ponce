export function renderizarPais(pais) {
  return `
    <div class="pais-container">
      <h3 class="pais-nombre">${pais.name}</h3>
      <div class="pais-info">
        <p><strong>Capital:</strong> ${pais.capital.join(", ") || "No disponible"}</p>
        <p><strong>Área:</strong> ${pais.area || "No disponible"}</p>
        <p><strong>Población:</strong> ${pais.population || "No disponible"}</p>
        <p><strong>Idiomas:</strong> ${pais.languages ? pais.languages.join(", ") : "No disponible"}</p>
        <p><strong>Autor:</strong> ${pais.creator || 'Vilma Ponce'}</p>
      </div>
      <div class="pais-flag">
        <img src="${pais.flag}" alt="Bandera de ${pais.name}" style="width: 50px; height: auto;">
      </div>
    </div>
  `;
}

// Función para renderizar la lista de países
export function renderizarListaPaises(paises) {
  return paises.map(pais => renderizarPais(pais)).join('');
}
