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
  console.log('Kirim notif ke userId:', userId)
  if (!userId) return

  try {
    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${import.meta.env.VITE_ONESIGNAL_API_KEY}`
      },
      body: JSON.stringify({
        app_id: import.meta.env.VITE_ONESIGNAL_APP_ID,
        target_channel: 'push',
        include_aliases: {
          external_id: [userId]
        },
        headings: { en: title },
        contents: { en: body },
      })
    })

    const data = await res.json()
    console.log('Response OneSignal:', data)
  } catch (err) {
    console.error('Error kirim notif:', err)
  }
}