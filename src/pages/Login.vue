<template>
  <div class="login">
    <h1>🧺 Laundry App</h1>
    <p>Masuk untuk mulai pesan</p>
    <button @click="handleLogin">
      Masuk dengan Google
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

async function handleLogin() {
  await auth.loginWithGoogle()
  router.push('/')
}
</script>