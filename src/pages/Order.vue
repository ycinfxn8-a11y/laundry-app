<template>
  <div class="order-page">
    <h2>Buat Pesanan</h2>

    <form @submit.prevent="submitOrder">

      <!-- Pilih Layanan -->
      <section>
        <h3>Layanan</h3>
        <div class="services">
          <label
            v-for="service in availableServices"
            :key="service.id"
            class="service-item"
            :class="{ active: selectedServices.includes(service.id) }"
          >
            <input
              type="checkbox"
              :value="service.id"
              v-model="selectedServices"
              hidden
            />
            <span>{{ service.icon }} {{ service.name }}</span>
            <span>Rp {{ service.price.toLocaleString() }}/kg</span>
          </label>
        </div>
        <p v-if="errors.services" class="error">{{ errors.services }}</p>
      </section>

      <!-- Estimasi Berat -->
      <section>
        <h3>Estimasi Berat (kg)</h3>
        <input
          type="number"
          v-model.number="weight"
          min="1"
          max="50"
          placeholder="Contoh: 3"
        />
        <p v-if="errors.weight" class="error">{{ errors.weight }}</p>
      </section>

      <!-- Tipe Pengambilan -->
      <section>
        <h3>Metode</h3>
        <div class="method-options">
          <label :class="{ active: orderType === 'pickup' }">
            <input type="radio" value="pickup" v-model="orderType" hidden />
            🚗 Jemput ke lokasi
          </label>
          <label :class="{ active: orderType === 'dropoff' }">
            <input type="radio" value="dropoff" v-model="orderType" hidden />
            🚶 Antar sendiri
          </label>
        </div>
      </section>

      <!-- Alamat (jika pilih jemput) -->
      <section v-if="orderType === 'pickup'">
        <h3>Alamat Penjemputan</h3>
        <textarea
          v-model="address"
          rows="3"
          placeholder="Masukkan alamat lengkap..."
        />
        <p v-if="errors.address" class="error">{{ errors.address }}</p>

        <h3>Jadwal Penjemputan</h3>
        <input type="datetime-local" v-model="scheduledAt" :min="minDateTime" />
        <p v-if="errors.scheduledAt" class="error">{{ errors.scheduledAt }}</p>
      </section>

      <!-- Nomor HP -->
      <section>
        <h3>Nomor WhatsApp</h3>
        <input
          type="tel"
          v-model="phone"
          placeholder="Contoh: 08123456789"
        />
        <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
      </section>

      <!-- Catatan -->
      <section>
        <h3>Catatan (opsional)</h3>
        <textarea
          v-model="note"
          rows="2"
          placeholder="Contoh: ada baju putih, pisahkan ya"
        />
      </section>

      <!-- Estimasi Harga -->
      <section class="estimate" v-if="selectedServices.length && weight">
        <h3>Estimasi Harga</h3>
        <p>Rp {{ estimatedPrice.toLocaleString() }}</p>
        <small>*Harga final ditentukan setelah laundry ditimbang</small>
      </section>

      <!-- Submit -->
      <button type="submit" :disabled="orderStore.loading">
        {{ orderStore.loading ? 'Memproses...' : 'Pesan Sekarang' }}
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order'

const router = useRouter()
const orderStore = useOrderStore()

// Data layanan
const availableServices = [
  { id: 'wash', name: 'Cuci', icon: '🫧', price: 7000 },
  { id: 'wash_iron', name: 'Cuci + Setrika', icon: '👕', price: 10000 },
  { id: 'iron', name: 'Setrika', icon: '🔥', price: 5000 },
  { id: 'dry_clean', name: 'Dry Clean', icon: '✨', price: 25000 },
]

// Form state
const selectedServices = ref([])
const weight = ref(null)
const orderType = ref('pickup')
const address = ref('')
const scheduledAt = ref('')
const phone = ref('')
const note = ref('')
const errors = ref({})

// Minimum datetime = sekarang + 2 jam
const minDateTime = computed(() => {
  const now = new Date()
  now.setHours(now.getHours() + 2)
  return now.toISOString().slice(0, 16)
})

// Hitung estimasi harga
const estimatedPrice = computed(() => {
  if (!selectedServices.value.length || !weight.value) return 0
  return selectedServices.value.reduce((total, serviceId) => {
    const service = availableServices.find(s => s.id === serviceId)
    return total + (service ? service.price * weight.value : 0)
  }, 0)
})

// Validasi form
function validate() {
  errors.value = {}

  if (!selectedServices.value.length)
    errors.value.services = 'Pilih minimal satu layanan'

  if (!weight.value || weight.value < 1)
    errors.value.weight = 'Masukkan estimasi berat'

  if (orderType.value === 'pickup') {
    if (!address.value.trim())
      errors.value.address = 'Alamat wajib diisi'
    if (!scheduledAt.value)
      errors.value.scheduledAt = 'Jadwal penjemputan wajib diisi'
  }

  if (!phone.value.trim())
    errors.value.phone = 'Nomor WhatsApp wajib diisi'

  return Object.keys(errors.value).length === 0
}

// Submit
async function submitOrder() {
  if (!validate()) return

  await orderStore.createOrder({
    services: selectedServices.value,
    weight: weight.value,
    orderType: orderType.value,
    address: orderType.value === 'pickup' ? address.value : '',
    scheduledAt: orderType.value === 'pickup' ? scheduledAt.value : null,
    phone: phone.value,
    note: note.value,
    estimatedPrice: estimatedPrice.value,
  })

  router.push('/history')
}
</script>