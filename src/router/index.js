import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import Home from '../pages/Home.vue'
import Order from '../pages/Order.vue'
import History from '../pages/History.vue'
import Login from '../pages/Login.vue'

import AdminDashboard from '../pages/admin/Dashboard.vue'
import AdminOrderDetail from '../pages/admin/OrderDetail.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/order', component: Order, meta: { requiresAuth: true } },
  { path: '/history', component: History, meta: { requiresAuth: true } },

  // Admin routes
  { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/order/:id', component: AdminOrderDetail, meta: { requiresAuth: true, requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Cek auth sebelum pindah halaman
router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  if (to.meta.requiresAdmin) {
    const db = getFirestore()
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const role = userDoc.data()?.role

    if (role !== 'admin') return next('/')
  }

  next()
})

export default router