document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("edit-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const datos = {};

        // Convert FormData to structured object
        formData.forEach((value, key) => {
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                if (!datos[parent]) datos[parent] = {};
                datos[parent][child] = value;
            }
            else if (key.endsWith('[]')) {
                const baseKey = key.slice(0, -2);
                datos[baseKey] = value.split(',').map(item => item.trim());
            }
            else if (key !== '_method') {
                datos[key] = value;
            }
        });

        // Determine method (PUT for update)
        const method = formData.get('_method') || 'PUT';

        // Get the country ID from the form action
        const countryId = form.action.split('/').pop();

        // Log debugging information
        console.log('Sending update request:', {
            url: `/api/countries/editar/${countryId}`,
            method: method,
            data: datos
        });

        // Fetch configuration
        fetch(`/api/countries/${countryId}`, {
            method: 'PUT',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    // Try to get more error details
                    return response.text().then(text => {
                        throw new Error(`Server responded with ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('País actualizado:', data);
                window.location.href = '/api/countries';
            })
            .catch(error => {
                console.error('Error completo al actualizar el país:', error);
                alert(`Error al actualizar el país: ${error.message}`);
            });
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            // Remove previous error states
            this.classList.remove('error');
            const existingError = this.nextSibling;
            if (existingError && existingError.classList.contains('error-message')) {
                existingError.remove();
            }

            // Validate specific fields
            if (this.hasAttribute('minlength')) {
                const minLength = parseInt(this.getAttribute('minlength'));
                if (this.value.trim().length < minLength) {
                    this.classList.add('error');
                    const errorMsg = document.createElement('div');
                    errorMsg.textContent = `Debe tener al menos ${minLength} caracteres`;
                    errorMsg.classList.add('error-message');
                    this.parentNode.insertBefore(errorMsg, this.nextSibling);
                }
            }
        });
    });
});