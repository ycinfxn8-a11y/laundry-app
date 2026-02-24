<script setup>
import { watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { storeToRefs } from 'pinia'
import { initOneSignal } from './onesignal'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

watch(user, (newUser) => {
  if (newUser) initOneSignal(newUser.uid)
}, { immediate: true })
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
