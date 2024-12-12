document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Función de validación para texto
        const validateText = (value, minLength, maxLength) => {
            const trimmedValue = value.trim();
            return trimmedValue.length >= minLength && trimmedValue.length <= maxLength;
        };
        
        // Función de validación para arrays (separados por coma)
        const validateArray = (value, minLength, maxLength) => {
            const items = value.split(',')
                .map(item => item.trim())
                .filter(item => item !== ''); // Elimina los vacíos
            
            return items.length > 0 && 
                   items.every(item => item.length >= minLength && item.length <= maxLength);
        };
        
        // Obtener los valores del formulario
        const name = document.getElementById('name').value; // Nombre del país
        const capital = document.getElementById('capital').value; // Capital
        const area = document.getElementById('area').value; // Área
        const population = document.getElementById('population').value; // Población
        const languages = document.getElementById('languages').value; // Idiomas
        const flag = document.getElementById('flag').value; // URL de la bandera

        const errors = [];
        
        // Validar nombre del país
        if (!validateText(name, 3, 60)) {
            errors.push('El nombre del país debe tener entre 3 y 60 caracteres');
        }
        
        // Validar capital
        if (!validateText(capital, 3, 60)) {
            errors.push('La capital debe tener entre 3 y 60 caracteres');
        }
        
        // Validar área
        if (!area || parseInt(area) <= 0) {
            errors.push('El área debe ser un número mayor a 0');
        }
        
        // Validar población
        if (!population || parseInt(population) <= 0) {
            errors.push('La población debe ser un número mayor a 0');
        }
        
        // Validar idiomas
        if (!validateArray(languages, 2, 60)) {
            errors.push('Los idiomas deben tener entre 2 y 60 caracteres');
        }

        // Mostrar errores
        if (errors.length > 0) {
            alert('Por favor, corrija los siguientes errores:\n' + errors.join('\n'));
            return; // Detener el envío del formulario si hay errores
        }

        // Si todas las validaciones pasan, enviar el formulario
        form.submit();
    });
});
