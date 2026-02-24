import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore'
import { sendPushNotification } from '../onesignal'
import { db } from '../firebase/config'

export const useAdminStore = defineStore('admin', () => {
  const orders = ref([])
  const loading = ref(false)

  // Ambil semua order realtime
  function fetchAllOrders() {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    )

    onSnapshot(q, (snapshot) => {
      orders.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    })
  }

const statusMessages = {
  confirmed:  'Pesanan kamu sudah dikonfirmasi! ✅',
  picked_up:  'Laundry kamu sedang dalam perjalanan 🚗',
  processing: 'Laundry kamu sedang diproses 🫧',
  done:       'Laundry kamu sudah selesai! ✨',
  delivered:  'Laundry sudah diantar, terima kasih! 📦',
}

async function updateOrderStatus(orderId, status) {
  loading.value = true
  try {
    const order = orders.value.find(o => o.id === orderId)

    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: serverTimestamp()
    })

    // Kirim notif langsung pakai userId dari order
    await sendPushNotification(
      order.userId,
      '🧺 Update Pesanan Laundry',
      statusMessages[status] || 'Status pesanan kamu diperbarui'
    )
  } finally {
    loading.value = false
  }
}

  // Statistik sederhana
  const stats = computed(() => {
    return {
      total: orders.value.length,
      pending: orders.value.filter(o => o.status === 'pending').length,
      processing: orders.value.filter(o => o.status === 'processing').length,
      done: orders.value.filter(o => o.status === 'done').length,
    }
  })

  return { orders, loading, stats, fetchAllOrders, updateOrderStatus }
})