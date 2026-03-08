// ============================================================
// utils/email.js — Utilidad de email con Resend
// ============================================================
// ESP: Envía un email al admin cada vez que se crea una reserva
//      o un feedback. Usa Resend (resend.com).
//
// FLUJO:
//   1. Cliente envía formulario → backend guarda en MongoDB
//   2. Después de guardar → llama sendNotification()
//   3. Resend envía email a beautyscriptses@gmail.com
//
// CONFIGURACIÓN (.env):
//   RESEND_API_KEY=re_xxxxxxxxxxxx   ← tu API key de resend.com
//   ADMIN_EMAIL=beautyscriptses@gmail.com
// ============================================================

import { Resend } from 'resend';

// Creamos la instancia de Resend con la API key del .env
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envía un email de notificación al admin.
 *
 * @param {string} subject — Asunto del email (ej: "Nueva reserva de formación")
 * @param {string} html    — Cuerpo del email en HTML
 */
export const sendNotification = async (subject, html) => {
  // Si no hay API key configurada, saltamos sin romper nada
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY no configurada — email no enviado');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Keratin Madrid <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'beautyscriptses@gmail.com',
      subject,
      html,
    });
    console.log(`📧 Email enviado: ${subject}`);
  } catch (error) {
    // Solo logueamos — nunca bloqueamos la operación principal
    console.error('❌ Error enviando email:', error.message);
  }
};

// ── PLANTILLAS DE EMAIL ──────────────────────────────────────

/**
 * Notificación de nueva reserva (formación, kit, producto, servicio)
 */
export const notifyNewReservation = (reservation) => {
  const subject = `Nueva solicitud: ${reservation.type} — ${reservation.nombre}`;
  const html = `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
      <h2 style="color:#3d3530">Nueva solicitud de ${reservation.type}</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#8B7355;width:120px"><strong>Nombre</strong></td><td>${reservation.nombre}</td></tr>
        <tr><td style="padding:8px 0;color:#8B7355"><strong>Teléfono</strong></td><td>${reservation.telefono}</td></tr>
        <tr><td style="padding:8px 0;color:#8B7355"><strong>Tipo</strong></td><td>${reservation.type}</td></tr>
        ${reservation.detalle ? `<tr><td style="padding:8px 0;color:#8B7355"><strong>Detalle</strong></td><td>${reservation.detalle}</td></tr>` : ''}
        ${reservation.notas ? `<tr><td style="padding:8px 0;color:#8B7355"><strong>Notas</strong></td><td>${reservation.notas}</td></tr>` : ''}
      </table>
      <hr style="border:none;border-top:1px solid #e8e2da;margin:20px 0"/>
      <p style="color:#999;font-size:12px">Keratin Madrid — Panel Admin</p>
    </div>
  `;
  return sendNotification(subject, html);
};

/**
 * Notificación de nuevo feedback / reseña
 */
export const notifyNewReview = (review) => {
  const stars = '★'.repeat(review.estrellas) + '☆'.repeat(5 - review.estrellas);
  const subject = `Nuevo feedback de ${review.nombre}`;
  const html = `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
      <h2 style="color:#3d3530">Nuevo feedback</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#8B7355;width:120px"><strong>Nombre</strong></td><td>${review.nombre}</td></tr>
        <tr><td style="padding:8px 0;color:#8B7355"><strong>Estrellas</strong></td><td style="color:#B8A99A">${stars}</td></tr>
        <tr><td style="padding:8px 0;color:#8B7355"><strong>Texto</strong></td><td><em>"${review.texto}"</em></td></tr>
        ${review.telefono ? `<tr><td style="padding:8px 0;color:#8B7355"><strong>Teléfono</strong></td><td>${review.telefono}</td></tr>` : ''}
      </table>
      <hr style="border:none;border-top:1px solid #e8e2da;margin:20px 0"/>
      <p style="color:#999;font-size:12px">Keratin Madrid — Panel Admin</p>
    </div>
  `;
  return sendNotification(subject, html);
};
