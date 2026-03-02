import { getAllBookings, updateBookingStatus } from '../services/booking.service.js';

export const allBookings = async (req, res, next) => {
  try {
    const bookings = await getAllBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    // req.params.id viene de la URL: /admin/bookings/:id/status
    const booking = await updateBookingStatus(
      req.params.id,        
      req.body.status       
    );
    res.json(booking);
  } catch (error) {
    next(error);
  }
};