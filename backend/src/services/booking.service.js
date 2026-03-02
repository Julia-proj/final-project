import Booking from '../models/booking.model.js';

// Crear una nueva reserva
export const createBooking = async ({ userId, service, hairLength, date, notes }) => {
  const booking = await Booking.create({        
    user: userId,
    service,
    hairLength,
    date,
    notes
  });
  return booking;
};

// Ver las reservas de UN usuario (las mías)
export const getUserBookings = async (userId) => {
  return await Booking
    .find({ user: userId })    
    .sort({ date: -1 });        
};

// Ver TODAS las reservas (solo admin)
export const getAllBookings = async () => {
  return await Booking
    .find()                       
    .populate('user', 'name email')  
    .sort({ date: -1 });
};

// Cambiar el estado de una reserva (solo admin)
export const updateBookingStatus = async (bookingId, status) => {
  const booking = await Booking.findByIdAndUpdate(  
    bookingId,
    { status },
    { new: true }                 
  );
  if (!booking) {
    throw { status: 404, message: 'Reserva no encontrada' };
  }
  return booking;
};