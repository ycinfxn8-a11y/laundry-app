<script setup>
import { watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { storeToRefs } from 'pinia'
import { initOneSignal } from './onesignal'
import { useOneSignal } from '@onesignal/onesignal-vue3'

const oneSignal = useOneSignal()
console.log('OneSignal object:', oneSignal)
console.log('Notifications:', oneSignal.Notifications)

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
