document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#edit-form'); // Asegúrate de tener un formulario con este id

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'PUT',
                body: formData,
            })
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(data => {
                if (data.mensaje) {
                    // Si la actualización es exitosa, mostramos el mensaje y los datos actualizados
                    const displayContainer = document.querySelector('#display-container');
                    displayContainer.innerHTML = `
                        <h2>Actualización exitosa: ${data.mensaje}</h2>
                        <h3>Detalles del país actualizado:</h3>
                        <p><strong>Nombre común:</strong> ${data.country.name.common}</p>
                        <p><strong>Nombre oficial:</strong> ${data.country.name.official}</p>
                        <p><strong>Capital:</strong> ${data.country.capital.join(', ')}</p>
                        <p><strong>Región:</strong> ${data.country.region}</p>
                        <p><strong>Población:</strong> ${data.country.population}</p>
                        <p><strong>Área:</strong> ${data.country.area} km²</p>
                        <p><strong>Idiomas:</strong> ${data.country.languages.join(', ')}</p>
                        <p><strong>Creator:</strong> ${data.country.creator}</p>
                        <p><strong>Banderas:</strong> ${data.country.flag ? `<img src="${data.country.flag}" alt="Bandera de ${data.country.name.common}" style="width: 50px; height: auto;">` : 'No disponible'}</p>
                    `;
                } else if (data.errors) {
                    alert("Error al actualizar el país. Por favor revisa los campos.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Hubo un problema al intentar actualizar el país.");
            });
        });
    }
});
