import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuthStore } from './auth'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const loading = ref(false)
  const authStore = useAuthStore()

  // Ambil semua order milik user (realtime)
  function fetchOrders() {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', authStore.user.uid)
    )

    onSnapshot(q, (snapshot) => {
      orders.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    })
  }

  // Buat order baru
  async function createOrder(orderData) {
    loading.value = true
    try {
      await addDoc(collection(db, 'orders'), {
        ...orderData,
        userId: authStore.user.uid,
        userName: authStore.user.displayName,
        userPhone: authStore.user.phoneNumber || '',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } finally {
      loading.value = false
    }
  }

  return { orders, loading, fetchOrders, createOrder }
})