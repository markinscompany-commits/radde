<template>
  <div class="min-h-screen bg-sand-50 text-sand-900 p-6">
    <header class="mb-8 flex items-center justify-between">
      <h1 class="font-display font-500 text-2xl">Заявки Радде</h1>
      <button @click="refresh" class="btn-primary px-5 py-2 text-sm">Обновить</button>
    </header>

    <p v-if="error" class="mb-6 text-amber-700">{{ error }}</p>

    <div v-if="data" class="space-y-10">
      <section>
        <h2 class="font-display font-500 text-xl mb-3">Бронирования ({{ data.bookings.length }})</h2>
        <div class="overflow-x-auto border border-sand-200 rounded-2 bg-white">
          <table class="w-full text-sm">
            <thead class="bg-sand-100 text-sand-700">
              <tr>
                <th class="text-left px-3 py-2">#</th>
                <th class="text-left px-3 py-2">Создана</th>
                <th class="text-left px-3 py-2">Гость</th>
                <th class="text-left px-3 py-2">Телефон</th>
                <th class="text-left px-3 py-2">Заезд → Выезд</th>
                <th class="text-left px-3 py-2">Гостей</th>
                <th class="text-left px-3 py-2">Номер</th>
                <th class="text-left px-3 py-2">Сумма</th>
                <th class="text-left px-3 py-2">Город</th>
                <th class="text-left px-3 py-2">Email</th>
                <th class="text-left px-3 py-2">Коммент</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in data.bookings" :key="`b-${b.id}`" class="border-t border-sand-100 align-top">
                <td class="px-3 py-2 font-mono">{{ b.id }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ fmt(b.created_at) }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ b.guest_first_name }} {{ b.guest_last_name }}</td>
                <td class="px-3 py-2 font-mono whitespace-nowrap">{{ b.guest_phone }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ b.arrival }} → {{ b.departure }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ b.adults }}+{{ b.children }}</td>
                <td class="px-3 py-2">{{ b.room_type_id || '—' }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ b.total_estimate ? `${b.total_estimate} ₽` : '—' }}</td>
                <td class="px-3 py-2">{{ b.guest_city || '—' }}</td>
                <td class="px-3 py-2">{{ b.guest_email || '—' }}</td>
                <td class="px-3 py-2 max-w-60">{{ b.comment || '—' }}</td>
              </tr>
              <tr v-if="!data.bookings.length"><td colspan="11" class="px-3 py-6 text-center text-sand-500">Пока пусто</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="font-display font-500 text-xl mb-3">Сообщения ({{ data.contacts.length }})</h2>
        <div class="overflow-x-auto border border-sand-200 rounded-2 bg-white">
          <table class="w-full text-sm">
            <thead class="bg-sand-100 text-sand-700">
              <tr>
                <th class="text-left px-3 py-2">#</th>
                <th class="text-left px-3 py-2">Создано</th>
                <th class="text-left px-3 py-2">Имя</th>
                <th class="text-left px-3 py-2">Телефон</th>
                <th class="text-left px-3 py-2">Email</th>
                <th class="text-left px-3 py-2">Коммент</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in data.contacts" :key="`c-${m.id}`" class="border-t border-sand-100 align-top">
                <td class="px-3 py-2 font-mono">{{ m.id }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ fmt(m.created_at) }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ m.name }}</td>
                <td class="px-3 py-2 font-mono whitespace-nowrap">{{ m.phone }}</td>
                <td class="px-3 py-2">{{ m.email || '—' }}</td>
                <td class="px-3 py-2 max-w-80">{{ m.comment || '—' }}</td>
              </tr>
              <tr v-if="!data.contacts.length"><td colspan="6" class="px-3 py-6 text-center text-sand-500">Пока пусто</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="font-display font-500 text-xl mb-3">Трансферы ({{ data.transfers.length }})</h2>
        <div class="overflow-x-auto border border-sand-200 rounded-2 bg-white">
          <table class="w-full text-sm">
            <thead class="bg-sand-100 text-sand-700">
              <tr>
                <th class="text-left px-3 py-2">#</th>
                <th class="text-left px-3 py-2">Создано</th>
                <th class="text-left px-3 py-2">Имя</th>
                <th class="text-left px-3 py-2">Телефон</th>
                <th class="text-left px-3 py-2">Дата / рейс</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in data.transfers" :key="`t-${t.id}`" class="border-t border-sand-100 align-top">
                <td class="px-3 py-2 font-mono">{{ t.id }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ fmt(t.created_at) }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ t.name }}</td>
                <td class="px-3 py-2 font-mono whitespace-nowrap">{{ t.phone }}</td>
                <td class="px-3 py-2">{{ t.flight || '—' }}</td>
              </tr>
              <tr v-if="!data.transfers.length"><td colspan="5" class="px-3 py-6 text-center text-sand-500">Пока пусто</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

type BookingRow = {
  id: string | number
  created_at: string
  arrival: string
  departure: string
  adults: number
  children: number
  room_type_id: string | null
  total_estimate: number | null
  guest_first_name: string
  guest_last_name: string | null
  guest_phone: string
  guest_email: string | null
  guest_city: string | null
  comment: string | null
  status: string
}
type ContactRow = {
  id: string | number
  created_at: string
  name: string
  phone: string
  email: string | null
  comment: string | null
  status: string
}
type TransferRow = {
  id: string | number
  created_at: string
  name: string
  phone: string
  flight: string | null
  status: string
}
type Feed = { bookings: BookingRow[]; contacts: ContactRow[]; transfers: TransferRow[] }

const data = ref<Feed | null>(null)
const error = ref('')

async function load() {
  error.value = ''
  try {
    data.value = await $fetch<Feed>('/api/admin/feed')
  } catch (err: any) {
    error.value = err?.statusMessage || 'Не удалось загрузить заявки'
  }
}

async function refresh() {
  await load()
}

const fmt = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(load)
useHead({ title: 'Заявки — Радде admin' })
</script>
