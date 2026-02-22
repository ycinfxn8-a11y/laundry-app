<template>
  <div class="home-page">

    <!-- Header -->
    <div class="header">
      <div>
        <p>Halo, {{ user?.displayName?.split(' ')[0] }} 👋</p>
        <h2>Mau laundry hari ini?</h2>
      </div>
      <button @click="handleLogout">Keluar</button>
    </div>

    <!-- Aksi Utama -->
    <div class="actions">
      <router-link to="/order" class="btn-primary">
        🧺 Buat Pesanan
      </router-link>
      <router-link to="/history" class="btn-secondary">
        📋 Riwayat Pesanan
      </router-link>
    </div>

    <!-- Status Pesanan Terakhir -->
    <div v-if="latestOrder" class="latest-order">
      <h3>Pesanan Terakhir</h3>
      <div class="order-card">
        <div class="order-header">
          <span>#{{ latestOrder.id.slice(0, 6).toUpperCase() }}</span>
          <span :class="['status', latestOrder.status]">
            {{ statusLabel[latestOrder.status] }}
          </span>
        </div>
        <p>{{ serviceNames(latestOrder.services) }} · ~{{ latestOrder.weight }} kg</p>
        <router-link to="/history">Lihat semua →</router-link>
      </div>
    </div>

    <!-- Link Admin (hanya jika role admin) -->
    <div v-if="isAdmin" class="admin-link">
      <router-link to="/admin">🔧 Buka Dashboard Admin</router-link>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useOrderStore } from '../stores/order'
import { storeToRefs } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const { user } = storeToRefs(authStore)

const isAdmin = ref(false)

onMounted(async () => {
  // Ambil order user
  orderStore.fetchOrders()

  // Cek role admin
  if (user.value) {
    const userDoc = await getDoc(doc(db, 'users', user.value.uid))
    isAdmin.value = userDoc.data()?.role === 'admin'
  }
})

// Ambil order paling baru
const latestOrder = computed(() => {
  if (!orderStore.orders.length) return null
  return orderStore.orders[0]
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
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
</script>