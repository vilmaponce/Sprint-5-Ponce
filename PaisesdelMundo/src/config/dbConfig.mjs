import mongoose from 'mongoose';

export async function connectDB() { 
    try {
        await mongoose.connect('mongodb+srv://grupo-01:grupo01@cursadanodejs.ls9ii.mongodb.net/Node-js', {
            serverSelectionTimeoutMS: 5000
          });
          

        console.log('Conexión exitosa a MongoDB-Vilma Ponce');
    } catch (error) {
        console.log('Error de conexión a MongoDB:', error);
        process.exit(1); // Detiene la aplicación si no se puede conectar
    }
}
