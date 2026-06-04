// Zod-схемы для приёма заявок с сайта.
// Ожидания по полям соответствуют тому, что шлют 4 формы во фронте.
import { z } from 'zod'

// Телефон: уже отнормализован phoneMask на фронте, но нормализуем ещё раз.
// Принимаем любую строку, цифр >= 11.
const phoneSchema = z
  .string()
  .min(10)
  .max(40)
  .refine((v) => v.replace(/\D/g, '').length >= 11, {
    message: 'Телефон должен содержать минимум 11 цифр',
  })

const nameSchema = z.string().trim().min(1).max(120)

// /api/booking — большая форма с /booking
export const bookingSchema = z.object({
  arrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  rooms: z.array(
    z.object({
      room_type_id: z.string().nullish(),
      rate_id: z.string().nullish(),
      guests: z.array(
        z.object({
          adults: z.number().int().min(1).max(18),
          children: z.number().int().min(0).max(18),
          /** Возрасты детей (0-17). Длина должна равняться `children`. Bnovo считает цену по возрасту. */
          childrenAges: z.array(z.number().int().min(0).max(17)).optional().default([]),
        }),
      ).min(1),
    }),
  ).min(1),
  guest: z.object({
    first_name: nameSchema,
    last_name: z.string().trim().max(120).optional().default(''),
    // Email обязательный — Bnovo не принимает броню без него
    email: z.string().trim().min(3).max(120).email('Введите корректный email'),
    phone: phoneSchema,
    city: z.string().trim().max(120).optional().default(''),
  }),
  extras: z.array(
    z.object({
      id: z.string().nullish(),
      slug: z.string().min(1),
      count: z.number().int().min(1).max(20),
      /** Только для guest-extras: на скольких гостей оказывается услуга. */
      people: z.number().int().min(1).max(20).optional(),
    }),
  ).optional().default([]),
  comment: z.string().trim().max(2000).optional().default(''),
  total_estimate: z.number().int().min(0).optional(),
  consent: z.literal(true),
})

// /api/contact — форма обратной связи (ContactFooter) + BookingModal
// (BookingModal шлёт без comment, но это поле опционально)
export const contactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: z.string().trim().max(120).email().optional().or(z.literal('')),
  comment: z.string().trim().max(2000).optional().default(''),
  source: z.enum(['contact_footer', 'booking_modal']).optional().default('contact_footer'),
  consent: z.literal(true),
})

// /api/transfer — заказ трансфера из секции Location
export const transferSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  flight: z.string().trim().max(300).optional().default(''),
  consent: z.literal(true),
})

export const CONSENT_TEXT =
  'Согласие на обработку персональных данных в соответствии с политикой конфиденциальности https://radde.ru/privacy'

export type BookingBody = z.infer<typeof bookingSchema>
export type ContactBody = z.infer<typeof contactSchema>
export type TransferBody = z.infer<typeof transferSchema>
