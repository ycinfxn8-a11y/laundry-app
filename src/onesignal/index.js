import { useOneSignal } from '@onesignal/onesignal-vue3'

export async function initOneSignal(userId) {
  const oneSignal = useOneSignal()

  // Hubungkan OneSignal dengan UID Firebase
  await oneSignal.login(userId)

  // Minta izin notifikasi
  await oneSignal.Notifications.requestPermission()

  console.log('OneSignal linked to user:', userId)
  console.log('Permission:', oneSignal.Notifications.permission)
}

export async function sendPushNotification(userId, title, body) {
  if (!userId) return

  try {
    const res = await fetch('/.netlify/functions/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, body })
    })

    const data = await res.json()
    console.log('Response notifikasi:', data)
  } catch (err) {
    console.error('Error kirim notif:', err)
  }
}