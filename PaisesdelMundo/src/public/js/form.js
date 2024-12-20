document.getElementById('countryForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    try {
        const capitalValue = document.getElementById('capital').value;
        const languagesValue = document.getElementById('languages').value;
        
        const capitals = capitalValue.split(',').map(item => item.trim()).filter(Boolean);
        const languages = languagesValue.split(',').map(item => item.trim()).filter(Boolean);
        
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
            creator: formData.get('creator')
        };

        console.log('Enviando datos:', data);

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

        // Si no es una redirección, procesar como JSON
        if (response.ok) {
            window.location.href = '/api/countries';
            return;
        }

        // Si hay un error, intentar obtener el mensaje
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