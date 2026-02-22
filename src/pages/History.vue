<template>
  <div class="history-page">
    <h2>Pesanan Saya</h2>

    <div v-if="!orders.length" class="empty">
      Belum ada pesanan.
      <router-link to="/order">Buat pesanan pertama</router-link>
    </div>

    <div v-for="order in orders" :key="order.id" class="order-card">
      <div class="order-header">
        <span class="order-id">#{{ order.id.slice(0, 6).toUpperCase() }}</span>
        <span :class="['status', order.status]">{{ statusLabel[order.status] }}</span>
      </div>

      <p>{{ serviceNames(order.services) }}</p>
      <p>~{{ order.weight }} kg · Rp {{ order.estimatedPrice?.toLocaleString() }}</p>
      <p v-if="order.orderType === 'pickup'">
        🚗 Jemput · {{ formatDate(order.scheduledAt) }}
      </p>
      <p v-else>🚶 Antar sendiri</p>

      <small>{{ formatDate(order.createdAt) }}</small>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrderStore } from '../stores/order'
import { storeToRefs } from 'pinia'

const orderStore = useOrderStore()
const { orders } = storeToRefs(orderStore)

onMounted(() => orderStore.fetchOrders())

const statusLabel = {
  pending: '⏳ Menunggu Konfirmasi',
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