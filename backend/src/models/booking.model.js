import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({

 
  user: {
    type: mongoose.Schema.Types.ObjectId,    
    ref: 'User',                           
    required: true
  },

  service: {                                 
    type: String,
    required: true
  },

  hairLength: {                             
    type: String,
    enum: ['short', 'medium', 'long', 'extra-long'],
    required: true
  },

  date: {                                
    type: Date,
    required: true
  },

  status: {                                  
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'                     
  },

  notes: {                                   
    type: String
  }

}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);