import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const auth = getAuth()

  // Pantau status login
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    loading.value = false
  })

  // Login dengan Google
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  // Logout
  async function logout() {
    await signOut(auth)
  }

  return { user, loading, loginWithGoogle, logout }
})