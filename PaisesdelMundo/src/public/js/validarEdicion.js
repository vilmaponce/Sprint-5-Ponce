document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("countryForm");

    // Validación de los campos en tiempo real
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            validarCampo(this);
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Recopilar los datos del formulario
        const formData = new FormData(form);
        const datos = {};

        formData.forEach((value, key) => {
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                if (!datos[parent]) datos[parent] = {};
                datos[parent][child] = value;
            }
            else if (key.endsWith('[]')) {
                const baseKey = key.slice(0, -2);
                // Convertir la cadena de texto a un array de valores
                datos[baseKey] = value.split(',').map(item => item.trim());
            }
            else if (key !== '_method') {
                datos[key] = value;
            }
        });

        // Asegurarse de que las fronteras sean un array de códigos de país en mayúsculas
        if (datos.borders) {
            if (typeof datos.borders === 'string') {
                // Si es una cadena, la convertimos en un array
                datos.borders = datos.borders.split(',').map(code => code.trim().toUpperCase());
            } else if (Array.isArray(datos.borders)) {
                // Si ya es un array, lo convertimos a mayúsculas
                datos.borders = datos.borders.map(code => code.toUpperCase());
            }
        }

        // Asegurarse de que Gini sea un número
        if (datos.gini) {
            datos.gini = parseFloat(datos.gini);  // Asegura que sea un número
        }

        // Método de la solicitud (PUT para actualizar)
        const method = formData.get('_method') || 'PUT';

        // Obtener el ID del país desde la acción del formulario
        const countryId = form.action.split('/').pop();

        // Log de depuración
        console.log('Enviando solicitud de actualización:', {
            url: `/api/countries/editar/${countryId}`,
            method: method,
            data: datos
        });

        // Configuración de la solicitud Fetch
        fetch(`/api/countries/${countryId}`, {
            method: 'PUT',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => {
                console.log('Estado de la respuesta:', response.status);
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Servidor respondió con ${response.status}: ${text}`);
                    });
                }
                return response.json(); // Aquí convertimos la respuesta a JSON
            })
            .then(data => {
                console.log('País actualizado:', data);
                // Mostrar modal con la respuesta del servidor (JSON)
                mostrarModal(JSON.stringify(data, null, 2)); // Mostrar los datos en formato bonito
                // Mostrar un mensaje de éxito
                alert('País editado correctamente');
                window.location.href = '/api/countries'; // Redirige después de la actualización
            })
            .catch(error => {
                console.error('Error al actualizar el país:', error);
                alert(`Error al actualizar el país: ${error.message}`);
                // Mostrar detalles del error en consola para más detalles
                console.log('Detalles del error:', error);
            });
    });
});

// Función para mostrar el modal con el contenido JSON
function mostrarModal(contenido) {
    // MODAL
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h4>Respuesta del Servidor</h4>
            <pre>${contenido}</pre>
            <button onclick="cerrarModal()">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}
