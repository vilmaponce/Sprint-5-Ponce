import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    common: {
      type: String,
      required: [true, "El nombre común del país es obligatorio."],
      minlength: [3, "El nombre común debe tener al menos 3 caracteres."],
      maxlength: [100, "El nombre común no puede exceder los 100 caracteres."]
    },
    official: {
      type: String,
      required: [true, "El nombre oficial del país es obligatorio."],
      minlength: [3, "El nombre oficial debe tener al menos 3 caracteres."],
      maxlength: [90, "El nombre oficial no puede exceder los 90 caracteres."]
    }
  },
  capital: {
    type: [String], // Array de cadenas
    required: [true, "La capital es obligatoria."],
    validate: {
      validator: (value) => value.every(cap => typeof cap === 'string' && cap.length >= 3 && cap.length <= 90),
      message: "Cada capital debe ser una cadena de texto de entre 3 y 90 caracteres."
    }
  },
  region: {
    type: String,
    required: [true, "La región es obligatoria."],
    minlength: [3, "La región debe tener al menos 3 caracteres."],
    maxlength: [100, "La región no puede exceder los 100 caracteres."]
  },
  subregion: {
    type: String,
    minlength: [3, "La subregión debe tener al menos 3 caracteres."],
    maxlength: [100, "La subregión no puede exceder los 100 caracteres."]
  },
  population: {
    type: Number,
    required: [true, "La población es obligatoria."],
    validate: {
      validator: (value) => Number.isInteger(value) && value >= 0,
      message: "La población debe ser un número entero mayor o igual a 0."
    }
  },
  area: {
    type: Number,
    required: [true, "El área es obligatoria."],
    validate: {
      validator: (value) => value > 0,
      message: "El área debe ser un número positivo."
    }
  },
  languages: {
    type: [String], // Esto es un array de cadenas
    required: [true, "Los idiomas son obligatorios."],
    validate: {
      validator: function(value) {
        return value.every(lang => typeof lang === 'string' && lang.length >= 2 && lang.length <= 60);
      },
      message: "Cada idioma debe ser una cadena de texto válida con entre 2 y 60 caracteres."
    }
  },
  borders: {
    type: [String],
    validate: {
      validator: (value) => value.every(code => /^[A-Z]{3}$/.test(code)),
      message: "Cada frontera debe ser un código de 3 letras mayúsculas."
    }
  },
  gini: {
    type: Number,
    min: [0, "El índice Gini debe ser al menos 0."],
    max: [100, "El índice Gini no puede exceder 100."],
    validate: {
      validator: (value) => value >= 0 && value <= 100,
      message: "El índice Gini debe estar entre 0 y 100."
    }
  },
  creator: {
    type: String,
    required: [true, "El creador es obligatorio."],
    minlength: [3, "El creador debe tener al menos 3 caracteres."],
    maxlength: [100, "El creador no puede exceder los 100 caracteres."]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'Grupo-01' // Nombre explícito de la colección
});

export default mongoose.model('Country', countrySchema);

