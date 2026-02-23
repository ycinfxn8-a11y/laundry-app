<template>
  <div class="admin-order-detail" v-if="order">
    <button @click="router.back()">← Kembali</button>

    <h2>Order #{{ order.id.slice(0, 6).toUpperCase() }}</h2>

    <!-- Info Pelanggan -->
    <section>
      <h3>Pelanggan</h3>
      <p>{{ order.userName }}</p>
      <p>{{ order.phone }}</p>
    </section>

    <!-- Info Pesanan -->
    <section>
      <h3>Detail Pesanan</h3>
      <p>Layanan: {{ serviceNames(order.services) }}</p>
      <p>Berat: ~{{ order.weight }} kg</p>
      <p>Estimasi: Rp {{ order.estimatedPrice?.toLocaleString() }}</p>
      <p v-if="order.note">Catatan: {{ order.note }}</p>
    </section>

    <!-- Info Pengambilan -->
    <section>
      <h3>Metode</h3>
      <p v-if="order.orderType === 'pickup'">
        🚗 Jemput · {{ order.address }}<br />
        Jadwal: {{ formatDate(order.scheduledAt) }}
      </p>
      <p v-else>🚶 Antar sendiri</p>
    </section>

    <!-- Update Status -->
    <section>
      <h3>Status Saat Ini</h3>
      <span :class="['status', order.status]">{{ statusLabel[order.status] }}</span>

      <h3>Update Status</h3>
      <div class="status-buttons">
        <button
          v-for="s in nextStatuses"
          :key="s.value"
          @click="handleUpdateStatus(s.value)"
          :disabled="adminStore.loading"
          :class="s.value"
        >
          {{ s.label }}
        </button>
      </div>
    </section>

    <!-- Timestamp -->
    <section>
      <small>Dibuat: {{ formatDate(order.createdAt) }}</small><br />
      <small>Diupdate: {{ formatDate(order.updatedAt) }}</small>
    </section>
  </div>

  <div v-else>Memuat...</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/admin'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const { orders } = storeToRefs(adminStore)

onMounted(() => {
  if (!orders.value.length) adminStore.fetchAllOrders()
})

const order = computed(() =>
  orders.value.find(o => o.id === route.params.id)
)

// Tentukan tombol status berikutnya berdasarkan status saat ini
const nextStatuses = computed(() => {
  const flow = {
    pending: [
      { value: 'confirmed', label: '✅ Konfirmasi' },
    ],
    confirmed: [
      { value: 'picked_up', label: '🚗 Sudah Dijemput' },
      { value: 'processing', label: '🫧 Mulai Proses' },
    ],
    picked_up: [
      { value: 'processing', label: '🫧 Mulai Proses' },
    ],
    processing: [
      { value: 'done', label: '✨ Selesai' },
    ],
    done: [
      { value: 'delivered', label: '📦 Sudah Diantar' },
    ],
    delivered: []
  }
  return flow[order.value?.status] || []
})

async function handleUpdateStatus(status) {
  await adminStore.updateOrderStatus(order.value.id, status)
}

const statusLabel = {
  pending: '⏳ Menunggu',
  confirmed: '✅ Dikonfirmasi',
  picked_up: '🚗 Dijemput',
  processing: '🫧 Diproses',
  done: '✨ Selesai',
  delivered: '📦 Diantar'
}

function serviceNames(services) {
  const map = {
    wash: 'Cuci',
    wash_iron: 'Cuci + Setrika',
    iron: 'Setrika',
    dry_clean: 'Dry Clean'
  }
  return services?.map(s => map[s]).join(', ') || '-'
}

function formatDate(val) {
  if (!val) return '-'
  const date = val?.toDate ? val.toDate() : new Date(val)
  return date.toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>
```

---

### Alur Kerja Admin
```
Buka /admin → Lihat semua order
      ↓
Klik order → Lihat detail
      ↓
Klik tombol update status
      ↓
Firestore terupdate → User melihat perubahan realtime