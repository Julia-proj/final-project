import { createBooking, getUserBookings } from '../services/booking.service.js';

export const create = async (req, res, next) => {
  try {
    // req.user.id viene del authMiddleware (el token decodificado)
    const booking = await createBooking({
      userId: req.user.id,    // 🎨 — id del usuario del token
      ...req.body             // 📦 — resto de datos del body
    });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const myBookings = async (req, res, next) => {
  try {
    const bookings = await getUserBookings(req.user.id);  // 🎨
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};