/**
 * Единый источник правды для номеров пансионата.
 * Используется в SectionsRooms (главная) и в pages/booking.vue (выбор номера).
 *
 * price / priceValue здесь — fallback на случай, если /api/availability упал.
 * В обычной ситуации фронт показывает live-цены из Bnovo (см. useAvailableRooms.ts).
 *
 * bnovoRoomTypeId соответствует room_type_id в Bnovo (см.
 * server/utils/bnovo-mapping.ts — это серверная сторона той же таблицы).
 */
export interface RoomDef {
  id: string
  name: string
  area: number
  bed: string
  guests: number
  view: string
  price: string         // fallback «от X ₽» для главной (когда Bnovo молчит)
  priceValue: number    // числовое значение для расчётов /ночь
  description: string
  fullDescription: string
  note: string
  tags: string[]
  images: string[]
  bnovoRoomTypeId?: number | null
}

const VIP_COUNT = 9
const PANORAMA_COUNT = 8
const LUX_COUNT = 17
const STANDARD_COUNT = 3
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

export function useRooms(): RoomDef[] {
  const base = useRuntimeConfig().app.baseURL || '/'
  return [
    {
      id: 'vip',
      name: 'VIP',
      area: 50,
      bed: 'King-size',
      guests: 2,
      view: 'Панорама на горы и долину',
      price: '8 000',
      priceValue: 8000,
      description: 'Максимальный комфорт. Отдельная гостиная с камином, спальня с панорамными окнами, собственная терраса с видом на горы и долину.',
      fullDescription: 'Максимальный комфорт для тех, кто ценит пространство и уединение. Отдельная гостиная с камином — идеальное место для вечерних посиделок. Спальня с панорамными окнами и кроватью King-size. Собственная терраса с видом на горы и долину. Санузел с дождевым душем и ванной. Халаты, тапочки, мини-бар, телевизор — всё продумано для безупречного отдыха.',
      note: '',
      tags: ['Гостиная', 'Камин', 'Терраса', 'Ванна', 'Дождевой душ', 'Халаты', 'Мини-бар'],
      images: range(VIP_COUNT).map(n => `${base}images/rooms/vip/${n}.jpg`),
      bnovoRoomTypeId: 193604,
    },
    {
      id: 'panorama',
      name: 'Люкс с панорамной спальней',
      area: 35,
      bed: 'King-size',
      guests: 2,
      view: 'Панорама на горы',
      price: '7 000',
      priceValue: 7000,
      description: 'Панорамные окна от пола до потолка. Просыпаетесь с видом на горные вершины и реликтовый лес — незабываемое начало каждого дня.',
      fullDescription: 'Панорамные окна от пола до потолка превращают спальню в смотровую площадку. Просыпаетесь с видом на горные вершины и реликтовый лес — незабываемое начало каждого дня. Номер оснащён кроватью King-size с ортопедическим матрасом, собственным санузлом с дождевым душем, террасой для отдыха на свежем воздухе. Мини-бар, телевизор, кресло у окна — всё для полного комфорта.',
      note: '',
      tags: ['Панорамные окна', 'Терраса', 'Дождевой душ', 'Собственный санузел', 'Мини-бар', 'Кресло у окна'],
      images: range(PANORAMA_COUNT).map(n => `${base}images/rooms/panorama/${n}.jpg`),
      bnovoRoomTypeId: 241615,
    },
    {
      id: 'lux',
      name: 'Люкс',
      area: 30,
      bed: 'Две односпальные кровати',
      guests: 3,
      view: 'Вид на горы',
      price: '5 500',
      priceValue: 5500,
      description: 'Просторный номер с собственным санузлом и балконом. Большие окна наполняют пространство естественным светом и открывают вид на горные вершины.',
      fullDescription: 'Просторный номер с собственным санузлом и балконом. Большие окна наполняют пространство естественным светом и открывают вид на горные вершины. Интерьер в натуральных тонах создаёт атмосферу уюта — мягкая мебель, телевизор, мини-бар с прохладительными напитками. Балкон с видом на горы — идеальное место для утреннего кофе.',
      note: '',
      tags: ['Собственный санузел', 'Балкон', 'Телевизор', 'Мини-бар'],
      images: range(LUX_COUNT).map(n => `${base}images/rooms/lux/${n}.jpg`),
      bnovoRoomTypeId: 193603,
    },
    {
      id: 'standard',
      name: 'Стандарт',
      area: 18,
      bed: 'Двуспальная кровать',
      guests: 2,
      view: 'Вид на лес',
      price: '3 500',
      priceValue: 3500,
      description: 'Уютный номер в тёплых природных тонах с видом на реликтовый лес. Всё необходимое для спокойного отдыха вдали от суеты.',
      fullDescription: 'Уютный номер в тёплых природных тонах с видом на реликтовый лес. Всё необходимое для спокойного отдыха вдали от суеты — удобная кровать с ортопедическим матрасом, шкаф для одежды, рабочее место у окна. Из окна открывается вид на вековые деревья реликтового леса. Идеальный вариант для пар и путешественников, ценящих простоту и природу.',
      note: 'Санузел в коридоре — один на два номера',
      tags: ['Рабочее место', 'Шкаф', 'Вид на лес'],
      images: range(STANDARD_COUNT).map(n => `${base}images/rooms/standard/${n}.jpg`),
      bnovoRoomTypeId: 193602,
    },
  ]
}

export function getRoom(id: string): RoomDef | undefined {
  return useRooms().find(r => r.id === id)
}
