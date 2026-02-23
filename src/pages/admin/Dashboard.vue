<template>
  <div class="admin-dashboard">
    <h2>🧺 Admin Dashboard</h2>

    <!-- Statistik -->
    <div class="stats">
      <div class="stat-card">
        <span>Total</span>
        <strong>{{ adminStore.stats.total }}</strong>
      </div>
      <div class="stat-card pending">
        <span>Menunggu</span>
        <strong>{{ adminStore.stats.pending }}</strong>
      </div>
      <div class="stat-card processing">
        <span>Diproses</span>
        <strong>{{ adminStore.stats.processing }}</strong>
      </div>
      <div class="stat-card done">
        <span>Selesai</span>
        <strong>{{ adminStore.stats.done }}</strong>
      </div>
    </div>

    <!-- Filter Status -->
    <div class="filters">
      <button
        v-for="f in filters"
        :key="f.value"
        :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Daftar Order -->
    <div v-if="!filteredOrders.length" class="empty">
      Tidak ada pesanan.
    </div>

    <div
      v-for="order in filteredOrders"
      :key="order.id"
      class="order-card"
      @click="router.push(`/admin/order/${order.id}`)"
    >
      <div class="order-header">
        <span class="order-id">#{{ order.id.slice(0, 6).toUpperCase() }}</span>
        <span :class="['status', order.status]">{{ statusLabel[order.status] }}</span>
      </div>

      <p><strong>{{ order.userName }}</strong> · {{ order.phone }}</p>
      <p>{{ serviceNames(order.services) }} · ~{{ order.weight }} kg</p>
      <p v-if="order.orderType === 'pickup'">
        🚗 {{ order.address }} · {{ formatDate(order.scheduledAt) }}
      </p>
      <p v-else>🚶 Antar sendiri</p>
      <p>Estimasi: <strong>Rp {{ order.estimatedPrice?.toLocaleString() }}</strong></p>

      <small>{{ formatDate(order.createdAt) }}</small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/admin'
import { storeToRefs } from 'pinia'

const router = useRouter()
const adminStore = useAdminStore()
const { orders } = storeToRefs(adminStore)

onMounted(() => adminStore.fetchAllOrders())

const activeFilter = ref('all')

const filters = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Dikonfirmasi', value: 'confirmed' },
  { label: 'Dijemput', value: 'picked_up' },
  { label: 'Diproses', value: 'processing' },
  { label: 'Selesai', value: 'done' },
  { label: 'Diantar', value: 'delivered' },
]

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeFilter.value)
})

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
    day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>