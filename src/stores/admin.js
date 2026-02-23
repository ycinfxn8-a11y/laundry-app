import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore'
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

  // Update status order
  async function updateOrderStatus(orderId, status) {
    loading.value = true
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: serverTimestamp()
      })
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