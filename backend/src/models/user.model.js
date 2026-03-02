import mongoose from 'mongoose';

// Schema - plantilla que define cómo se ve un Usuario en la DB

const userSchema = new mongoose.Schema({  

  name: {
    type: String,                           
    required: true,                        
    trim: true                             
  },

  email: {
    type: String,
    required: true,
    unique: true,                          
    lowercase: true                       
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'admin'],               
    default: 'user'                          
  }

}, { timestamps: true });               //  FÓRMULA añade createdAt y updatedAt automáticamente

// Exportamos el modelo — "User" 🎨 es el nombre de la colección en MongoDB
export default mongoose.model('User', userSchema);  