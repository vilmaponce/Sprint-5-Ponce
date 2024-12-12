import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    common: { type: String, required: true },
    official: { type: String, required: true }
  },
  capital: { 
    type: [String],  // Ahora puede ser un array de strings
    required: true 
  },
  region: { type: String, required: true },
  subregion: { type: String, required: true },
  population: { type: Number, required: true },
  area: { type: Number },
  languages: { 
    type: Map, 
    of: String, 
    required: true 
  },
  flag: { type: String },
  creator: { type: String, default: 'Vilma Ponce' },
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'Grupo-01'
});

export default mongoose.model('Country', countrySchema);
