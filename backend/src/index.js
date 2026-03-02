import express from 'express';        
import cors from 'cors';               
import dotenv from 'dotenv';           

import { connectDB } from './config/db.js';          
import authRoutes from './routes/auth.routes.js';    
import bookingRoutes from './routes/booking.routes.js'; 
import adminRoutes from './routes/admin.routes.js';   
import { errorHandler } from './middlewares/error.middleware.js'; 

// CONFIGURACIÓN 

dotenv.config();                      

const app = express();               
const PORT = process.env.PORT || 3000; 

// MIDDLEWARES GLOBALES 


app.use(cors());                      
app.use(express.json());            

// CONECTAR BASE DE DATOS 

connectDB();                         

// RUTAS 

app.get('/health', (req, res) => {   
  res.json({ status: 'OK', message: 'Server running!' });
});

app.use('/api/auth', authRoutes);    
app.use('/api/bookings', bookingRoutes); 
app.use('/api/admin', adminRoutes); 

//  MIDDLEWARE DE ERRORES 

app.use(errorHandler);              

//  ARRANCAR EL SERVIDOR 

app.listen(PORT, () => {             
  console.log(`Server running on port ${PORT}`);
});