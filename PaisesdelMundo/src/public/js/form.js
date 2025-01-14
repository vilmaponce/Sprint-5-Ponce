document.getElementById('countryForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    try {
        // Obtener valores de los campos
        const capitalValue = document.getElementById('capital').value;
        const languagesValue = document.getElementById('languages').value;
        const giniValue = document.getElementById('gini').value;  // Nueva línea para gini
        const timezonesValue = document.getElementById('timezones').value;  // Nueva línea para timezone
        const bordersValue = document.getElementById('borders').value;  // Nueva línea para borders

        // Validación de zona horaria
        const timezones = timezonesValue.split(',').map(tz => tz.trim()); // Dividir por comas y eliminar espacios extra
        const timezonePattern = /^[A-Za-z]+\/[A-Za-z_\-]+$|^UTC[+\-]\d{1,2}$/; // Asegura formato adecuado
        let isValidTimezone = true;
        let timezoneErrorMessage = '';

        for (let timezone of timezones) {
            if (!timezonePattern.test(timezone)) {
                isValidTimezone = false;
                timezoneErrorMessage = 'Formato de zona horaria no válido. Ejemplo: "America/New_York" o "UTC+1".';
                break;
            }
        }

        // Si la validación de zona horaria falla, mostrar el error y detener el envío del formulario
        if (!isValidTimezone) {
            document.getElementById('timezones-error').textContent = timezoneErrorMessage;
            return;  // Detiene el envío del formulario
        } else {
            document.getElementById('timezones-error').textContent = ''; // Limpiar mensaje de error si es válido
        }
        
        // Procesar valores de los campos 
        const capitals = capitalValue.split(',').map(item => item.trim()).filter(Boolean);
        const languages = languagesValue.split(',').map(item => item.trim()).filter(Boolean);
        const borders = bordersValue.split(',').map(item => item.trim()).filter(Boolean); // Procesar borders
        
        // Crear el objeto de datos que se enviará al servidor
        const formData = new FormData(event.target);
        const data = {
            name: {
                common: formData.get('name[common]'),
                official: formData.get('name[official]')
            },
            capital: capitals,
            area: Number(formData.get('area')),
            region: formData.get('region'),
            population: Number(formData.get('population')),
            languages: languages,
            creator: formData.get('creator'),
            gini: parseFloat(giniValue),  
            timezones: timezonesValue,  
            borders: borders  
        };

        console.log('Enviando datos:', data);

        // Enviar los datos al servidor
        const response = await fetch('/add-country', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Si la respuesta es una redirección, seguirla
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        // Si no es una redirección, procesar la respuesta como JSON
        if (response.ok) {
            window.location.href = '/api/countries';
            return;
        }

        // Si hay un error, intentar obtener el mensaje de error
        let errorMessage = 'Error al procesar la solicitud';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
            console.error('Error al parsear respuesta:', e);
        }

        throw new Error(errorMessage);
        
    } catch (error) {
        console.error('Error completo:', error);
        alert(error.message);
    }
});
